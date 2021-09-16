import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsisH, faPencilAlt, faTimes, faTrashAlt, faSignature } from '@fortawesome/free-solid-svg-icons';
import store from './store/store';
import App from './App';
// My test
// import TestApp from './tests/Test03-react-async-state-debuggrio/App';
import reportWebVitals from './reportWebVitals';

library.add(faEllipsisH, faPencilAlt, faTimes, faTrashAlt, faSignature);

ReactDOM.render(
  // <TestApp />,
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
