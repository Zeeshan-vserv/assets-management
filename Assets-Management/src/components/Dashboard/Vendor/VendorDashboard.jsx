import React from "react";
import { FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AssetPieChart from "../Asset/AssetPieChart";
import VendorByLocationBarChart from "./VendorByLocationBarChart";
import { Container } from "@mui/material";

function VendorDashboard() {
  const navigate = useNavigate();
  const vendorByCategory = [
    { id: 0, value: 30, label: "Category - A", color: "#1976d2" },
  ];

  const vendorByStatus = [
    { id: 0, value: 30, label: "Active", color: "#1976d2" },
  ];
  return (
    <>
      <div className="flex flex-col gap-6 justify-center p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-start">VENDOR</h2>
          <button
            onClick={() => navigate("/main/ServiceDesk/AllVendors")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span>Go To Module</span>
            </div>
          </button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <AssetPieChart title="Vendor By Category" data={vendorByCategory} />
          <AssetPieChart title="Vendor By Status" data={vendorByStatus} />
        </div>
        <Container sx={{ mt: 4 }}>
          <VendorByLocationBarChart />
        </Container>
      </div>
    </>
  );
}

export default VendorDashboard;
