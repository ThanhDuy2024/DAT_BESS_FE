import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { LanguageProvider } from './components/Lang/LanguageProvider'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
