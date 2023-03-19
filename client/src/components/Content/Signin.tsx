
import React, {ReactNode, useCallback, useEffect, useState} from 'react';
import { DocumentDuplicateIcon, ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useRecordingsContext } from '../../providers/recordings';
import { useAuthContext } from '../../providers/auth';

function Signin() {
    const { checkSession, login, user, loading } = useAuthContext();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    if(user) {
        return <></>
    }

    const onUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target) {
            setUsername(event.target.value);
        }

    }

    const onPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target) {
            setPassword(event.target.value);
        }
    }

    const onSignin = useCallback((event: React.MouseEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(username, password);
    }, [username, password]);


    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <form className="flex flex-col rounded-lg bg-gray-800 p-4 m-4" onSubmit={onSignin}>
                <input className="rounded-lg text-size-lg bg-gray-900 mb-2 px-4 py-2"
                       name="username"
                       placeholder="Username"
                       value={username}
                       onChange={onUsername} />
                <input className="rounded-lg text-size-lg bg-gray-900 mb-4 px-4 py-2"
                       name="password"
                       type="password"
                       placeholder="Password"
                       value={password}
                       onChange={onPassword} />
                <button type="submit" className="rounded-lg bg-gray-700 px-4 py-2">Signin</button>
            </form>
        </div>

    );
}

export default Signin;
