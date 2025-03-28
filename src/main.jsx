import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StyledApp from './StyledApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledApp />
  </StrictMode>,
)
