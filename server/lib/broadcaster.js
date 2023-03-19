const { spawn } = require('node:child_process');
const crypto = require('crypto');
const feedsDb = require('./feeds-db');
const platformDb = require('./platform-db');

// "rtmp://localhost:1935/live/tommy-123"
// [f=flv]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW

class BroadcastWorker {
    constructor() {
        this.inputStream = "";
        this.inputChecksum = "";
        this.outputStreams = [];
        this.outputChecksum = "";
        this.inputProcess = null;
        this.outputProcess = null;
        this.inputTimeout = null;
        this.outputTimeout = null;
    }
    updateInputStream(inputStream) {
        this.inputStream = inputStream;
        if(this.inputStream === "") {
            this.inputChecksum = "";
            if(this.inputProcess && !this.inputProcess.killed) {
                this.inputProcess.kill();
            }
            return;
        }
        const newChecksum = BroadcastWorker.generateChecksum(this.inputStream);

        if(newChecksum !== this.inputChecksum) {
            this.inputChecksum = newChecksum;
            if(this.inputProcess && !this.inputProcess.killed) {
                this.inputProcess.kill();
            }
            this._spawnInputProcess();
        } else if(!this.inputProcess || this.inputProcess.killed) {
            this._spawnInputProcess();
        }
    }
    updateOutputStreams(outputStreams) {
        this.outputStreams = outputStreams;

        if(this.outputStreams.length === 0) {
            this.outputChecksum = "";
            if(this.outputProcess && !this.outputProcess.killed) {
                this.outputProcess.kill();
            }
            return;
        }
        const newChecksum = BroadcastWorker.generateChecksum(this.outputStreams.join(''));

        if(newChecksum !== this.outputChecksum) {
            this.outputChecksum = newChecksum;
            if(this.outputProcess && !this.outputProcess.killed) {
                this.outputProcess.kill();
            }
            this._spawnOutputProcess();
        } else if(!this.outputProcess || this.outputProcess.killed) {
            this._spawnOutputProcess();
        }
    }
    _spawnInputProcess() {
        this.inputProcess = spawn("ffmpeg", [
            "-i", this.inputStream,
            "-c", "copy",
            "-f", "flv",
            "rtmp://localhost:1935/hls/broadcast"
        ], {
            detached: true,
            stdio: "pipe"
        });
        const regexMatch = /frame= *([^\s]+) fps= *([^\s]+) q= *([^\s]+) size= *([^\s]+) time= *([^\s]+) bitrate= *([^\s]+) speed= *([^\s]+)/;

        this.inputProcess.stderr.on('data', (data) => {
            console.log(data.toString());
            const matches = data.toString().match(regexMatch);
            if(matches) {
                const [full, frame, fps, q, size, time, bitrate, speed] = matches;
                clearTimeout(this.inputTimeout);
                this.inputTimeout = setTimeout(() => {
                    this.inputProcess.kill();
                    this._spawnInputProcess();
                }, 5000);
            }
        });
        this.inputProcess.on('close', (code) => {
            clearTimeout(this.inputTimeout);
            console.log('closed', code); // code is last DTS??
        });
    }
    //ffmpeg -re -i https://streamsite.com/stream/streamsource.m3u8
    // -c:v copy -c:a aac -ar 44100 -ab 128k -ac 2 -strict -2
    // -flags +global_header -bsf:a aac_adtstoasc -bufsize 2500k -f flv rtmp://a.rtmp.youtube.com/live2/YOUTUBESTREAMKEYHERE
    _spawnOutputProcess() {
        const outputString = this.outputStreams.map((streamUrl) => `[f=flv:bfs/a=aac_adtstoasc]${streamUrl}`).join('|');
        this.outputProcess = spawn("ffmpeg", [
            "-i", "/tmp/hls/broadcast.m3u8",
            "-c", "copy",
            "-f", "tee",
            "-map", "0:v",
            "-map", "0:a",
            outputString
        ], {
            detached: true,
            stdio: "pipe"
        });
        const regexMatch = /frame= *([^\s]+) fps= *([^\s]+) q= *([^\s]+) size= *([^\s]+) time= *([^\s]+) bitrate= *([^\s]+) speed= *([^\s]+)/;

        this.outputProcess.stderr.on('data', (data) => {
            console.log(data.toString());
            const matches = data.toString().match(regexMatch);
            if(matches) {
                const [full, frame, fps, q, size, time, bitrate, speed] = matches;
                clearTimeout(this.outputTimeout);
                this.outputTimeout = setTimeout(() => {
                    this.outputProcess.kill();
                    this._spawnOutputProcess();
                }, 5000);
            }
        });
        this.outputProcess.on('close', (code) => {
            clearTimeout(this.outputTimeout);
            console.log('closed', code); // code is last DTS??
        });
    }
    static generateChecksum(str) {
        return crypto
            .createHash('md5')
            .update(str, 'utf8')
            .digest('hex')
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
            worker.updateInputStream(`rtmp://localhost:1935/live/${foundFeed.key}`);
        } else {
            worker.updateInputStream("");
        }
        const platforms = await platformDb.getPlatforms();
        const outputStreams = platforms.filter(platform => (platform.activated)).map(platform => platform.url);
        worker.updateOutputStreams(outputStreams);
    }, 1000);
};