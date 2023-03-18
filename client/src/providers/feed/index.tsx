import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {FeedItem, FeedContext} from "./context";


export * from "./context";

interface FeedProviderProps {
    children: React.ReactNode | React.ReactElement | null;
    feedsUrl: string;
    token: string;
}


const FeedProvider = (props: FeedProviderProps) => {
    const { children, feedsUrl, token } = props;

    const [single, setSingle] = useState<FeedItem | null>(null);
    const [list, setList] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    useEffect(() => {
        const getFeeds = () => {
            setLoading(true);
            fetch(feedsUrl, {
                credentials: 'same-origin',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((json) => {
                    setLoading(false);
                    setList(json.result as FeedItem[]);
                })
                .catch((e) => {
                    setLoading(false);
                    console.error(e);
                });
        }
        const interval = setInterval(() => {
            getFeeds();
        }, 2000);
        getFeeds();
        return () => {
            clearInterval(interval);
        }
    }, [token]);

    const value = { single, setSingle, list, loading, error };

    return (
        <FeedContext.Provider value={value}>
            {children}
        </FeedContext.Provider>
    );
};
export default FeedProvider;
