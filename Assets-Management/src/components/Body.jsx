import React from 'react'
import Navigation from './Navigation'
import AddFixedAssets from './Asset-Pages/AddFixedAssets'

const Body = ({nav,setNav}) => {
  return (
    <div className='flex'>
        <Navigation nav={nav} setNav={setNav}/>
        <AddFixedAssets/>
    </div>
  )
}

export default Body