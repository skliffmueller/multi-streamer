import React, {createContext, useContext} from "react";

export type UsersItem = {
    username: string,
    permissions: string[];
    master: boolean;
};

export type UsersUpdateItem = {
    username: string,
    password: string;
    permissions: string[];
    master: boolean;
};

interface UsersContextStruct {
    setSingle: (user: UsersItem | null) => void;
    getUsers: () => void;
    createUser: (user: UsersItem) => void;
    updateUser: (user: UsersUpdateItem) => void;
    removeUser: (user: UsersUpdateItem) => void;
    single: UsersItem | null;
    list: UsersItem[];
    loading: boolean;
    error: boolean;
}

export const UsersContext = createContext<UsersContextStruct>({
    setSingle: () => {},
    getUsers: () => {},
    createUser: () => {},
    updateUser: () => {},
    removeUser: () => {},
    single: null,
    list: [],
    loading: false,
    error: false,
});

UsersContext.displayName = "UsersContext";

export function useUsersContext() {
    const context = useContext(UsersContext);
    return context;
}
