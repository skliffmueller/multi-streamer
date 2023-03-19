import React from "react";

interface ToggleButtonProps {
    value: boolean;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ToggleButton(props: ToggleButtonProps) {
    const buttonClassName = "relative transition-all rounded-full w-12 h-6";
    const switchClassName = "absolute transition-all top-0 border-2 border-gray-300 rounded-full w-6 h-6";
    return (
        <button className={`${buttonClassName} ${props.value ? "bg-emerald-600" : "bg-gray-900"}`} onClick={props.onClick}>
            <div className={`${switchClassName} ${props.value ? "left-6 bg-gray-300" : "left-0 bg-gray-300"}`} />
        </button>
    );
}

export default ToggleButton;