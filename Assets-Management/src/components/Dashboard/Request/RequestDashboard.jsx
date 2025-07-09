import React from "react";
import { FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function RequestDashboard() {
  const navigate = useNavigate();
  const serviceRequestData = [
    {
      name: "",
      value: "",
    },
    
  ];
  return (
    <>
      <div className="flex flex-col gap-6 justify-center p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-start">SERVICE REQUEST</h2>
          <button
            onClick={() => navigate("")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span>Go To Module</span>
            </div>
          </button>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default RequestDashboard;
