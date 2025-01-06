import React from 'react'
import user from '../assets/user.jpg'
import { IoMdMenu } from 'react-icons/io'

const Header = ({toggleNav}) => {
  return (
    <div className='w-full flex items-center justify-between p-3 pl-14 pr-10 bg-gray-900 text-white'>
        <div className='flex gap-5 items-center text-2xl'>
        <IoMdMenu onClick={()=> toggleNav()} />
        <h2 className='uppercase'>Dashboard</h2>
        </div>
        <div className='flex gap-2 items-center'>
            <img className='w-8 h-8 rounded-full' src={user} alt="" />
            <h3 className='text-xs'>VservInfosystems</h3>
        </div>
    </div>
  )
}

export default Header