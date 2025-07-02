import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { MdOutlineVerifiedUser } from "react-icons/md";
import RecentIncidents from "./RecentIncidents.jsx";
import RecentRequest from "./RecentRequest.jsx";
import IncidentChart from "./IncidentChart.jsx";
import { NavLink } from "react-router-dom";
import MyServiceRequestChart from "./MyServiceRequestChart.jsx";

function Dashboard() {
  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <div className="flex flex-wrap justify-center items-center gap-8 mt-8">
          <NavLink to="">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-2 text-white shadow-md backdrop-blur-sm transition-all border-white cursor-pointer">
              <IoIosAddCircleOutline
                size={20}
                className="text-white drop-shadow-sm"
              />
              <span className="text-sm font-semibold tracking-wide">
                New Incident
              </span>
            </button>
          </NavLink>

          <NavLink to="">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-2 text-white shadow-md backdrop-blur-sm transition-all border-white cursor-pointer">
              <IoIosAddCircleOutline size={20} />
              <span className="text-sm font-semibold tracking-wide">
                New Request
              </span>
            </button>
          </NavLink>

          <NavLink to="">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-2 text-white shadow-md backdrop-blur-sm transition-all border-white cursor-pointer">
              <MdOutlineDesktopWindows size={20} />
              <span className="text-sm font-semibold tracking-wide">
                My Assets
              </span>
            </button>
          </NavLink>

          <NavLink to="">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-2 text-white shadow-md backdrop-blur-sm transition-all border-white cursor-pointer">
              <MdOutlineVerifiedUser size={20} />
              <span className="text-sm font-semibold tracking-wide">
                My Approvals
              </span>
            </button>
          </NavLink>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-5 mt-5">
          <IncidentChart />
          <MyServiceRequestChart />
        </div>

        <div className="flex flex-col justify-center items-center gap-8 mt-8">
          <RecentIncidents />
          <RecentRequest />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
