import './index.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from "react-router-dom";




const container = document.getElementById('app');
const root = createRoot(container!);

root.render(<BrowserRouter><App /></BrowserRouter>);

// if(module.hot) {
//     module.hot.accept()
// }