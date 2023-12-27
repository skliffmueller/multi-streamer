const { spawn } = require('node:child_process');
const crypto = require('crypto');
const feedsDb = require('./feeds-db');
const platformDb = require('./platform-db');
const axios = require('axios');
const fs = require('fs')

// "rtmp://localhost:1935/live/tommy-123"
// [f=flv]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW

function nginxConfigTemplate(platforms) {
    return `
    server {
        listen          1935 so_keepalive=off;
        ping            5s;
        ping_timeout    3s;
        timeout         10s;
        chunk_size      4096;
        buflen          200ms;
        
        application live {
            live        on;
            meta        copy;
            wait_key    on;

            record         all;
            record_path    /var/www/html/videos;
            record_suffix  -%d-%b-%y-%T.flv;
            record_append  on;

            exec_push  ffmpeg -i rtmp://localhost:1935/live/$name -r 0.8 -s 320x180 -update 1 /var/www/html/thumbs/$name.jpg -y;
            exec_record_done /var/scripts/record_done.sh $path $dirname/$basename;

            on_play         http://localhost:3000/api/nginx;
            on_publish      http://localhost:3000/api/nginx;
        }

    ${platforms.map(({ name, url }) => (`
        application ${name} {
            live                    on;
            meta                    copy;
            record                  off;

            on_publish              http://localhost:3000/api/nginx;
            push                    ${url};
        }
    `)).join('\n')}

    }`;
}
class BroadcastWorker {
    constructor() {
        this.inputName = "";
        this.currentBroadcastRunning = false;
        this.currentBroadcastTimeout = false;
        this.currentBroadcastName = "";
        this.currentOutputUrls = [];
        this.platforms = [];
        this.processConfigChecksum = "";
        this.writeNewNginxConfig();
        this.reloadNginxConfig();

    }
    updatePlatforms(platforms) {
        const sortedPlatforms = platforms.map((platform) => ({
            ...platform,
            name: platform.name.toLowerCase(),
        })).sort((a, b) => (a.name.localeCompare(b.name)));

        const checksumString = sortedPlatforms.map((platform) => (`${platform.name}:${platform.url}`)).join('|');
        const newChecksum = BroadcastWorker.generateChecksum(checksumString);

        if(this.processConfigChecksum !== newChecksum) {
            this.processConfigChecksum = newChecksum;
            this.platforms = sortedPlatforms;
            this.writeNewNginxConfig();
            this.reloadNginxConfig();
        }

    }
    writeNewNginxConfig() {
        const nginxConfig = nginxConfigTemplate(this.platforms);
        try {
            fs.rmSync("/var/nginx-configs/push-servers.conf", {force:true});
        } catch(e) {}
        fs.writeFileSync("/var/nginx-configs/push-servers.conf", nginxConfig)
    }
    reloadNginxConfig() {
        const nginxProcess = spawn("nginx", [
            "-s", "stop",
        ], {
            detached: true,
            stdio: "pipe"
        });
        nginxProcess.on('close', () => {

        });
    }
    static generateChecksum(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf8')
            .digest('hex')
    }

    updateFeed(inputFeed) {
        this.feed = inputFeed;
    }
    spawnProcess() {
        if(this.currentBroadcastName === "") {
            return;
        }
        // create the process attach stuff
        // ffmpeg -analyzeduration 0 -i "rtmp://localhost:1935/live/${name} live=1" -f flv rtmp://localhost:1935/broadcast/${name}
        // ffmpeg -analyzeduration 0 -i "rtmp://localhost:1935/live/tommy-123 live=1" -f flv rtmp://localhost:1935/broadcast/tommy-123
        const outputUrls = this.platforms.map((platform) => `[f=flv]rtmp://localhost:1935/${platform.name}/${this.currentBroadcastName}`).join('|');
        this.broadcastProcess = spawn("ffmpeg", [
            "-analyzeduration", "0",
            "-i", `rtmp://localhost:1935/live/${this.currentBroadcastName}`,
            "-rtmp_live", "live",
            "-c", "copy",
            "-f", "tee",
            "-map", "0:v",
            "-map", "0:a",
            outputUrls,
        ], {
            detached: true,
            stdio: "pipe"
        });
        const regexMatch = /frame= *([^\s]+) fps= *([^\s]+) q= *([^\s]+) size= *([^\s]+) time= *([^\s]+) bitrate= *([^\s]+) speed= *([^\s]+)/;

        this.broadcastProcess.stderr.on('data', (data) => {
            this.currentBroadcastRunning = true;
            console.log(data.toString());
            const matches = data.toString().match(regexMatch);
            if(matches) {
                const [full, frame, fps, q, size, time, bitrate, speed] = matches;
                clearTimeout(this.inputTimeout);
                this.inputTimeout = setTimeout(() => {
                    this.currentBroadcastTimeout = true;
                    this.broadcastProcess.kill();
                }, 5000);
            }
        });
        this.broadcastProcess.on('close', (code) => {
            clearTimeout(this.inputTimeout);
            console.log('closed', code); // code is last DTS??
            this.currentBroadcastRunning = false;
            if(this.currentBroadcastTimeout) {
                this.currentBroadcastTimeout = false;
                this.spawnProcess();
                return;
            }
            if(this.inputName !== this.currentBroadcastName) {
                this.currentBroadcastName = this.inputName;
                this.spawnProcess();
                return;
            }
            this.currentBroadcastName = "";
        });
    }
    dropPublisher() {
        // http://localhost/control/drop/publisher
        // app=broadcast&name=${name}
        return axios.get(`/control/drop/publisher?app=${this.platforms[0].name}&name=${this.currentBroadcastName}`)
            .then((response) => {
                if(response.status >= 200 && response.status < 300) {
                    return response;
                }
                throw Error(response);
            }).catch((response) => {
                return response;
            });

    }
    updateInputName(inputName) {
        this.inputName = inputName;
        if(this.inputName !== this.currentBroadcastName) {

            if(this.currentBroadcastName === "") {
                this.currentBroadcastName = this.inputName;
                this.spawnProcess();
                return;
            } else {
                // dropPublisher
                this.dropPublisher().then((response) => {

                }).catch(e => {
                  console.log(e);
                })
            }
        }
    }
}

module.exports = function() {
    const worker = new BroadcastWorker();
    // http://localhost/control/drop/publisher
    // app=broadcast&name=${name}
    setInterval(async () => {
        const feeds = await feedsDb.getFeeds();
        const foundFeed = feeds.find(feed => (feed.broadcast && feed.application && feed.application.publishing));
        if(foundFeed) {
            worker.updateInputName(foundFeed.key);
        } else {
            worker.updateInputName("");
        }

        const platforms = await platformDb.getPlatforms();
        const foundPlatforms = platforms.filter(platform => (platform.activated));
        worker.updatePlatforms(foundPlatforms);
    }, 1000);
};