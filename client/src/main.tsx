import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Silent background wake-up ping for Render
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  fetch(`${apiUrl}/health`).catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
