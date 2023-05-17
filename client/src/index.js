
//React
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

//Contexto
import ConexState from './context/ConexState';

//const root = ReactDOM.createRoot(document.getElementById('root'));

ReactDOM.render(
    <ConexState>
      <App />
    </ConexState>,
  document.getElementById('root')
);