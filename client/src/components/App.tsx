import React from 'react';
import {Routes, Route, useLocation} from "react-router-dom";

import Home from "./Home";

import Signin from './Content/Signin';
import AuthProvider from '../providers/auth';

function App() {
    return (
        <AuthProvider>
            <Home />
        </AuthProvider>
    );
}

export default App;