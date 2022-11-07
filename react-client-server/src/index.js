import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import configStore from './redux/store';
import {persistor} from './redux/store';

ReactDOM.render(
  <Provider store={configStore}>
    <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
  <App />
  </BrowserRouter>
  </PersistGate>
  </Provider>


,document.getElementById('root'));



