import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { NavLink } from "react-router-dom";

const Navigation = ({ nav, setNav }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const toggleSubMenu = (menu) => {
    setExpandedSubMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const renderSubMenu = () => {
    switch (activeMenu) {
      case "dashboard":
        return (
          <>
            <ul className="flex flex-col gap-3 list-disc pl-5">
              <li className="list-none">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  DASHBOARD
                </NavLink>
              </li>
              <li className="list-none">
                <NavLink
                  to="/incidents"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  INCIDENTS
                </NavLink>
              </li>
              <li className="list-none">
                <NavLink
                  to="//service-request"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  SERVICE REQUEST
                </NavLink>
              </li>
              <li className="list-none">
                <NavLink
                  to="/my-assets"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  MY ASSETS
                </NavLink>
              </li>
              <li className="list-none">
                <NavLink
                  to="/my-approval"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  MY APPROVAL
                </NavLink>
              </li>
            </ul>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-fit h-[calc(100vh-3.5rem)] p-5 flex flex-col gap-8 text-2xl bg-gray-800 text-white">
        <RxDashboard
          title="Dashboard"
          className={`${
            activeMenu == "dashboard" ? "text-blue-400" : ""
          } cursor-pointer`}
          onClick={() => {
            setActiveMenu("dashboard");
            // setNav(true);
            setNav(!nav);
          }}
        />
      </div>

      <div
        className={`w-40 h-[calc(100vh-3.5rem)] p-7 text-xs flex flex-col gap-3 bg-gray-900 text-white uppercase overflow-y-auto ${
          nav ? "" : "hidden"
        } `}
      >
        {renderSubMenu()}
      </div>
    </div>
  );
};

export default Navigation;
