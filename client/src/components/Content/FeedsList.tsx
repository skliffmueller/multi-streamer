
import React, {ReactNode, useEffect, useState, useRef} from 'react';
import { DocumentDuplicateIcon, ArrowPathIcon, ExclamationTriangleIcon, PlusIcon, VideoCameraSlashIcon, TrashIcon } from "@heroicons/react/24/solid";
import { FeedApplication, FeedItem, useFeedContext } from '../../providers/feed';
import CreateFeed from "../UI/CreateFeed";
import ToggleButton from "../UI/ToggleButton";
import HoldButton from "../UI/HoldButton";
import AddButton from "../UI/AddButton";
import EditFeed from "../UI/EditFeed";
import {PlatformsItem} from "../../providers/platforms";



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



function Item({ feed, onClick }:{ feed: FeedItem, onClick:() => void }) {
    const { key, broadcast, activated, application } = feed;
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
                {application && application.publishing && <img className="w-full" src={imageSrc} />}
                {(!application || !application.publishing) && (
                    <div className="flex justify-center items-center w-120px h-68px border border-gray-400">
                        <VideoCameraSlashIcon className="w-10 h-10" />
                    </div>
                )}
            </div>
            <div className="mx-2 w-full">
                <h3 className="flex justify-between">
                    <span className="underline">{feed.name}</span>
                    {application && application.publishing && broadcast && <div className="text-sm bg-red-700 rounded-full inline-block px-2">LIVE</div>}
                    {application && application.publishing && !broadcast && <div className="text-sm bg-emerald-700 rounded-full inline-block px-2">READY</div>}
                    {(!application || !application.publishing) && activated && <div className="text-sm bg-sky-600 rounded-full inline-block px-2">OPEN</div>}
                    {(!application || !application.publishing) && !activated && <div className="text-sm bg-gray-600 rounded-full inline-block px-2">DISABLED</div>}
                </h3>
                {application && application.publishing && (<h4 className="text-sm text-gray-400">
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
                {(!application || !application.publishing) && (<h4 className="text-sm text-gray-400">
                    <span>{broadcast && "(Auto Broadcast)"}</span><br />
                    &nbsp;
                </h4>)}
            </div>
            <div>
                {/* {iconElement(broadcastItem)} */}
            </div>
        </li>
    );
}





function FeedsList() {
    const { list, loading, error, single, setSingle, createFeed, updateFeed, removeFeed } = useFeedContext();
    const [openCreate, setOpenCreate] = useState(false);

    const onCreateSave = (platform: FeedItem) => {
        createFeed(platform);
        setOpenCreate(false);
    }

    return (
        <>
            <ul className="w-full h-full overflow-x-hidden overflow-y-scroll text-gray-200 flex flex-col items-center bg-gray-800">
                {/* Thumbnail Title (Select) (Hover:How long ago?)*/}
                {list.map((feed) => <Item feed={feed} onClick={() => setSingle(feed)} />)}
            </ul>
            <AddButton onClick={() => setOpenCreate(true)} />
            {openCreate && <CreateFeed onCancel={() => setOpenCreate(false)} onSave={onCreateSave} />}
            {single && <EditFeed feed={single} onCancel={() => setSingle(null)} onEditSave={updateFeed} onRemoveSave={removeFeed} />}
        </>

    );
}

export default FeedsList;
