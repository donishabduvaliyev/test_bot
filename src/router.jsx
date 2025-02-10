import React from 'react'
import { Route, Routes } from 'react-router-dom'
import CheckoutPage from './pages/checkout'
import App from './App'
import CustomerInfo from './pages/customerInfo'

function Router() {
  return (
   <Routes >
    <Route path='/' index element={< App />}  />
    <Route path='varoq' element={<CheckoutPage />} />
    <Route path='adressInfo' element={<CustomerInfo />} />
   </Routes>
  )
}

export default Router