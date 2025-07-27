import { useState } from 'react'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import ScrollToTop from './Components/ScrollToTop';
import SignUp from './Components/Signup';
import UserDashboard from './Components/UserDashboard'




function App() {
 

  return (
    <>
      <Navbar />
      <ScrollToTop>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/user-dashboard' element={<UserDashboard />} />
        </Routes>
      </ScrollToTop>
      <Footer />
    </>
  )
}

export default App
