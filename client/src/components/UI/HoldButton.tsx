import React, {useEffect, useRef, useState} from "react";

interface HoldButtonProps {
    children: React.ReactNode | React.ReactElement | null;
    buttonClasses?: string;
    holdClasses?: string;
    disabled?: boolean;
    onClick: () => void;
}

function HoldButton(props: HoldButtonProps) {
    const [seconds, setSeconds] = useState<number>(-1);
    const timeRef = useRef<number>();
    const animationRef = useRef<number>();

    const animate = (time: number) => {
        if(timeRef.current !== undefined) {
            const deltaTime = time - timeRef.current;
            // if(touch) {
            setSeconds((prevSeconds) => {
                if(prevSeconds > 0 && prevSeconds <= 2) {
                    const newSeconds = (prevSeconds - (deltaTime * 0.001));
                    if(newSeconds <= 0) {
                        props.onClick();
                    }
                    return newSeconds;
                }
                return prevSeconds;
            });
        }
        timeRef.current = time;
        animationRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        if(!props.disabled) {
            animationRef.current = requestAnimationFrame(animate);
            return () => {
                if(animationRef.current !== undefined) {
                    cancelAnimationFrame(animationRef.current)
                }
            };
        }
    }, []);

    const buttonClasses = "relative rounded-lg px-4 py-2 mb-2";
    const holdClasses = "absolute rounded shadow-lg bottom-full left-1/2 -translate-x-1/2 -translate-y-2 font-bold text-xl px-4 py-2";

    return (
        <button disabled={props.disabled} className={`${buttonClasses} ${props.buttonClasses || "bg-red-700"}`} onMouseDown={() => setSeconds(2)} onMouseUp={() => setSeconds(-1)}>
            {seconds > 0 && <div className={`${holdClasses} ${props.holdClasses || "bg-red-600"}`}>
                <span>HOLD {seconds.toFixed(1)}s</span>
            </div>}
            <span className="text-lg">
                {props.children}
            </span>
        </button>
    );
}

export default HoldButton;