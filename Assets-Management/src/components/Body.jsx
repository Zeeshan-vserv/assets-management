import React from 'react'
import Navigation from './Navigation'
import AddFixedAssets from './Asset-Pages/AddFixedAssets'
import AddUsers from './Configuration-Pages/AddUsers'
import DashboardAsset from './Dashboard/DashboardAsset'
import ConfigurationRoute from './Configuration/ConfigurationRoute'
import {Routes,Route} from "react-router-dom"
const Body = ({nav,setNav}) => {
  return (
    <div className='flex mt-14'>
      <div>
        <Navigation nav={nav} setNav={setNav}/>
        </div>
        {/* <AddFixedAssets/> */}
        {/* <AddUsers/> */}
        {/* <DashboardAsset/> */}
        <div className='max-h-[calc(100vh-3.5rem)] w-[100%] overflow-scroll'>
        <Routes>
          <Route path="/configuration/*"element={<ConfigurationRoute/>} />
          <Route path="/test"element={<AddUsers/>} />
        </Routes>
        </div>
    </div>
  )
}

export default Body