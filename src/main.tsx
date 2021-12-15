import App from './App'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { createTheme, ThemeProvider } from '@mui/material'
import CssBaseLine from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseLine />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
