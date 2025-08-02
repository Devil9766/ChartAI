import { useState } from 'react'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login'
import ScrollToTop from './Components/ScrollToTop';
import SignUp from './Components/Signup';
import UserDashboard from './Components/UserDashboard'
import ViewChart from './Components/ViewCharts'
import ViewReports from './Components/ViewReports'




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
          <Route path='/visualize/:id' element={<ViewChart />} />
          <Route path='/reports' element={<ViewReports />} />
        </Routes>
      </ScrollToTop>
      <Footer />
    </>
  )
}

export default App
