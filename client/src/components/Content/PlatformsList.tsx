
import React, {useState} from 'react';
import { PlatformsItem, usePlatformsContext } from "../../providers/platforms";
import AddButton from "../UI/AddButton";
import CreatePlatform from "../UI/CreatePlatform";
import EditPlatform from "../UI/EditPlatform";


function PlatformsList() {
    const { createPlatform, updatePlatform, removePlatform, single, setSingle, list, loading } = usePlatformsContext();
    const [live, setLive] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const defaultItemClasses = "flex justify-between items-center px-4 py-3" +
        " cursor-pointer w-full shadow-inner border border-slate-700" +
        " transition-colors hover:border-slate-600";

    const onCreateSave = (platform: PlatformsItem) => {
        createPlatform(platform);
        setOpenCreate(false);
    }

    return (
        <>
            <ul className="w-full h-full overflow-x-hidden overflow-y-scroll text-gray-200 flex flex-col items-center bg-gray-800">
                {list.map((platform) => (
                    <li className={`${defaultItemClasses}`} onClick={() => setSingle(platform)}>
                        <div className="mx-2 py-2 w-full">
                            <h3 className="flex justify-between items-center text-xl">
                                <span>{platform.name}</span>
                                { live && platform.activated && <div className="text-sm bg-red-700 rounded-full inline-block px-2 py-1">LIVE</div> }
                                { !live && platform.activated && <div className="text-sm bg-emerald-700 rounded-full inline-block px-2 py-1">READY</div> }
                                { !platform.activated && <div className="text-sm bg-gray-700 rounded-full inline-block px-2 py-1">DISABLED</div> }
                            </h3>
                        </div>
                        {/* {JSON.stringify(recording)} */}
                    </li>
                ))}
            </ul>
            <AddButton onClick={() => setOpenCreate(true)} />
            {openCreate && <CreatePlatform onSave={onCreateSave} onCancel={() => setOpenCreate(false)} />}
            {single && <EditPlatform platform={single} onEditSave={updatePlatform} onRemoveSave={removePlatform} onCancel={() => setSingle(null)} />}
        </>

    );
}

export default PlatformsList;
