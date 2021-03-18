import 'core-js';
import React from 'react';
import { render } from 'react-dom';
import App from './App';

import 'styles/app.scss';

const MyAppWithStore = () => (
    <App />
);

render(
    <MyAppWithStore />,
    document.getElementById('app')
);

if (module.hot) {
    module.hot.accept();
}
