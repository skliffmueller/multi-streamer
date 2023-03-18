
import React, {ReactNode, useEffect, useState} from 'react';
import { DocumentDuplicateIcon, ArrowPathIcon, ExclamationTriangleIcon, PlusIcon, VideoCameraSlashIcon, TrashIcon } from "@heroicons/react/24/solid";
import { FeedApplication, FeedItem, useFeedContext } from '../../providers/feed';



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


function Item({ feed, onClick }:{ feed: FeedItem }) {
    const { key, activated, application } = feed;
    const [imageSrc, setImageSrc] = useState("");
    const {
        hostname
    } = window.location;

    useEffect(() => {
        const interval = setInterval(() => {
            setImageSrc("/thumbs/" + key + ".jpg?" + Date.now());
        }, 1400);
        setImageSrc("/thumbs/" + key + ".jpg?" + Date.now());
        return () => {
            clearInterval(interval);
        }
    }, []);

    const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
        " cursor-pointer w-full shadow-inner border border-slate-700" +
        " transition-colors hover:border-slate-600";

    return (
        <li className={`${defaultItemClasses}`} onClick={onClick}>
            <div className="w-48">
                {application && <img className="w-full" src={imageSrc} />}
                {!application && (
                    <div className="flex justify-center items-center w-120px h-68px border border-gray-400">
                        <VideoCameraSlashIcon className="w-10 h-10" />
                    </div>
                )}
            </div>
            <div className="mx-2 w-full">
                <h3 className="flex justify-between">
                    <span className="underline">{feed.name}</span>
                    {false && <div className="text-sm bg-red-700 rounded-full inline-block px-2">LIVE</div>}
                    {application && <div className="text-sm bg-emerald-700 rounded-full inline-block px-2">READY</div>}
                    {!application && activated && <div className="text-sm bg-sky-600 rounded-full inline-block px-2">OPEN</div>}
                    {!application && !activated && <div className="text-sm bg-gray-600 rounded-full inline-block px-2">DISABLED</div>}
                </h3>
                {application && (<h4 className="text-sm text-gray-400">
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
                        <div>{application.channels == 1 ? "Mono" : "Stereo"} {(application.sampleRate/1000).toFixed(1)}khz</div>
                    </div>
                </h4>)}
                {!application && (<h4 className="text-sm text-gray-400">
                    &nbsp;<br />
                    &nbsp;<br />
                    &nbsp;
                </h4>)}
            </div>
            <div>
                {/* {iconElement(broadcastItem)} */}
            </div>
        </li>
    );
}

const keyTable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function randomString(length: number): string {
    let tempTable = keyTable.split('');
    let randomizedTable = [];
    let str = "";
    
    while(tempTable.length) {
        const index = Math.round((tempTable.length-1) * Math.random());
        randomizedTable.push(tempTable.splice(index, 1)[0]);
    }

    while(length--) {
        const index = Math.round((randomizedTable.length-1) * Math.random());
        str += randomizedTable[index];
    }

    return str;
}

interface ToggleButtonProps {
    value: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ToggleButton(props: ToggleButtonProps) {
    return (
        <button className={`relative transition-all rounded-full ${props.value ? "bg-gray-700" : "bg-gray-900"} w-12 h-6 mx-2`} onClick={props.onClick}>
            <div className={`absolute transition-all top-0 ${props.value ? 'left-6 bg-gray-300' : 'left-0 bg-gray-800'} border-2 border-gray-300 rounded-full w-6 h-6`}></div>
        </button>
    );
}
interface CreateFeedProps {
    onCancel: () => void;
    onSave: (feed: FeedItem) => void;
}
function CreateFeed(props: CreateFeedProps) {
    const [toggle, setToggle] = useState(false);
    const [name, setName] = useState("");
    const [key, setKey] = useState(randomString(16));
    const [open, setOpen] = useState(true);
    const [autoBroadcast, setAutoBroadcast] = useState(false);

    
    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <input className="rounded-lg text-md bg-gray-900 mb-2 px-4 py-2" placeholder="Name" value={name} />
                <input className="rounded-lg text-md bg-gray-900 mb-4 px-4 py-2" placeholder="RTMP Key" value={key} />
                <button className="rounded-lg bg-gray-700 px-4 py-2 mb-2" onClick={() => props.onCancel()}>Cancel</button>
                <button className="rounded-lg bg-emerald-700 px-4 py-2" onClick={() => props.onSave()}>Save</button>
            </div>
        </div>
    );
}

interface ViewFeedProps {
    feed: FeedItem;
    onCancel: (feed: FeedItem) => void;
    onSave: (feed: FeedItem) => void;
}
function ViewFeed(props: ViewFeedProps) {
    const { feed } = props;
    const [toggle, setToggle] = useState(false);
    const [name, setName] = useState("");
    const [key, setKey] = useState(randomString(16));
    const [open, setOpen] = useState(true);
    const [autoBroadcast, setAutoBroadcast] = useState(false);
    const {
        hostname
    } = window.location;
    
    const onCopy = (event: React.MouseEvent<HTMLAnchorElement>) => {
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

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <h3 className="text-lg">{feed.name}</h3>
                <div className="py-3">
                    <a className="underline" href={`rtmp://${hostname}:1935/live/${feed.key}`} onClick={onCopy}>
                        {`rtmp://${hostname}:1935/live/${feed.key}`} 
                    </a>
                    <DocumentDuplicateIcon className="inline w-4 h-4" />
                </div>

                <button className="rounded-lg bg-red-700 px-4 py-2 mb-2 mr-1" onClick={() => props.onSave(props.feed)}>
                    Broadcast Now
                </button>
                <div className="flex justify-between">
                    <button className="rounded-lg bg-gray-700 w-full px-4 py-2 mb-2 mr-1" onClick={() => props.onSave(props.feed)}>
                        <TrashIcon className="inline-block w-6 h-6" />
                    </button>
                    <button className="rounded-lg bg-gray-700 w-full px-4 py-2 mb-2 ml-1" onClick={() => props.onCancel(props.feed)}>Close</button>
                </div>
            </div>
        </div>
    );
}

function FeedsList() {
    const { list, loading, error, single, setSingle } = useFeedContext();
    const [openCreate, setOpenCreate] = useState(false);

    return (
        <>
            <ul className="w-full h-full overflow-x-hidden overflow-y-scroll text-gray-200 flex flex-col items-center bg-gray-800">
                {/* Thumbnail Title (Select) (Hover:How long ago?)*/}
                {list.map((feed) => <Item feed={feed} onClick={() => setSingle(feed)} />)}
            </ul>
            <button className="absolute flex bottom-2 right-6 p-2 m-2 rounded-full bg-gray-800 border border-slate-700 shadow-lg" onClick={() => setOpenCreate(true)}>
                { !error && <PlusIcon className={`inline-block w-8 h-8`} /> }
                { error && <ExclamationTriangleIcon className={`inline-block w-8 h-8`} /> }
            </button>
            {openCreate && <CreateFeed onCancel={() => setOpenCreate(false)} />}
            {single && <ViewFeed feed={single} onCancel={() => setSingle(null)} onSave={() => {}} />}
        </>

    );
}

export default FeedsList;
