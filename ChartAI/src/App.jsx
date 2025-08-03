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




function App() {
  const { loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <ScrollToTop>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
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
        </Routes>
      </ScrollToTop>
      <Footer />
    </>
  )
}

export default App
