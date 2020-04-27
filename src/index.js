/** React Library */
import React from 'react';
import ReactDOM from 'react-dom';

/** IE 11 */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

// /** IE 10 */
// import 'react-app-polyfill/ie10';
// import 'react-app-polyfill/stable';

/** IE 9 */
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

/** Import Custom CSS */
import './js/importSrc.js';

/** Container Component */
import App from './App'

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);





