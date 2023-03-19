import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {PlatformsContext, PlatformsItem, PlatformsUpdateItem} from "./context";


export * from "./context";

interface PlatformsProviderProps {
    children: React.ReactNode | React.ReactElement | null;
    platformsUrl: string;
    token: string;
}

const PlatformsProvider = (props: PlatformsProviderProps) => {
    const { children, platformsUrl, token } = props;

    const [single, setSingle] = useState<PlatformsItem | null>(null);
    const [list, setList] = useState<PlatformsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getPlatforms = () => {
        setLoading(true);
        fetch(platformsUrl, {
                credentials: 'same-origin',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((json) => {
                    setLoading(false);
                    setList(json.result as PlatformsItem[]);
                    setSingle(null);
                })
                .catch((e) => {
                    setLoading(false);
                    console.error(e);
                });
    }

    useEffect(() => {
        getPlatforms();
    }, [token]);

    const createPlatform = useCallback((platform: PlatformsItem) => {
        setLoading(true);
        fetch(platformsUrl, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(platform),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as PlatformsItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const updatePlatform = useCallback((platform: PlatformsUpdateItem) => {
        setLoading(true);
        fetch(platformsUrl, {
            method: "PUT",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(platform),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as PlatformsItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const removePlatform = useCallback((platform: PlatformsUpdateItem) => {
        setLoading(true);
        fetch(platformsUrl, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(platform),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as PlatformsItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const value = { getPlatforms, createPlatform, updatePlatform, removePlatform, single, setSingle, list, loading, error };

    return (
        <PlatformsContext.Provider value={value}>
            {children}
        </PlatformsContext.Provider>
    );
};
export default PlatformsProvider;
