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
import AdminDashboard from './Components/AdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import { useAuth } from './Components/Context/AuthContext'
import Docs from './Components/Docs'
import "./App.css";
import NotFound from './Components/NotFound'




function App() {
  const { loading } = useAuth();

  if (loading) return (
    <div className="loading-container">
      <div className="loading-prop-1"><div className='loading-prop-2'></div></div>
      <p>Loading...</p>
    </div>);

  return (
    <>
      <Navbar />
      <ScrollToTop>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/docs' element={<Docs />}/>
          <Route
            path='/user-dashboard'
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin-dashboard'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/visualize/:id'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <ViewChart />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reports'
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <ViewReports />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScrollToTop>
      <Footer />
    </>
  )
}

export default App
