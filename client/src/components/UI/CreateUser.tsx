import {UsersUpdateItem} from "../../providers/users";
import React, {useState} from "react";
import ToggleButton from "./ToggleButton";

interface CreateUserProps {
    onCancel: () => void;
    onSave: (user: UsersUpdateItem) => void;
}
function CreateUser(props: CreateUserProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [permissions, setPermissions] = useState([]);
    // const [master, setMaster] = useState(true);

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target?.value);
    }
    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target?.value);
    }

    const userItem = {
        username,
        password,
        permissions:[],
        master: true,
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 right-0 w-full h-full flex justify-center items-center bg-opaque-600">
            <div className="flex flex-col rounded-lg bg-gray-800 p-4 m-4">
                <input className="rounded-lg text-md bg-gray-900 mb-2 px-4 py-2" placeholder="Username" value={username} onChange={onUsernameChange} />
                <input className="rounded-lg text-md bg-gray-900 mb-4 px-4 py-2" placeholder="Password" type="password" value={password} onChange={onPasswordChange} />
                <button className="rounded-lg bg-gray-700 px-4 py-2 mb-2" onClick={() => props.onCancel()}>Cancel</button>
                <button className="rounded-lg bg-emerald-700 px-4 py-2" onClick={() => props.onSave(userItem)}>Save</button>
            </div>
        </div>
    );
}

export default CreateUser;