import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import Category from './Pages/Category'
import Products from './Pages/Products'
import Orders from './Pages/Orders'
import Users from './Pages/Users'
import ForgotPassword from './Pages/ForgotPassword'
const App = () => {
    
  return (
    <>
        <Router>
            <Routes>
                <Route path='/' element={<Login/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/category' element={<Category/>}/>
                <Route path='/products' element={<Products/>}/>
                <Route path='/orders' element={<Orders/>}/>
                <Route path='/users' element={<Users/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
            </Routes>
        </Router>
    </>
  )
}

export default App