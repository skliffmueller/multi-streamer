import React, {createContext, MutableRefObject, RefObject, useContext} from "react";


interface StreamContextState {

}

interface StreamContextStruct {
    state: StreamContextState;
}

export const StreamContext = createContext<StreamContextStruct>({
    state: { }
});

StreamContext.displayName = "StreamContext";

export function useStreamContext() {
    const context = useContext(StreamContext);
    return context;
}
