import {ExclamationTriangleIcon, PlusIcon} from "@heroicons/react/24/solid";
import React from "react";

interface AddButtonProps {
    onClick: () => void;
}

function AddButton(props: AddButtonProps) {
    return (<button className="absolute flex bottom-2 right-6 p-2 m-2 rounded-full bg-gray-800 border border-slate-700 shadow-lg" onClick={props.onClick}>
        <PlusIcon className={`inline-block w-8 h-8`} />
    </button>);
}
export default AddButton;