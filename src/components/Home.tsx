
import React, {ReactNode} from 'react';
import { useStreamContext } from '../providers/stream';
import ServerItem from './ServerItem';



function Home() {
    const { timestamp, state } = useStreamContext();

    return (
        <div className="text-gray-100">
            <div>
                {state.applications.map((application) => <ServerItem {...application}/>)}
            </div>
        </div>
    );
}

export default Home;
