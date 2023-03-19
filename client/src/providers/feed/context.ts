import React, {createContext, useContext} from "react";
import {PlatformsItem, PlatformsUpdateItem} from "../platforms";

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
    broadcast: boolean;
    activated: boolean;
    key: string;
    application?: FeedApplication | null;
};
export type FeedUpdateItem = {
    name: string;
    broadcast?: boolean;
    activated?: boolean;
    key?: string;
};
interface FeedContextStruct {
    setSingle: (feed: FeedItem | null) => void;
    createFeed: (platform: FeedItem) => void;
    updateFeed: (platform: FeedUpdateItem) => void;
    removeFeed: (platform: FeedUpdateItem) => void;
    single: FeedItem | null;
    list: FeedItem[];
    loading: boolean;
    error: boolean;
}

export const FeedContext = createContext<FeedContextStruct>({
    setSingle: () => {return;},
    createFeed: () => {return;},
    updateFeed: () => {return;},
    removeFeed: () => {return;},
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
