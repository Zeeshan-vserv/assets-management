import React from 'react'
import Navigation from './Navigation'

const Body = ({nav,setNav}) => {
  return (
    <div className='flex'>
        <Navigation nav={nav} setNav={setNav}/>
        <h2>Hello Word!</h2>
    </div>
  )
}

export default Body