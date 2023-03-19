import {PlatformsItem, PlatformsUpdateItem} from "../../providers/platforms";
import React, {useCallback, useState} from "react";
import ToggleButton from "./ToggleButton";
import {TrashIcon} from "@heroicons/react/24/solid";
import HoldButton from "./HoldButton";

interface EditPlatformProps {
    onCancel: () => void;
    onEditSave: (platform: PlatformsUpdateItem) => void;
    onRemoveSave: (platform: PlatformsUpdateItem) => void;
    platform: PlatformsItem;
}
function EditPlatform(props: EditPlatformProps) {
    const [url, setUrl] = useState(props.platform.url);
    const [activated, setActivated] = useState(props.platform.activated);

    const onUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target?.value);
    }

    const onSave = useCallback(() => {
        const platform: PlatformsUpdateItem = {
            name: props.platform.name,
        }
        if(props.platform.url !== url) {
            platform.url = url;
        } else if(props.platform.activated !== activated) {
            platform.activated = activated;
        }
        props.onEditSave(platform);
    }, [url, activated]);

    const onRemove = () => {
        const platform: PlatformsUpdateItem = {
            name: props.platform.name,
        }
        props.onRemoveSave(platform);
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <h4 className="flex justify-between items-center text-lg mb-4">
                    <span>{props.platform?.name}</span>
                    <ToggleButton value={activated} onClick={() => setActivated(!activated)} />
                </h4>
                <input name="url" className="rounded-lg text-md bg-gray-900 mb-4 px-4 py-2" placeholder="RTMP Url" value={url} onChange={onUrlChange} />
                <button className="rounded-lg bg-emerald-700 px-4 py-2 mb-2" onClick={onSave}>Save</button>
                <div className="flex justify-between">
                    <HoldButton buttonClasses={"bg-gray-700 w-full"}
                                holdClasses={"bg-red-700"}
                                onClick={onRemove}>
                        <TrashIcon className="inline-block w-6 h-6" />
                    </HoldButton>
                    <button className="rounded-lg w-full bg-gray-700 px-4 py-2 mb-2 ml-2" onClick={() => props.onCancel(props.feed)}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default EditPlatform;