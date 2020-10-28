import React from 'react';
import ReactDOM from 'react-dom';
import { setupConfig } from '@larva.io/webcomponents-react';
import '@larva.io/webcomponents-cognito-login-react';
import App from './App';

setupConfig({
  videoproxyURL: 'wss://video-broker.larva.io/',
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'),
);
