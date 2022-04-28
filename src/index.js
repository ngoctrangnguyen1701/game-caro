import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import store from './store'
import AuthContextProvider from './contexts/AuthContextProvider';
import ContractContextProvider from './contexts/ContractContextProvider';
import App from './App';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <ContractContextProvider>
          <App />
        </ContractContextProvider>
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

