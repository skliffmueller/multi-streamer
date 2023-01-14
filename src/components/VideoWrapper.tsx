
import "./VideoWrapper.scss";
import React, {ReactNode, useState} from 'react';

interface StreamProviderProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

function VideoWrapper({ children, style }: StreamProviderProps) {
    const [src, setSrc] = useState<string>("rtmp://192.168.1.201:1935/live/tommy");
    return (
        <video autoPlay={true} className="VideoWrapper">
            <source src={src} />
        </video> 
    );
}

export default VideoWrapper;
