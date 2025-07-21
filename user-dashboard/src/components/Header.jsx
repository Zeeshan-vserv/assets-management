import React, { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { logout } from "../../../Assets-Management/src/action/AuthAction";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleNav }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
      dispatch(logout());
      navigate("/auth");
    };
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setTimeout(() => {
      setDropdownVisible(false);
    }, 3000);
  };
  return (
    <div className="w-full flex items-center justify-between p-3 pl-4 pr-10 bg-gray-900 text-white">
      <div className="flex gap-5 items-center text-2xl">
        <IoMdMenu onClick={() => toggleNav()} />
        <h2 className="uppercase text-[1.2rem]">End User Service Management</h2>
      </div>
      <div className="flex gap-2 items-center relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <img className="w-8 h-8 rounded-full" src="https://imgs.search.brave.com/YGdDkgr_LaGQTa619YI6vcuw_bxE0ruRdhvIFnL9D0o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYmFzaWMtMjIv/NTEyLzEwNDFfYm95/X2MtMTI4LnBuZw" alt="" />
          <h3 className="text-xs">VservInfosystems</h3>
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
  );
};

export default Header;
