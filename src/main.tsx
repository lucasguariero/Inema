import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { initAntiCryptojackingProtection } from './utils/security';

// Inicializar proteções ativas contra invasão e mineradores
initAntiCryptojackingProtection();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
