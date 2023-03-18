import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {StreamApplication, StreamContext, StreamContextState} from "./context";


export * from "./context";

interface StreamProviderProps {
    children: React.ReactNode | React.ReactElement | null;
    statsUrl: string;
}

function streamChannelParser(
    { applicationName, streamNode }
        :{ applicationName: string, streamNode: Element }
): StreamApplication {
    return {
        name: "/" + applicationName + "/" + (streamNode.querySelector('name')?.textContent || ""),
        time: parseInt(streamNode.querySelector('time')?.textContent || "0"),
        bytesIn: parseInt(streamNode.querySelector('bytes_in')?.textContent || "0"),
        bytesOut: parseInt(streamNode.querySelector('bytes_out')?.textContent || "0"),

        width: parseInt(streamNode.querySelector('meta > video > width')?.textContent || "0"),
        height: parseInt(streamNode.querySelector('meta > video > height')?.textContent || "0"),
        frameRate: parseInt(streamNode.querySelector('meta > video > frame_rate')?.textContent || "0"),
        videoCodec: streamNode.querySelector('meta > video > codec')?.textContent || "",

        channels: parseInt(streamNode.querySelector('meta > audio > channels')?.textContent || "0"),
        sampleRate: parseInt(streamNode.querySelector('meta > audio > sample_rate')?.textContent || "0"),
        audioCodec: streamNode.querySelector('meta > audio > codec')?.textContent || "",

        publishing: !!streamNode.querySelector('publishing'),
        active: !!streamNode.querySelector('active')
    };
}

const StreamProvider = (props: StreamProviderProps) => {
    const { children, statsUrl } = props;

    const [timestamp, setTimestamp] = useState<number>(0);
    const [state, setState] = useState<StreamContextState>({
        uptime: 0,
        naccepted: 0,
        bytesIn: 0,
        bytesOut: 0,
        applications: [],
    });

    
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const sendRequest = () => {
            fetch(statsUrl,{
                credentials: 'same-origin'
            })
                .then((response) => response.text())
                .then((text) => {
                    const xmlParser = new DOMParser();
                    const xmlDoc = xmlParser.parseFromString(text, "text/xml");

                    const applicationNodes = xmlDoc.querySelectorAll('rtmp > server > application');
                    const applications: StreamApplication[] = [];
                    applicationNodes.forEach((liveNode) => {
                        const applicationName = liveNode.querySelector('name')?.textContent || "";
                        const streamNodes = liveNode.querySelectorAll('live > stream');
                        streamNodes.forEach((streamNode) => {
                            applications.push(streamChannelParser({
                                applicationName,
                                streamNode,
                            }));
                        });
                    });
                    
                    const newState: StreamContextState  = {
                        uptime: parseInt(xmlDoc.querySelector('rtmp > uptime')?.textContent || "0"),
                        naccepted: parseInt(xmlDoc.querySelector('rtmp > naccepted')?.textContent || "0"),
                        bytesIn: parseInt(xmlDoc.querySelector('rtmp > bytes_in')?.textContent || "0"),
                        bytesOut: parseInt(xmlDoc.querySelector('rtmp > bytes_out')?.textContent || "0"),
                        applications,
                    };
                    setState(newState);
                    setTimestamp(newState.uptime);
                    timeout = setTimeout(() => {
                        sendRequest();
                    }, 2000);
                })
                .catch((e) => {
                    console.error(e);
                    timeout = setTimeout(() => {
                        sendRequest();
                    }, 2000);
                });
        }
        sendRequest();

        return () => {
            if(timeout) {
                clearTimeout(timeout);
            }
        }
    },[]);

    const value = { timestamp, state };

    return (
        <StreamContext.Provider value={value}>
            {children}
        </StreamContext.Provider>
    );
};
export default StreamProvider;
