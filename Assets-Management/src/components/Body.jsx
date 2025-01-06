import React from 'react'
import Navigation from './Navigation'
import AddFixedAssets from './Asset-Pages/AddFixedAssets'
import AddUsers from './Configuration-Pages/AddUsers'
import DashboardAsset from './Dashboard/DashboardAsset'

const Body = ({nav,setNav}) => {
  return (
    <div className='flex'>
        <Navigation nav={nav} setNav={setNav}/>
        {/* <AddFixedAssets/> */}
        {/* <AddUsers/> */}
        <DashboardAsset/>
    </div>
  )
}

export default Body