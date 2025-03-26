import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Router from './router.jsx'
import { CartProvider } from './components/context.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter >
        <CartProvider>

            <Router />
        </CartProvider>
    </BrowserRouter>
)
