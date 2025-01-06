import React, { useState } from 'react'
import Main from './pages/Main.jsx'
import Login from './pages/Login.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardAsset from './components/Dashboard/DashboardAsset.jsx'
function App() {

  const user =  useSelector((state)=>state.authReducer.authData)
  const [count, setCount] = useState(0)
  return (
    <>
       <Routes>
        <Route path='/auth' element={user ? <Navigate to='/main' /> : <Login />} />
        <Route path='/dashboardAsset' element={user ? <DashboardAsset /> : <Navigate to='/auth' />} />
        <Route path='/main' element={user ? <Main /> : <Navigate to='/auth' />} />
        <Route path='/' element={<Navigate to='/home' />} />
      </Routes>
    </>
  )
}

export default App
