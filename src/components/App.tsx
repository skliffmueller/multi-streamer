import React from 'react';
import {Routes, Route, useLocation} from "react-router-dom";

import Home from "./Home";

import StreamProvider from "../providers/stream";

function App() {
    return (
        <StreamProvider statsUrl={"/stats"}>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </StreamProvider>
    );
}

export default App;