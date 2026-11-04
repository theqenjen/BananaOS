import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { OSProvider } from './os/OSProvider'
import './styles/os.css'
import './styles/apps.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OSProvider>
      <App />
    </OSProvider>
  </React.StrictMode>,
)
