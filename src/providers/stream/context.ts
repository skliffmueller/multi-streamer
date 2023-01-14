import React, {createContext, MutableRefObject, RefObject, useContext} from "react";

type StreamChannel = {
    name: string;
    time: number;
    bytesIn: number;
    bytesOut: number;
    width: number;
    height: number;
    frameRate: number;
    videoCodec: string;
    sampleRate: number;
    channels: number;
    audioCodec: string;
    publishing: boolean;
    active: boolean;
};

type StreamApplication = {
    name: string;
    live: StreamChannel[];
};

export type StreamContextState = {
    uptime: number;
    naccepted: number;
    bytesIn: number;
    bytesOut: number;
    server: StreamApplication[];
}

interface StreamContextStruct {
    timestamp: number;
    state: StreamContextState;
}

export const StreamContext = createContext<StreamContextStruct>({
    timestamp: 0,
    state: {
        uptime: 0,
        naccepted: 0,
        bytesIn: 0,
        bytesOut: 0,
        server: [],
    },
});

StreamContext.displayName = "StreamContext";

export function useStreamContext() {
    const context = useContext(StreamContext);
    return context;
}
