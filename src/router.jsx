import React, { createContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import CustomerInfo from './pages/customerInfo'
import CheckTheCart from './pages/checkout'




function Router() {






  return (
    <Routes >
      <Route path='/' index element={< App />} />


      <Route path='varoq' element={<CheckTheCart />} />

      <Route path='adressInfo' element={<CustomerInfo />} />
    </Routes>
  )
}

export default Router


