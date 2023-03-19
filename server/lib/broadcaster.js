const { spawn } = require('node:child_process');
const crypto = require('crypto');
const feedsDb = require('./feeds-db');
const platformDb = require('./platform-db');
const axios = require('axios');
const fs = require('fs')

// "rtmp://localhost:1935/live/tommy-123"
// [f=flv]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW

function nginxConfigTemplate(urls) {
    const pushUrls = urls.map(url => `push    ${url};`).join('\n')
    return `    server {
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

#             record         all;
#             record_path    /var/www/html/videos;
#             record_suffix  -%d-%b-%y-%T.flv;
#             record_append  on;

            exec_push  ffmpeg -i rtmp://localhost:1935/live/$name -r 0.8 -s 320x180 -update 1 /var/www/html/thumbs/$name.jpg -y;
            exec_record_done /var/scripts/record_done.sh $path $dirname/$basename;

            on_play         http://localhost:3000/api/nginx;
            on_publish      http://localhost:3000/api/nginx;
        }
        
        application broadcast {
            live            on;
            record          off;

            on_publish      http://localhost:3000/api/nginx;

${pushUrls}
        }
    }`;
}

class BroadcastWorker {
    constructor() {
        this.inputName = "";
        this.currentBroadcastRunning = false;
        this.currentBroadcastTimeout = false;
        this.currentBroadcastName = "";
        this.currentOutputUrls = [];
        this.reloadNginxConfig();
    }
    spawnProcess() {
        if(this.currentBroadcastName === "") {
            return;
        }
        // create the process attach stuff
        // ffmpeg -analyzeduration 0 -i "rtmp://localhost:1935/live/${name} live=1" -f flv rtmp://localhost:1935/broadcast/${name}
        // ffmpeg -analyzeduration 0 -i "rtmp://localhost:1935/live/tommy-123 live=1" -f flv rtmp://localhost:1935/broadcast/tommy-123
        this.broadcastProcess = spawn("ffmpeg", [
            "-analyzeduration", "0",
            "-i", `rtmp://localhost:1935/live/${this.currentBroadcastName} live=1`,
            "-f", "flv",
            `rtmp://localhost:1935/broadcast/${this.currentBroadcastName}`
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
        return axios.get(`/control/drop/publisher?app=broadcast&name=${this.currentBroadcastName}`)
                    .then((response) => {
                        if(response.status >= 200 && response.status < 300) {
                            return response;
                        }
                        throw Error(response);
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
    updateOutputUrls(outputUrls) {
        this.outputUrls = outputUrls
        if(this.outputUrls.join('') !== this.currentOutputUrls.join('')) {
            this.currentOutputUrls = this.outputUrls;
            this.reloadNginxConfig();
        }
    }
    reloadNginxConfig() {
        const nginxConfig = nginxConfigTemplate(this.currentOutputUrls);
        try {
            fs.rmSync("/var/nginx-configs/push-servers.conf", {force:true});
        } catch(e) {}
        fs.writeFileSync("/var/nginx-configs/push-servers.conf", nginxConfig)
        const nginxProcess = spawn("nginx", [
            "-s", "reload",
        ], {
            detached: true,
            stdio: "pipe"
        });
        nginxProcess.on('close', () => {

        });
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
        const foundPlatforms = platforms.filter(platform => (platform.activated)).map(platform => (platform.url));
        worker.updateOutputUrls(foundPlatforms);
    }, 1000);
};