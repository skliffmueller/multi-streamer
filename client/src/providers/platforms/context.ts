import React, {createContext, useContext} from "react";

export type PlatformsItem = {
    name: string;
    activated: boolean;
    url: string;
};

export type PlatformsUpdateItem = {
    name: string;
    activated?: boolean;
    url?: string;
};

interface PlatformsContextStruct {
    setSingle: (recording: PlatformsItem | null) => void;
    getPlatforms: () => void;
    createPlatform: (platform: PlatformsItem) => void;
    updatePlatform: (platform: PlatformsUpdateItem) => void;
    removePlatform: (platform: PlatformsUpdateItem) => void;
    single: PlatformsItem | null;
    list: PlatformsItem[];
    loading: boolean;
    error: boolean;
}

export const PlatformsContext = createContext<PlatformsContextStruct>({
    setSingle: () => {},
    getPlatforms: () => {},
    createPlatform: () => {},
    updatePlatform: () => {},
    removePlatform: () => {},
    single: null,
    list: [],
    loading: false,
    error: false,
});

PlatformsContext.displayName = "PlatformsContext";

export function usePlatformsContext() {
    const context = useContext(PlatformsContext);
    return context;
}
