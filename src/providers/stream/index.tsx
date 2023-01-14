import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {StreamContext} from "./context";


export * from "./context";

interface StreamProviderProps {
    children: React.ReactNode;
}

const StreamProvider = (props: StreamProviderProps) => {
    const { children } = props;


    const value = {};

    return (
        <StreamContext.Provider value={value}>
            {children}
        </StreamContext.Provider>
    );
};
export default StreamProvider;
