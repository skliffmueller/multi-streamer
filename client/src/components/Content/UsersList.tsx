
import React, {useState} from 'react';
import { UsersItem, useUsersContext } from "../../providers/users";
import AddButton from "../UI/AddButton";
import CreateUser from "../UI/CreateUser";


function UsersList() {
    const { createUser, updateUser, removeUser, single, setSingle, list, loading } = useUsersContext();
    const [openCreate, setOpenCreate] = useState(false);

    const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
        " cursor-pointer w-full shadow-inner border border-slate-700" +
        " transition-colors hover:border-slate-600";

    const onCreateSave = (user: UsersItem) => {
        createUser(user);
        setOpenCreate(false);
    }

    return (
        <>
            <ul className="w-full h-full overflow-x-hidden overflow-y-scroll text-gray-200 flex flex-col items-center bg-gray-800">
                {list.map((user) => (
                    <li className={`${defaultItemClasses}`} onClick={() => setSingle(user)}>
                        <div className="mx-2 py-2 w-full">
                            <h3 className="flex justify-between items-center text-xl">
                                <span>{user.username}</span>
                            </h3>
                        </div>
                    </li>
                ))}
            </ul>
            <AddButton onClick={() => setOpenCreate(true)} />
            {openCreate && <CreateUser onSave={onCreateSave} onCancel={() => setOpenCreate(false)} />}
        </>

    );
}

export default UsersList;
