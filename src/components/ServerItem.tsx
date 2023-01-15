
import React, {ReactNode} from 'react';
import { StreamApplication } from '../providers/stream';

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

function humanReadableBytes(bytes: number): string {
    if(bytes >= GB) {
        return (bytes / GB).toFixed(1) + "gb";
    } else if(bytes >= MB) {
        return (bytes / MB).toFixed(1) + "mb";
    }
    return (bytes / KB).toFixed(1) + "kb";
}

function secondsToTime(seconds: number) {
    const ms = seconds % 1;
    seconds -= ms;
    const s = seconds % 60;
    seconds -= s;
    const msecs = (seconds % 3600);
    const m = msecs / 60;
    seconds -= msecs;
    const h = seconds / 3600;

    return h
            ? `${h}h ${doubleZero(m)}m ${doubleZero(s)}s`
            : `${m}m ${doubleZero(s)}s`;
}

function doubleZero(value: number) {
    return value < 10
                ? `0${value}`
                : `${value}`;
}
function ServerItem(application: StreamApplication) {
    const channels = application.channels == 1 ? "Mono" : "Stereo";
    return (
        <div className="text-gray-100 py-1 px-3 border w-64">
            <h1 className="flex justify-between items-center  text-lg font-bold">
                {application.name}
                {
                    application.publishing
                        ? <div className="text-sm bg-red-600 rounded inline-block px-1">LIVE</div>
                        : <div className="text-sm bg-zinc-600 rounded inline-block px-1">WAITING</div>
                }
            </h1>
            <div className="flex justify-between items-center">
                <div>{secondsToTime(application.time/1000)}</div>
                <div>{humanReadableBytes(application.bytesIn)} / {humanReadableBytes(application.bytesOut)}</div>
            </div>
            <div className="flex justify-between items-center">
                <div>{application.videoCodec}</div>
                <div>{application.width}x{application.height}</div>
            </div>
            <div className="flex justify-between items-center">
                <div>{application.audioCodec}</div>
                <div>{channels} {(application.sampleRate/1000).toFixed(1)}khz</div>
            </div>
        </div>
    );
}

export default ServerItem;
