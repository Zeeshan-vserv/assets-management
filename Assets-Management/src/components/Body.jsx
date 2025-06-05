import React from 'react'
import Navigation from './Navigation'
import AddFixedAssets from './Asset-Pages/AddFixedAssets'
import AddUsers from './Configuration-Pages/AddUsers'
import DashboardAsset from './Dashboard/DashboardAsset'
import ConfigurationRoute from './Configuration/ConfigurationRoute'
import {Routes,Route} from "react-router-dom"
const Body = ({nav,setNav}) => {
  return (
    <div className='flex'>
        <Navigation nav={nav} setNav={setNav}/>
        {/* <AddFixedAssets/> */}
        {/* <AddUsers/> */}
        {/* <DashboardAsset/> */}
        <Routes>
          <Route path="/configuration/*"element={<ConfigurationRoute/>} />
          <Route path="/test"element={<AddUsers/>} />
        </Routes>
    </div>
  )
}

export default Body