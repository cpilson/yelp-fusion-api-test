import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import "../node_modules/react-activity/lib/Dots/Dots.css";

ReactDOM.render(
    <App/>, document.getElementById('root'));
registerServiceWorker();
