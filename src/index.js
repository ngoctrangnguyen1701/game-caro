import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import store from './store'
import AuthContextProvider from './contexts/AuthContextProvider';
import Web3ContextProvider from './contexts/Web3ContextProvider';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3ContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </Web3ContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);