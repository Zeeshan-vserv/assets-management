import React, { useEffect, useState } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import IncidentDetails from "./IncidentDetails";
import TotalIncidentBarChart from "./BarGraph/TotalIncidentBarChart";
import { Card } from "@mui/material";
import OpenIncidentStatusPieChart from "./PieChart/OpenIncidentStatusPieChart";
import OpenIncidentSaverityPieChart from "./PieChart/OpenIncidentSaverityPieChart";
import ResponseSlaStatusPieChart from "./PieChart/ResponseSlaStatusPieChart";
import ResolutionSlaStatusPieChart from "./PieChart/ResolutionSlaStatusPieChart";
import BarGraphForIncident from "./BarGraph/BarGraphForIncident";
import FeedbackForTicketClosedPieChart from "./PieChart/FeedbackForTicketClosedPieChart";
import { getAllIncident } from "../../../api/IncidentRequest";

function IncidentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    New: 0,
    Assigned: 0,
    InProgress: 0,
    Pause: 0,
    Resolved: 0,
    Cancelled: 0,
    Closed: 0,
    Total: 0,
  });

  const [chartData, setChartData] = useState([]);

  const fetchIncidentData = async () => {
    try {
      const response = await getAllIncident();
      let incidents = response?.data.data || [];
      setData(incidents);
      const counts = {
        New: 0,
        Assigned: 0,
        InProgress: 0,
        Pause: 0,
        Resolved: 0,
        Cancelled: 0,
        Closed: 0,
        Total: incidents.length,
      };

      incidents.forEach((item) => {
        const status = item.status;
        if (counts[status] !== undefined) {
          counts[status]++;
        }
      });

      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching incident data:", error);
    }
  };
  useEffect(() => {
    fetchIncidentData();
  }, []);
  console.log("data", data);

  const fetchChartData = async () => {
    try {
      //api call
      // setChartData()
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };
  useEffect(() => {
    fetchChartData();
  }, []);

  const cardData = [
    {
      id: "1",
      count: statusCounts.New,
      description: "New",
    },
    {
      id: "2",
      count: statusCounts.Assigned,
      description: "Assigned",
    },
    {
      id: "3",
      count: statusCounts.InProgress,
      description: "InProgress",
    },
    {
      id: "4",
      count: statusCounts.Pause,
      description: "Pause",
    },
    {
      id: "5",
      count: statusCounts.Resolved,
      description: "Resolved",
    },
    {
      id: "6",
      count: statusCounts.Cancelled,
      description: "Cancelled",
    },
    {
      id: "7",
      count: statusCounts.Closed,
      description: "Closed",
    },
    {
      id: "8",
      count: statusCounts.Total,
      description: "Total",
    },
  ];
  return (
    <>
      <div className="flex flex-col justify-center w-full min-h-full p-4 bg-slate-100">
        <div className="flex justify-between mb-4 p-2">
          <h2 className="text-lg font-semibold text-start">INCIDENT</h2>
          <button
            onClick={() => navigate("/main/ServiceDesk/IndicentData")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <MdOutlineDashboard size={12} />
              <span>Go To Module</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 p-2">
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
        </div>
        {/* table */}
        <IncidentDetails />
        {/* Bar graph */}
        <Card className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <TotalIncidentBarChart
            title="Total Incidents"
            chartData={chartData}
          />
        </Card>
        {/* Pie chart */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <OpenIncidentStatusPieChart />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <OpenIncidentSaverityPieChart />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <ResponseSlaStatusPieChart />
          </div>
          <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full">
            <ResolutionSlaStatusPieChart />
          </div>
        </div>
        {/* Bar graph */}
        <div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Technician"
                min={0}
                max={5}
                stepSizes={1}
                ticksArray={[0.0, 1.0, 2.0, 3.0, 4.0, 5.0]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Technician"
                min={0}
                max={1200}
                stepSizes={300}
                ticksArray={[0, 300, 600, 900, 1200]}
              />
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Support Group"
                min={0}
                max={50}
                stepSizes={10}
                ticksArray={[0, 10, 20, 30, 40, 50]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Support Group"
                min={0}
                max={6000}
                stepSizes={1000}
                ticksArray={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Category"
                min={0}
                max={6}
                stepSizes={2}
                ticksArray={[0, 2, 4, 6]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Category"
                min={0}
                max={1000}
                stepSizes={200}
                ticksArray={[0, 200, 400, 600, 800, 1000]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Sub Category"
                min={0}
                max={6}
                stepSizes={2}
                ticksArray={[0, 2, 4, 6]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Sub Category"
                min={0}
                max={1200}
                stepSizes={300}
                ticksArray={[0, 300, 600, 900, 1200]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Location"
                min={0}
                max={4}
                stepSizes={1}
                ticksArray={[1, 2, 3, 4]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Location"
                min={0}
                max={360}
                stepSizes={90}
                ticksArray={[0, 90, 180, 270, 360]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Sub Location"
                min={0}
                max={4}
                stepSizes={1}
                ticksArray={[1, 2, 3, 4]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Sub Location"
                min={0}
                max={320}
                stepSizes={80}
                ticksArray={[0, 80, 160, 240, 320]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Open Incidents By Support Department"
                min={0}
                max={50}
                stepSizes={10}
                ticksArray={[0, 10, 20, 30, 40, 50]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={chartData}
                title="Closed Incidents By Feedback Rating"
                min={0}
                max={3}
                stepSizes={1}
                ticksArray={[0, 1, 2, 3, 4]}
              />
            </Card>
          </div>
        </div>
        <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full mt-4">
          <FeedbackForTicketClosedPieChart />
        </div>
      </div>
    </>
  );
}

export default IncidentDashboard;
