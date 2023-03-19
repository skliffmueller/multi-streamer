import {FeedItem, FeedUpdateItem} from "../../providers/feed";
import React, {useEffect, useState} from "react";
import ToggleButton from "./ToggleButton";
import {DocumentDuplicateIcon, TrashIcon} from "@heroicons/react/24/solid";
import HoldButton from "./HoldButton";

interface ActionButtonProps {
    feed: FeedItem;
    onClick: () => void;
}

function ActionButton(props: ActionButtonProps) {
    const { feed } = props;
    return (
        <>
            {!feed.activated &&
            <HoldButton disabled={true}
                        buttonClasses={"bg-gray-800 border border-gray-600"}
                        holdClasses={"bg-emerald-700"}
                        onClick={props.onClick}><span>Disabled</span></HoldButton>
            }
            {feed.activated && feed.application && feed.broadcast &&
            <HoldButton buttonClasses={"bg-emerald-600"}
                        holdClasses={"bg-emerald-700"}
                        onClick={props.onClick}><span>Disconnect</span></HoldButton>
            }
            {feed.activated && feed.application && !feed.broadcast &&
            <HoldButton buttonClasses={"bg-red-600"}
                        holdClasses={"bg-red-700"}
                        onClick={props.onClick}><span>Broadcast Now</span></HoldButton>
            }
            {feed.activated && !feed.application && feed.broadcast &&
            <HoldButton buttonClasses={"bg-sky-600"}
                        holdClasses={"bg-sky-700"}
                        onClick={props.onClick}><span>Don't Broadcast</span></HoldButton>
            }
            {feed.activated && !feed.application && !feed.broadcast &&
            <HoldButton buttonClasses={"bg-red-600"}
                        holdClasses={"bg-red-700"}
                        onClick={props.onClick}><span>Auto Broadcast</span></HoldButton>
            }
        </>

    )
}

interface EditFeedProps {
    feed: FeedItem;
    onCancel: (feed: FeedItem) => void;
    onEditSave: (feed: FeedUpdateItem) => void;
    onRemoveSave: (feed: FeedUpdateItem) => void;
}
function EditFeed(props: EditFeedProps) {
    const { feed } = props;
    const [activated, setActivated] = useState(props.feed.activated);
    const [broadcast, setBroadcast] = useState(props.feed.broadcast);

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

    useEffect(() => {
        if(props.feed.activated !== activated) {
            props.onEditSave({
                name: props.feed.name,
                activated,
            });
        }
    }, [activated]);

    useEffect(() => {
        if(props.feed.broadcast !== broadcast) {
            props.onEditSave({
                name: props.feed.name,
                broadcast,
            });
        }
    }, [broadcast]);

    const onRemove = () => {
        const feed: FeedUpdateItem = {
            name: props.feed.name,
        }
        props.onRemoveSave(feed);
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="relative flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg">{feed.name}</h3>
                    <ToggleButton value={activated} onClick={() => setActivated(!activated)} />
                </div>
                <div className="py-3">
                    <a className="underline" href={`rtmp://${hostname}:1935/live/${feed.key}`} onClick={onCopy}>
                        {`rtmp://${hostname}:1935/live/${feed.key}`}
                    </a>
                    <DocumentDuplicateIcon className="inline w-4 h-4" />
                </div>

                <ActionButton feed={feed} onClick={() => setBroadcast(!broadcast)} />
                <div className="flex justify-between">
                    <HoldButton buttonClasses={"bg-gray-700 w-full"}
                                holdClasses={"bg-red-700"}
                                onClick={onRemove}>
                        <TrashIcon className="inline-block w-6 h-6" />
                    </HoldButton>
                    <button className="rounded-lg bg-gray-700 w-full px-4 py-2 mb-2 ml-2" onClick={() => props.onCancel(props.feed)}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default EditFeed;