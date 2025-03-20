import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './theme.css';
import ThemeProvider from "./Themeprovider";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <ThemeProvider>
    <App />
    </ThemeProvider>
    
  </StrictMode>,
)
