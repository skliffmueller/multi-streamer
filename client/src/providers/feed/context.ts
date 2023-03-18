import React, {createContext, useContext} from "react";

export type FeedApplication = {
    app: string;
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

export type FeedItem = {
    name: string;
    activated: boolean;
    key: string;
    application: FeedApplication | null;
};

interface FeedContextStruct {
    setSingle: (feed: FeedItem) => void;
    single: FeedItem | null;
    list: FeedItem[];
    loading: boolean;
    error: boolean;
}

export const FeedContext = createContext<FeedContextStruct>({
    setSingle: () => {},
    single: null,
    list: [],
    loading: false,
    error: false,
});

FeedContext.displayName = "FeedContext";

export function useFeedContext() {
    const context = useContext(FeedContext);
    return context;
}
