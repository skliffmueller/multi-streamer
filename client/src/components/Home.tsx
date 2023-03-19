
import React, {ReactNode} from 'react';
import {NavLink, Route, Routes, useNavigate} from "react-router-dom";
import { ListBulletIcon, QueueListIcon, EyeIcon, UserIcon, PlayCircleIcon, VideoCameraIcon, FilmIcon } from "@heroicons/react/20/solid"

import StreamProvider, { useStreamContext } from '../providers/platforms';
import ServerItem from './ServerItem';
import BroadcastList from './UI/BroadcastList';
import RecordingsProvider from "../providers/recordings";
import RecordingsList from './Content/RecordingsList';
import Signin from './Content/Signin';
import { useAuthContext } from '../providers/auth';
import FeedsList from './Content/FeedsList';
import FeedProvider from '../providers/feed';
import PlatformsProvider from "../providers/platforms";
import PlatformsList from "./Content/PlatformsList";
import UsersProvider from "../providers/users";
import UsersList from "./Content/UsersList";


function Home() {
    const { token } = useAuthContext();

    const defaultItemClasses = "px-4 py-3 text-center" +
        " w-full border border-slate-700" +
        " transition-colors hover:border-slate-600";

    if(!token) {
        return <div className="relative w-screen h-screen max-w-maxv max-h-maxv text-gray-100 flex flex-col items-center justify-center">
            <Signin />
        </div>;
    }
    return (
        <div className="relative w-screen h-screen max-w-maxv max-h-maxv text-gray-100 flex flex-col items-center justify-center">
            <div className="w-full text-gray-200 flex items-center justify-between bg-gray-800">
                <NavLink to={"/"} className={({ isActive }) => `${defaultItemClasses} ${isActive ? "bg-gray-700" : "bg-gray-800"}`}>
                    <VideoCameraIcon className="inline-block w-6 h-6" /><br />
                    Feeds
                </NavLink>
                <NavLink to={"/recordings"} className={({ isActive }) => `${defaultItemClasses} ${isActive ? "bg-gray-700" : "bg-gray-800"}`}>
                    <FilmIcon className="inline-block w-6 h-6" /><br />
                    Recordings
                </NavLink>
                <NavLink to={"/platforms"} className={({ isActive }) => `${defaultItemClasses} ${isActive ? "bg-gray-700" : "bg-gray-800"}`}>
                    <ListBulletIcon className="inline-block w-6 h-6" /><br />
                    Platforms
                </NavLink>
                {/* <NavLink to={"/watch"} className={({ isActive }) => `${defaultItemClasses} ${isActive ? "bg-gray-700" : "bg-gray-800"}`}>
                    <EyeIcon className="inline-block w-6 h-6" />
                </NavLink> */}
                <NavLink to={"/users"} className={({ isActive }) => `${defaultItemClasses} ${isActive ? "bg-gray-700" : "bg-gray-800"}`}>
                    <UserIcon className="inline-block w-6 h-6" /><br />
                    Users
                </NavLink>
            </div>
            <Routes>
                <Route path="/" element={
                    <FeedProvider feedsUrl={"/api/feeds"} token={token}>
                        <FeedsList />
                    </FeedProvider>
                } />
                <Route path="/recordings" element={
                    <RecordingsProvider recordingsUrl="/api/recordings" token={token}>
                        <RecordingsList />
                    </RecordingsProvider>
                } />
                <Route path="/platforms" element={
                    <PlatformsProvider platformsUrl={"/api/platforms"} token={token}>
                        <PlatformsList />
                    </PlatformsProvider>
                } />
                <Route path="/users" element={
                    <UsersProvider usersUrl={"/api/users"} token={token}>
                        <UsersList />
                    </UsersProvider>
                } />
            </Routes>
        </div>
    );
}

export default Home;
