import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {UsersContext, UsersItem, UsersUpdateItem} from "./context";


export * from "./context";

interface UsersProviderProps {
    children: React.ReactNode | React.ReactElement | null;
    usersUrl: string;
    token: string;
}

const UsersProvider = (props: UsersProviderProps) => {
    const { children, usersUrl, token } = props;

    const [single, setSingle] = useState<UsersItem | null>(null);
    const [list, setList] = useState<UsersItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const getUsers = () => {
        setLoading(true);
        fetch(usersUrl, {
                credentials: 'same-origin',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => response.json())
                .then((json) => {
                    setLoading(false);
                    setList(json.result as UsersItem[]);
                    setSingle(null);
                })
                .catch((e) => {
                    setLoading(false);
                    console.error(e);
                });
    }

    useEffect(() => {
        getUsers();
    }, [token]);

    const createUser = useCallback((user: UsersItem) => {
        setLoading(true);
        fetch(usersUrl, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as UsersItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const updateUser = useCallback((user: UsersUpdateItem) => {
        setLoading(true);
        fetch(usersUrl, {
            method: "PUT",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as UsersItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const removeUser = useCallback((user: UsersUpdateItem) => {
        setLoading(true);
        fetch(usersUrl, {
            method: "DELETE",
            credentials: "same-origin",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                setList(json.result as UsersItem[]);
                setSingle(null);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }, [token]);

    const value = { getUsers, createUser, updateUser, removeUser, single, setSingle, list, loading, error };

    return (
        <UsersContext.Provider value={value}>
            {children}
        </UsersContext.Provider>
    );
};
export default UsersProvider;
