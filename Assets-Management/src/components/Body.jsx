import React from 'react'
import Navigation from './Navigation'
import ConfigurationRoute from './Configuration/ConfigurationRoute'
import {Routes,Route} from "react-router-dom"
import AssetRoute from './Asset/AssetRoute'
import Test from '../pages/Test'
import ServiceDeskRoutes from './ServiceDesk/ServiceDeskRoutes'
const Body = ({nav,setNav}) => {
  return (
    <div className='flex mt-14'>
      <div>
        <Navigation nav={nav} setNav={setNav}/>
        </div>
        <div className='max-h-[calc(100vh-3.5rem)] w-[100%] overflow-scroll'>
        <Routes>
          <Route path="/Configuration/*"element={<ConfigurationRoute/>} />
          <Route path="/Asset/*"element={<AssetRoute/>} />
          <Route path="/ServiceDesk/*"element={<ServiceDeskRoutes/>} />
          <Route path="/test"element={<Test/>} /> 
        </Routes>
        </div>
    </div>
  )
}

export default Body