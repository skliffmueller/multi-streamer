import {FeedItem} from "../../providers/feed";
import React, {useState} from "react";
import ToggleButton from "./ToggleButton";


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

interface CreateFeedProps {
    onCancel: () => void;
    onSave: (feed: FeedItem) => void;
}
function CreateFeed(props: CreateFeedProps) {
    const [name, setName] = useState("");
    const [key, setKey] = useState(randomString(16));
    const [activated, setActivated] = useState(true);
    const [broadcast, setBroadcast] = useState(false);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target?.value);
    }
    const onKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKey(event.target?.value);
    }

    const feedItem = {
        name,
        key,
        activated,
        broadcast
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <input className="rounded-lg text-md bg-gray-900 mb-2 px-4 py-2" placeholder="Name" value={name} onChange={onNameChange} />
                <input className="rounded-lg text-md bg-gray-900 mb-4 px-4 py-2" placeholder="RTMP Key" value={key} onChange={onKeyChange} />
                <div className="flex justify-between items-center mb-4 px-4">
                    <span>Active</span>
                    <ToggleButton value={activated} onClick={() => setActivated(!activated)} />
                </div>
                <div className="flex justify-between items-center mb-4 px-4">
                    <span>Auto Broadcast</span>
                    <ToggleButton value={broadcast} onClick={() => setBroadcast(!broadcast)} />
                </div>
                <button className="rounded-lg bg-gray-700 px-4 py-2 mb-2" onClick={() => props.onCancel()}>Cancel</button>
                <button className="rounded-lg bg-emerald-700 px-4 py-2" onClick={() => props.onSave(feedItem)}>Save</button>
            </div>
        </div>
    );
}

export default CreateFeed;