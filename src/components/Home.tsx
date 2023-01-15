
import React, {ReactNode} from 'react';
import { useStreamContext } from '../providers/stream';
import Player from './Player';
import ServerItem from './ServerItem';



function Home() {
    const { timestamp, state } = useStreamContext();

    return (
        <div className="w-screen text-gray-100 flex items-center justify-center">
            {state.applications.filter((app) => (!app.name.match(/^\/hls/) && app.publishing)).map((application) => <ServerItem {...application}/>)}
        </div>
    );
}

export default Home;
