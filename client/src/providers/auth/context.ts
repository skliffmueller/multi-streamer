import React, {createContext, useContext} from "react";

export type UserItem = {
    username: string;
    permissions: string[];
    master: boolean;
};

export type AuthItem = {
    username: string;
    permissions: string[];
    master: boolean;
    expiresAt: string;
    token: string;
};

interface AuthContextStruct {
    checkSession: (token: string) => void;
    login: (username: string, password: string) => void;
    user: UserItem | null;
    loading: boolean;
    token: string;
}

export const AuthContext = createContext<AuthContextStruct>({
    checkSession: () => {},
    login: () => {},
    user: null,
    loading: false,
    token: "",
});

AuthContext.displayName = "AuthContext";

export function useAuthContext() {
    const context = useContext(AuthContext);
    return context;
}
