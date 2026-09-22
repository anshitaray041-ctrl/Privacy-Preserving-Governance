import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MidnightProvider } from './context/MidnightContext';
import { GovernanceProvider } from './context/GovernanceContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MidnightProvider>
      <GovernanceProvider>
        <App />
      </GovernanceProvider>
    </MidnightProvider>
  </React.StrictMode>
);
