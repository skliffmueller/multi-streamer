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

export type RecordingsUpdateItem = {
    name: string;
};

interface RecordingsContextStruct {
    setSingle: (recording: RecordingsItem | null) => void;
    getRecordings: () => void;
    removeRecording: (recording: RecordingsUpdateItem) => void;
    single: RecordingsItem | null;
    list: RecordingsItem[];
    loading: boolean;
    error: boolean;
}

export const RecordingsContext = createContext<RecordingsContextStruct>({
    setSingle: () => {return;},
    getRecordings: () => {return;},
    removeRecording: () => {return;},
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
