import {RecordingsItem, RecordingsUpdateItem} from "../../providers/platforms";
import React, {useCallback, useState} from "react";
import ToggleButton from "./ToggleButton";
import {TrashIcon, ShareIcon, FolderArrowDownIcon, DocumentDuplicateIcon} from "@heroicons/react/24/solid";
import HoldButton from "./HoldButton";

interface ViewRecordingProps {
    onCancel: () => void;
    onRemoveSave: (recording: RecordingsUpdateItem) => void;
    recording: RecordingsItem;
}
function ViewRecording(props: ViewRecordingProps) {

    const onShareLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const element = event.target as HTMLLinkElement;
        if (navigator.share) {
            navigator.share({
                title: props.recording.name,
                url: element.getAttribute('href') || ""
            })
                .then(() => console.log('Successful share'))
                .catch(error => console.log('Error sharing:', error));
        }
    }

    const onCopyLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
                <h4 className="flex justify-between items-center text-lg mb-4">
                    <span>{props.recording?.name}</span>
                </h4>
                {props.recording.mp4 && navigator.share && <a className="flex justify-between items-center rounded-lg w-full bg-lime-700 px-4 py-2 mb-2"
                   href={`/videos/${props.recording.mp4}`}
                   onClick={onShareLink}>
                    <span className="w-full">Share</span>
                    <ShareIcon className="inline-block w-6 h-6" />
                </a>}
                {props.recording.mp4 && navigator.clipboard && <a className="flex justify-between items-center rounded-lg w-full bg-emerald-700 px-4 py-2 mb-2"
                                           href={`/videos/${props.recording.mp4}`}
                                           onClick={onCopyLink}>
                    <span className="w-full">Copy Link</span>
                    <DocumentDuplicateIcon className="inline-block w-6 h-6" />
                </a>}
                {props.recording.mp4 && <a className="flex justify-between items-center rounded-lg w-full bg-sky-700 px-4 py-2 mb-2"
                   href={`/videos/${props.recording.mp4}`}
                   download>
                    <span className="w-full">Download</span>
                    <FolderArrowDownIcon className="inline-block w-6 h-6" />
                </a>}
                <div className="flex justify-between">
                    <HoldButton disabled={props.recording.mp4 === ""}
                                buttonClasses={"bg-gray-700 w-full"}
                                holdClasses={"bg-red-700"}
                                onClick={() => props.onRemoveSave(props.recording)}>
                        <TrashIcon className="inline-block w-6 h-6" />
                    </HoldButton>
                    <button className="rounded-lg w-full bg-gray-700 px-4 py-2 mb-2 ml-2" onClick={() => props.onCancel()}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ViewRecording;