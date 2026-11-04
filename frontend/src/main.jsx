import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { DeviceProvider } from './state/DeviceContext.jsx';
import './styles/base.css';
import './styles/home.css';
import './styles/apps.css';
import './styles/phone.css';
import './styles/messages.css';
import './styles/browser.css';
import './styles/misc.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DeviceProvider>
      <App />
    </DeviceProvider>
  </React.StrictMode>
);
