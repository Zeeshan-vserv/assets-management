import React from 'react'
import userImg from '../assets/user.jpg'
import { IoMdMenu } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../action/AuthAction'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({toggleNav}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const user = useSelector((state) => state.authReducer.authData);

  // console.log(user.user.isActive);
  
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleLogout = () => {
  dispatch(logout());
  navigate('/auth');
};

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setTimeout(() => {
      setDropdownVisible(false);
    }, 3000);
  };
  return (
    <div className='w-full flex items-center justify-between p-3 pl-14 pr-10 bg-gray-900 text-white'>
        <div className='flex gap-5 items-center text-2xl'>
        <IoMdMenu onClick={()=> toggleNav()} />
        <h2 className='uppercase'>Dashboard</h2>
        </div>
        <div className='flex gap-2 items-center relative'>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <img className='w-8 h-8 rounded-full' src={userImg} alt="" />
              <h3 className='text-xs'>VservInfosystems</h3>
            </div>
            {dropdownVisible && (
              <div className="absolute z-50 right-0 mt-20 w-42 bg-white border rounded shadow-lg">
                <button
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
        </div>
       
    </div>
  )
}

export default Header