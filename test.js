const { spawn } = require('node:child_process');
const path = require('path');

function spawnProcess() {
    const p = spawn("ffmpeg", [
        "-rw_timeout", "5000000",
        "-i", "rtmp://localhost:1935/live/tommy-123",
        "-rtmp_live", "live",
        "-c", "copy",
        "-f", "tee",
        "-map", "0:v",
        "-map", "0:a",
        "[f=flv]rtmp://dfw.contribute.live-video.net/app/live_73510364_K9Dm0HjghYY7CF75BdHbKtZGNtfWcW"
    ], {
        detached: true,
        stdio: "pipe"
    });
    p.stdout.on('data', (data) => {
        console.log(`stdout ${data}`);
    }); // never used??
    const regexMatch = /frame= *([^\s]+) fps= *([^\s]+) q= *([^\s]+) size= *([^\s]+) time= *([^\s]+) bitrate= *([^\s]+) speed= *([^\s]+)/;
    let timeout;
    p.stderr.on('data', (data) => {
        const matches = data.toString().match(regexMatch);
        if(matches) {
            const [full, frame, fps, q, size, time, bitrate, speed] = matches;
            console.log(matches);
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                p.kill();
            }, 5000);
        }
    });
    p.on('close', (code) => {
        console.log('closed', code); // code is last DTS??
        setTimeout(() => {
            spawnProcess();
        }, 1000);
    });

    // frame=  258 fps= 39 q=-1.0 size=N/A time=00:00:09.68 bitrate=N/A speed=1.47x
    // [tee @ 000001b331e50900] Non-monotonous DTS in output stream 0:1; previous: 10211, current: -10820; changing to 10212. This may result in incorrect timestamps in the output file.

}

spawnProcess();