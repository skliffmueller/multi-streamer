import {PlatformsItem} from "../../providers/platforms";
import React, {useState} from "react";
import ToggleButton from "./ToggleButton";

interface CreatePlatformProps {
    onCancel: () => void;
    onSave: (platform: PlatformsItem) => void;
}
function CreatePlatform(props: CreatePlatformProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [activated, setActivated] = useState(true);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target?.value);
    }
    const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target?.value);
    }

    const platformItem = {
        name,
        url,
        activated,
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <input name="name" className="rounded-lg text-md bg-gray-900 mb-2 px-4 py-2" placeholder="Name" value={name} onChange={onNameChange} />
                <input name="url" className="rounded-lg text-md bg-gray-900 mb-4 px-4 py-2" placeholder="RTMP Url" value={url} onChange={onUrlChange} />
                <div className="flex justify-between items-center mb-4 px-4">
                    <span>Active</span>
                    <ToggleButton value={activated} onClick={() => setActivated(!activated)} />
                </div>
                <button className="rounded-lg bg-gray-700 px-4 py-2 mb-2" onClick={() => props.onCancel()}>Cancel</button>
                <button className="rounded-lg bg-emerald-700 px-4 py-2" onClick={() => props.onSave(platformItem)}>Save</button>
            </div>
        </div>
    );
}

export default CreatePlatform;