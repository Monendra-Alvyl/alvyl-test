import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/* Prerendered pages (npm run build) are hydrated; the dev server and 404 shell render from scratch. */
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
