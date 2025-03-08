import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import SeekerLoginStore from './contexts/SeekerLoginStore.jsx'
import App from './App.jsx'
import ProviderLoginStore from './contexts/ProviderLoginStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProviderLoginStore>
    <SeekerLoginStore>
    <App />
    </SeekerLoginStore>
    </ProviderLoginStore>
  </StrictMode>,
)
