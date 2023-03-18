import React, {MutableRefObject, useCallback, useEffect, useRef, useState} from "react";

import {AuthContext, AuthItem, UserItem} from "./context";


export * from "./context";

interface AuthProviderProps {
    children: React.ReactNode | React.ReactElement | null;
}

const AuthProvider = (props: AuthProviderProps) => {
    const { children } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [user, setUser] = useState<UserItem | null>(null);
    const [token, setToken] = useState<string>("");

    const checkSession = (token: string) => {
        setLoading(true);
        fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then((response) => {
                if(response.status === 200) {
                    setToken(token);
                    return response.json();
                }
                throw Error("Failed response");
            })
            .then((json) => {
                setLoading(false);
                setUser(json.result as UserItem);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }

    const login = (username: string, password: string) => {
        setLoading(true);
        fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username,password}),
            })
            .then((response) => response.json())
            .then((json) => {
                const session = json.result as AuthItem;
                localStorage.setItem('token', session.token);
                setToken(session.token);
                setLoading(false);
                setUser(json.result as UserItem);
            })
            .catch((e) => {
                setLoading(false);
                console.error(e);
            });
    }
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            checkSession(token);
        }
    }, []);


    const value = { checkSession, login, user, loading, token  };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;
