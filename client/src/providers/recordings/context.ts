import React, {createContext, useContext} from "react";

export type RecordingsItem = {
    name: string;
    duration: number;
    startDate: string;
    live: boolean;
    thumb: string;
    mp4: string;
    flv: string;
};

interface RecordingsContextStruct {
    setSingle: (recording: RecordingsItem) => void;
    getRecordings: () => void;
    single: RecordingsItem | null;
    list: RecordingsItem[];
    loading: boolean;
    error: boolean;
}

export const RecordingsContext = createContext<RecordingsContextStruct>({
    setSingle: () => {},
    getRecordings: () => {},
    single: null,
    list: [],
    loading: false,
    error: false,
});

RecordingsContext.displayName = "RecordingsContext";

export function useRecordingsContext() {
    const context = useContext(RecordingsContext);
    return context;
}
