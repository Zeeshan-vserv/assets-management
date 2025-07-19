import React, { useState } from "react";

import { FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function ServiceRequest() {
  const navigate = useNavigate();

  const cardData = [
    {
      id: "1",
      totalCount: "0",
      description: "New",
    },
    {
      id: "2",
      totalCount: "0",
      description: "Approval Pending",
    },
    {
      id: "3",
      totalCount: "0",
      description: "Provisioning",
    },
    {
      id: "4",
      totalCount: "0",
      description: "Assigned",
    },
    {
      id: "5",
      totalCount: "0",
      description: "In-Progress",
    },
    {
      id: "6",
      totalCount: "0",
      description: "Hold",
    },
    {
      id: "7",
      totalCount: "0",
      description: "Cancelled",
    },
    {
      id: "8",
      totalCount: "0",
      description: "Rejected",
    },
    {
      id: "9",
      totalCount: "0",
      description: "Resolved",
    },
    {
      id: "10",
      totalCount: "0",
      description: "Closed",
    },
    {
      id: "11",
      totalCount: "0",
      description: "Waiting for Update",
    },
    {
      id: "12",
      totalCount: "0",
      description: "Coverte to SR",
    },
    {
      id: "13",
      totalCount: "0",
      description: "Total",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold mb-6 text-start">
            ALL SERVICE REQUESTS
          </h2>
          <button
            onClick={() => navigate("/main/dashboard/request")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-2 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span> View Dashboard</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {cardData.map((item) => {
            const countKey = Object.keys(item).find((key) =>
              key.endsWith("Count")
            );
            const count = item[countKey];

            return (
              <div
                key={item?.id}
                className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
              >
                <h2 className="font-semibold text-xl text-blue-600 mb-1">
                  {count}
                </h2>
                <span className="text-sm">{item.description}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ServiceRequest;
