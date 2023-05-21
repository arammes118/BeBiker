//React
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

//Contexto
import ConexState from './context/ConexState';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConexState>
      <App />
    </ConexState>
  </React.StrictMode>
);