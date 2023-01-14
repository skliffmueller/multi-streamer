import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {StreamContext, StreamContextState} from "./context";


export * from "./context";

interface StreamProviderProps {
    children: React.ReactNode;
}

const StreamProvider = (props: StreamProviderProps) => {
    const { children } = props;

    const [timestamp, setTimestamp] = useState<number>(0);
    const [state, setState] = useState<StreamContextState>({
        uptime: 0,
        naccepted: 0,
        bytesIn: 0,
        bytesOut: 0,
        server: [],
    });

    useEffect(() => {
        fetch('http://192.168.1.201/stats')
            .then((response) => {
                console.log(response)
            });
    },[]);

    const value = { timestamp, state };

    return (
        <StreamContext.Provider value={value}>
            {children}
        </StreamContext.Provider>
    );
};
export default StreamProvider;
