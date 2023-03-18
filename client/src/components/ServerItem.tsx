
import React, {ReactNode, useEffect, useState} from 'react';
import { StreamApplication } from '../providers/stream';
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";

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
    const [imageSrc, setImageSrc] = useState("/hls/" + application.name.split('/').pop() + ".jpg");
    const channels = application.channels == 1 ? "Mono" : "Stereo";
    const {
        hostname
    } = window.location;

    const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const element = event.target as HTMLLinkElement;
        navigator.clipboard.writeText(element.getAttribute('href') || "").then(() => {
            console.log('success');
            /* clipboard successfully set */
          }, () => {
            console.log('failure');
            /* clipboard write failed */
          });
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setImageSrc("/hls/" + application.name.split('/').pop() + ".jpg?" + Date.now());
        }, 1400);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
        " cursor-pointer w-full shadow-inner border border-slate-700" +
        " transition-colors hover:border-slate-600";

    return (
        <li className={`${defaultItemClasses}`}>
            <div className="w-48">
                <img className="w-full" src={imageSrc} />
            </div>
            <div className="mx-2 w-full">
                <h3 className="flex justify-between">
                    <a className="underline" href={`rtmp://${hostname}:1935${application.name}`} onClick={onClick}>{application.name} <DocumentDuplicateIcon className="inline w-4 h-4" /></a>
                    {
                        false
                            ? <div className="text-sm bg-red-700 rounded-full inline-block px-2">LIVE</div>
                            : <div className="text-sm bg-zinc-600 rounded-full rounded inline-block px-2">WAITING</div>
                    }
                </h3>
                <h4 className="text-sm text-gray-400">
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
                </h4>
            </div>
            <div>
                {/* {iconElement(broadcastItem)} */}
            </div>
        </li>
    );
}

export default ServerItem;
