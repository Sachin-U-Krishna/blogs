import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyledEngineProvider } from '@mui/material/styles';
import App from './App.jsx'
import { Provider } from './context/users';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </Provider>,
)
