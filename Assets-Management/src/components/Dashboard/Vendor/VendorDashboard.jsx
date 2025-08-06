import React, { useEffect, useState } from "react";
import { FaDesktop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import VendorByLocationBarChart from "./VendorByLocationBarChart";
import { Card, Container } from "@mui/material";
import VendorByCategoryPieChart from "./VendorByCategoryPieChart";
import VendorByStatusPieChart from "./VendorByStatusPieChart";
function VendorDashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);

  const fetchVendorDashboardData = async () => {
    // const response = await
    // setChartData()
  };
  useEffect(() => {
    fetchVendorDashboardData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 justify-center p-6">
        <div className="flex justify-between items-center">
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
          <div className="flex flex-wrap gap-4">
            <div className="w-[25%] min-w-[250px] flex-1">
              <VendorByCategoryPieChart />
            </div>
            <div className="w-[25%] min-w-[250px] flex-1">
              <VendorByStatusPieChart />
            </div>
          </div>
          <div className="flex-1 min-w-[300px]">
            <Card className="p-4 bg-white shadow-md rounded-lg">
              <VendorByLocationBarChart
                title="Vendor By Location"
                chartData={chartData}
                min={0}
                max={1.0}
                stepSizes={0.2}
                ticksArray={[0.0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
