import React, {useEffect, useRef, useState} from "react";

interface HoldButtonProps {
    children: React.ReactNode | React.ReactElement | null;
    buttonClasses?: string;
    holdClasses?: string;
    disabled?: boolean;
    onClick: () => void;
}

function HoldButton(props: HoldButtonProps) {
    const [tapCount, setTapCount] = useState<number>(3);


    useEffect(() => {
        if(tapCount <= 0) {
            props.onClick();
            setTapCount(3);
        } else if(tapCount < 3) {
            const timeout = setTimeout(() => {
                setTapCount(3);
            }, 1000);
            return () => {
                clearTimeout(timeout);
            }
        }

    },[tapCount])

    const buttonClasses = "relative rounded-lg px-4 py-2 mb-2";
    const holdClasses = "absolute rounded shadow-lg bottom-full left-1/2 -translate-x-1/2 -translate-y-2 font-bold text-xl px-4 py-2";

    return (
        <button disabled={props.disabled} className={`${buttonClasses} ${props.buttonClasses || "bg-red-700"}`} onClick={() => setTapCount(tapCount - 1)}>
            {tapCount < 3 && <div className={`${holdClasses} ${props.holdClasses || "bg-red-600"}`}>
                <span>Tap {tapCount} times</span>
            </div>}
            <span className="text-lg">
                {props.children}
            </span>
        </button>
    );
}

export default HoldButton;