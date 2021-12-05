import App from './App'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseLine from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <React.StrictMode>
    <CssBaseLine />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
