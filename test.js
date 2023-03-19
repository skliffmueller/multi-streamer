const { spawn } = require('node:child_process');
const path = require('path');

let p;
// "rtmp://localhost:1935/live/tommy-123"
// [f=flv]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW
function spawnProcess(inputStream, outputStreams) {
    if(p && !p.killed) {
        p.kill();
    }
    const outputString = outputStreams.map((streamUrl) => `[f=flv]${streamUrl}`).join('|');
    const refreshProcess = () => {
        p = spawn("ffmpeg", [
            "-rw_timeout", "5000000",
            "-i", inputStream,
            "-rtmp_live", "live",
            "-c", "copy",
            "-f", "tee",
            "-map", "0:v",
            "-map", "0:a",
            outputString
        ], {
            detached: true,
            stdio: "pipe"
        });
        p.stdout.on('data', (data) => {
            // console.log(`stdout ${data}`);
        }); // never used??
        const regexMatch = /frame= *([^\s]+) fps= *([^\s]+) q= *([^\s]+) size= *([^\s]+) time= *([^\s]+) bitrate= *([^\s]+) speed= *([^\s]+)/;
        let timeout;
        p.stderr.on('data', (data) => {
            const matches = data.toString().match(regexMatch);
            if(matches) {
                const [full, frame, fps, q, size, time, bitrate, speed] = matches;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    p.kill();
                }, 5000);
            }
        });
        p.on('close', (code) => {
            console.log('closed', code); // code is last DTS??
            setTimeout(() => {
                refreshProcess();
            }, 1000);
        });
    }
}

module.exports = { spawnProcess };