import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { LanguageProvider } from './components/Lang/LanguageProvider'
import { SystemContextProvider } from './components/contexts/SystemContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <SystemContextProvider>
        <App />
      </SystemContextProvider>
    </LanguageProvider>

  </React.StrictMode>
);
