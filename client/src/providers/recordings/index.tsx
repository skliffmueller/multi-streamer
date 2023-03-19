import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {RecordingsContext, RecordingsItem, RecordingsUpdateItem} from "./context";
import {PlatformsItem, PlatformsUpdateItem} from "../platforms";


export * from "./context";

interface RecordingsProviderProps {
    children: React.ReactNode | React.ReactElement | null;
    recordingsUrl: string;
    token: string;
}

const RecordingsProvider = (props: RecordingsProviderProps) => {
    const { children, recordingsUrl, token } = props;

    const [single, setSingle] = useState<RecordingsItem | null>(null);
    const [list, setList] = useState<RecordingsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getRecordings = () => {
        setLoading(true);
        fetch(recordingsUrl, {
            credentials: 'same-origin',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as RecordingsItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }

    const removeRecording = useCallback((recording: RecordingsUpdateItem) => {
        setLoading(true);
        fetch(recordingsUrl, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recording),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as RecordingsItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    useEffect(() => {
        getRecordings();
    }, [token]);


    const value = { getRecordings, removeRecording, single, setSingle, list, loading, error };

    return (
        <RecordingsContext.Provider value={value}>
            {children}
        </RecordingsContext.Provider>
    );
};
export default RecordingsProvider;
