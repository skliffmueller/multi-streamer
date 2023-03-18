
import React, {ReactNode, useEffect, useState} from 'react';
import { DocumentDuplicateIcon, ArrowPathIcon, ExclamationTriangleIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useRecordingsContext } from '../../providers/recordings';

// const KB = 1024;
// const MB = KB * 1024;
// const GB = MB * 1024;

// function humanReadableBytes(bytes: number): string {
//     if(bytes >= GB) {
//         return (bytes / GB).toFixed(1) + "gb";
//     } else if(bytes >= MB) {
//         return (bytes / MB).toFixed(1) + "mb";
//     }
//     return (bytes / KB).toFixed(1) + "kb";
// }

// function secondsToTime(seconds: number) {
//     const ms = seconds % 1;
//     seconds -= ms;
//     const s = seconds % 60;
//     seconds -= s;
//     const msecs = (seconds % 3600);
//     const m = msecs / 60;
//     seconds -= msecs;
//     const h = seconds / 3600;

//     return h
//             ? `${h}h ${doubleZero(m)}m ${doubleZero(s)}s`
//             : `${m}m ${doubleZero(s)}s`;
// }

// function doubleZero(value: number) {
//     return value < 10
//                 ? `0${value}`
//                 : `${value}`;
// }
// function ServerItem(application: StreamApplication) {
//     const [imageSrc, setImageSrc] = useState("/hls/" + application.name.split('/').pop() + ".jpg");
//     const channels = application.channels == 1 ? "Mono" : "Stereo";
//     const {
//         hostname
//     } = window.location;

//     const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
//         event.preventDefault();
//         const element = event.target as HTMLLinkElement;
//         navigator.clipboard.writeText(element.getAttribute('href') || "").then(() => {
//             console.log('success');
//             /* clipboard successfully set */
//           }, () => {
//             console.log('failure');
//             /* clipboard write failed */
//           });
//     }
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setImageSrc("/hls/" + application.name.split('/').pop() + ".jpg?" + Date.now());
//         }, 1400);
//         return () => {
//             clearInterval(interval);
//         }
//     }, []);

//     const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
//         " cursor-pointer w-full shadow-inner border border-slate-700" +
//         " transition-colors hover:border-slate-600";

//     return (
//         <li className={`${defaultItemClasses}`}>
//             <div className="w-48">
//                 <img className="w-full" src={imageSrc} />
//             </div>
//             <div className="mx-2 w-full">
//                 <h3 className="flex justify-between">
//                     <a className="underline" href={`rtmp://${hostname}:1935${application.name}`} onClick={onClick}>{application.name} <DocumentDuplicateIcon className="inline w-4 h-4" /></a>
//                     {
//                         false
//                             ? <div className="text-sm bg-red-700 rounded-full inline-block px-2">LIVE</div>
//                             : <div className="text-sm bg-zinc-600 rounded-full rounded inline-block px-2">WAITING</div>
//                     }
//                 </h3>
//                 <h4 className="text-sm text-gray-400">
//                     <div className="flex justify-between items-center">
//                         <div>{secondsToTime(application.time/1000)}</div>
//                         <div>{humanReadableBytes(application.bytesIn)} / {humanReadableBytes(application.bytesOut)}</div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                         <div>{application.videoCodec}</div>
//                         <div>{application.width}x{application.height}</div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                         <div>{application.audioCodec}</div>
//                         <div>{channels} {(application.sampleRate/1000).toFixed(1)}khz</div>
//                     </div>
//                 </h4>
//             </div>
//             <div>
//                 {/* {iconElement(broadcastItem)} */}
//             </div>
//         </li>
//     );
// }

function doubleZero(value: number) {
    return value < 10
                ? `0${value}`
                : `${value}`;
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

function dateFormater(date: Date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let day = `${date.getDate()}`;
    // get month from 0 to 11
    const month = months[date.getMonth()];
    // conver month digit to month name
    const year = date.getFullYear();
  
    // show date in two digits
    if (parseInt(day) < 10) {
      day = '0' + day;
    }
  
    const hour = date.getHours();
    let minute = `${date.getMinutes()}`;
    if (parseInt(minute) < 10) {
        minute = '0' + minute;
      }

    // now we have day, month and year
    // arrange them in the format we want
    return `${month} ${day}, ${year} ${hour > 12 ? hour-12 : hour}:${minute}${hour > 12 ? 'pm' : 'am'}`;
}

function RecordingsList() {
    const { getRecordings, single, setSingle, list, loading, error } = useRecordingsContext();

    const refreshActiveClasses = loading ? "animate-spin" : "";

    const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
        " cursor-pointer w-full shadow-inner border border-slate-700" +
        " transition-colors hover:border-slate-600";

    return (
        <>
            <ul className="w-full h-full overflow-x-hidden overflow-y-scroll text-gray-200 flex flex-col items-center bg-gray-800">
                {list.map((recording) => (
                    <li className={`${defaultItemClasses}`}>
                        <div className="w-48">
                            {recording.thumb && <img className="w-full" src={`/videos/${recording.thumb}`} />}
                            {!recording.thumb && (
                                <div className="flex justify-center items-center w-120px h-68px border border-gray-400">
                                    <PhotoIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="mx-2 w-full">
                            <h3 className="flex justify-between items-start">
                                <span className="underline">{recording.name}</span>
                                { recording.live && <div className="text-sm bg-red-700 rounded-full inline-block px-2">LIVE</div> }
                            </h3>
                            <h4 className="text-sm text-gray-400">
                                <div className="flex justify-between items-center">
                                    <div>{dateFormater(new Date(recording.startDate))}</div>
                                    <div>{!recording.live && secondsToTime(recording.duration)}</div>
                                </div>
                            </h4>
                        </div>
                        {/* {JSON.stringify(recording)} */}
                    </li>
                ))}
            </ul>
            <button className="absolute flex bottom-2 right-6 p-2 m-2 rounded-full bg-gray-800 border border-slate-700 shadow-lg" onClick={getRecordings}>
                { !error && <ArrowPathIcon className={`inline-block w-8 h-8 ${refreshActiveClasses}`} /> }
                { error && <ExclamationTriangleIcon className={`inline-block w-8 h-8`} /> }
            </button>
        </>

    );
}

export default RecordingsList;
