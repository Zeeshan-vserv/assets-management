import React, { useCallback, useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import RequestDetails from "./RequestDetails";
import { Card } from "@mui/material";
import TotalRequestBarChart from "./BarGraph/TotalRequestBarChart";
import OpenServiceByStatus from "./PieChart/OpenServiceByStatus";
import OpenServiceBySeverity from "./PieChart/OpenServiceBySeverity";
import ResponseSlaStatusPieChart from "../Incident/PieChart/ResponseSlaStatusPieChart";
import ResolutionSlaStatusPieChart from "../Incident/PieChart/ResolutionSlaStatusPieChart";
import BarGraphForIncident from "../Incident/BarGraph/BarGraphForIncident";
import { getAllServiceRequests, getServiceRequestStatusCounts } from "../../../api/serviceRequest";

function RequestDashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // <-- Add this line

  const fetchService = useCallback(async () => {
    setIsLoading(true);
    try {
      const countResponse = await getServiceRequestStatusCounts();
      // Convert object to array if needed
      let counts = countResponse?.data?.data;
      if (counts && !Array.isArray(counts)) {
        counts = [
          { id: "1", count: counts["New"] || 0, description: "New" },
          { id: "2", count: counts["Assigned"] || 0, description: "Assigned" },
          {
            id: "3",
            count: counts["In-Progress"] || 0,
            description: "In-Progress",
          },
          { id: "4", count: counts["Pause"] || 0, description: "Pause" },
          { id: "5", count: counts["Resolved"] || 0, description: "Resolved" },
          {
            id: "6",
            count: counts["Cancelled"] || counts["cancel"] || 0,
            description: "Cancelled",
          },
          {
            id: "7",
            count: counts["Reopened"] || counts["reopen"] || 0,
            description: "Reopened",
          },
          { id: "8", count: counts["Closed"] || 0, description: "Closed" },
          {
            id: "9",
            count: counts["Converted to SR"] || 0,
            description: "Converted to SR",
          },
          // Add more statuses if needed
        ];
      }
      setCardData(counts || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Calculate total count
  const totalCount = cardData.reduce((sum, item) => sum + (Number(item.count) || 0), 0);

  return (
    <>
      <div className="flex flex-col gap-6 w-full min-h-full p-4 bg-slate-100">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-start">SERVICE REQUEST</h2>
          <button
            onClick={() => navigate("/main/ServiceDesk/service-request")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <MdOutlineDashboard size={13} />
              <span>Go To Module</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 p-2">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-500">Loading...</div>
          ) : cardData.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No data available</div>
          ) : (
            <>
              {/* Total Card */}
              <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition">
                <h2 className="font-semibold text-xl text-green-600 mb-1">
                  {totalCount}
                </h2>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              {/* Status Cards */}
              {cardData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
                >
                  <h2 className="font-semibold text-xl text-blue-600 mb-1">
                    {item.count}
                  </h2>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </>
          )}
        </div>
        {/* Request Details table */}
        <RequestDetails />
        {/* Bar graph */}
        <Card className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <TotalRequestBarChart title="Total Requests" chartData={chartData} />
        </Card>
        {/*Request Pie chart */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <OpenServiceByStatus />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <OpenServiceBySeverity />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <ResponseSlaStatusPieChart />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <ResolutionSlaStatusPieChart />
          </div>
        </div>
        {/* Bar graph */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
            <BarGraphForIncident
              chartData={chartData}
              title="Open Service By Support Group"
              min={0}
              max={1}
              stepSizes={0.2}
              ticksArray={[0.0, 0.2, 0.4, 0.6, 0.8, 1]}
            />
          </Card>
          <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
            <BarGraphForIncident
              chartData={chartData}
              title="Open Service By Sub Category"
              min={0}
              max={1}
              stepSizes={0.2}
              ticksArray={[0.0, 0.2, 0.4, 0.6, 0.8, 1]}
            />
          </Card>
        </div>
        <Card className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <BarGraphForIncident
            chartData={chartData}
            title="Open Service By Support Department"
            min={0}
            max={1}
            stepSizes={0.2}
            ticksArray={[0.0, 0.2, 0.4, 0.6, 0.8, 1]}
          />
        </Card>
      </div>
    </>
  );
}

export default RequestDashboard;
