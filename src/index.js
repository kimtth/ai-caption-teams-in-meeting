// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './components/state'
import * as Theme from '@fluentui/react-northstar'
//import { Provider, teamsDarkTheme } from '@fluentui/react-northstar' //https://fluentsite.z22.web.core.windows.net/quick-start

const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
        <Theme.Provider theme={ Theme.teamsDarkTheme }>
            <App />
        </Theme.Provider>
    </Provider>, document.getElementById('root')
);
