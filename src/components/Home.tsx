
import React, {ReactNode} from 'react';
import { useStreamContext } from '../providers/stream';
import ServerItem from './ServerItem';



function Home() {
    const { timestamp, state } = useStreamContext();

    return (
        <div className="w-screen text-gray-100 flex flex-col items-center justify-center">
            {state.applications.map((application) => <ServerItem {...application}/>)}
        </div>
    );
}

export default Home;
