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
import {
  getAllIncident,
  getIncidentStatusCounts,
} from "../../../api/IncidentRequest";
import {
  getIncidentOpenClosedByField,
  getTechnicianIncidentStatusSummary,
} from "../../../api/DashboardRequest";
import { getServiceRequestStatusCounts } from "../../../api/serviceRequest";

function IncidentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [technicianIncidentData, setTechnicianIncidentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [subLocationData, setSubLocationData] = useState([]);
  const [supportGroupData, setSupportGroupData] = useState([]);
  const [supportDepartmentData, setSupportDepartmentData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [chartData, setChartData] = useState([]);

  const fetchIncidentData = async () => {
    try {
      const response = await getAllIncident();
      setData(response?.data?.data || []);
      const countResponse = await getIncidentStatusCounts();
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
          {
            id: "11",
            count: response?.data?.data?.length || 0,
            description: "Total",
          },
        ];
      }
      setCardData(counts || []);
    } catch (error) {
      console.error("Error fetching incident data:", error);
    }
  };
  useEffect(() => {
    fetchIncidentData();
  }, []);
  // console.log("data", data);

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

  const fetchTechnicianIncidentSummary = async () => {
    try {
      const res = await getTechnicianIncidentStatusSummary();
      setTechnicianIncidentData(res.data.data || []);
    } catch (error) {
      setTechnicianIncidentData([]);
      console.error("Error fetching technician incident summary:", error);
    }
  };

  useEffect(() => {
    fetchTechnicianIncidentSummary();
  }, []);

  useEffect(() => {
    const fetchGroupData = async () => {
      const today = new Date();
      const from = new Date(today);
      from.setDate(today.getDate() - 30);
      const fromStr = from.toISOString().slice(0, 10);
      const toStr = today.toISOString().slice(0, 10);

      try {
        const [cat, subCat, loc, subLoc, group, dept] = await Promise.all([
          getIncidentOpenClosedByField("category", fromStr, toStr),
          getIncidentOpenClosedByField("subCategory", fromStr, toStr),
          getIncidentOpenClosedByField("location", fromStr, toStr),
          getIncidentOpenClosedByField("subLocation", fromStr, toStr),
          getIncidentOpenClosedByField("supportGroup", fromStr, toStr),
          getIncidentOpenClosedByField("supportDepartment", fromStr, toStr),
        ]);
        setCategoryData(cat.data.data || []);
        setSubCategoryData(subCat.data.data || []);
        setLocationData(loc.data.data || []);
        setSubLocationData(subLoc.data.data || []);
        setSupportGroupData(group.data.data || []);
        setSupportDepartmentData(dept.data.data || []);
      } catch (error) {
        setCategoryData([]);
        setSubCategoryData([]);
        setLocationData([]);
        setSubLocationData([]);
        setSupportGroupData([]);
        setSupportDepartmentData([]);
        console.error("Error fetching group data:", error);
      }
    };
    fetchGroupData();
  }, []);

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
            min={0}
            max={15}
            stepSizes={3}
            ticksArray={[0, 3, 6, 9, 12, 15]}
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
            {/* <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={technicianIncidentData.map((t) => ({
                  name: t.technician,
                  value: t.Open,
                }))}

                title="Open Incidents By Technician"
                min={0}
                max={5}
                stepSizes={1}
                ticksArray={[0.0, 1.0, 2.0, 3.0, 4.0, 5.0]}
              />
            </Card> */}
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={technicianIncidentData.map((t) => ({
                  name: t.technician,
                  value: t.Open,
                }))}
                title="Open Incidents By Technician"
                min={0}
                max={
                  technicianIncidentData.length > 0
                    ? Math.max(...technicianIncidentData.map((t) => t.Open))
                    : 1
                }
                stepSizes={1}
                ticksArray={
                  technicianIncidentData.length > 0
                    ? Array.from(
                        {
                          length:
                            Math.max(
                              ...technicianIncidentData.map((t) => t.Open)
                            ) + 1,
                        },
                        (_, i) => i
                      )
                    : [0, 1]
                }
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={technicianIncidentData.map((t) => ({
                  name: t.technician,
                  value: t.Closed,
                }))}
                title="Closed Incidents By Technician"
                min={0}
                max={4}
                stepSizes={1}
                ticksArray={[0, 1, 2, 3, 4]}
              />
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={supportGroupData.map((d) => ({
                  name: d.supportGroup,
                  value: d.Open,
                }))}
                title="Open Incidents By Support Group"
                min={0}
                max={50}
                stepSizes={10}
                ticksArray={[0, 10, 20, 30, 40, 50]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={supportGroupData.map((d) => ({
                  name: d.supportGroup,
                  value: d.Closed,
                }))}
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
                chartData={categoryData.map((d) => ({
                  name: d.category,
                  value: d.Open,
                }))}
                title="Open Incidents By Category"
                min={0}
                max={6}
                stepSizes={2}
                ticksArray={[0, 2, 4, 6]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={categoryData.map((d) => ({
                  name: d.category,
                  value: d.Closed,
                }))}
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
                chartData={subCategoryData.map((d) => ({
                  name: d.subCategory,
                  value: d.Open,
                }))}
                title="Open Incidents By Sub Category"
                min={0}
                max={6}
                stepSizes={2}
                ticksArray={[0, 2, 4, 6]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={subCategoryData.map((d) => ({
                  name: d.subCategory,
                  value: d.Closed,
                }))}
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
                chartData={locationData.map((d) => ({
                  name: d.location,
                  value: d.Open,
                }))}
                title="Open Incidents By Location"
                min={0}
                max={4}
                stepSizes={1}
                ticksArray={[1, 2, 3, 4]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={locationData.map((d) => ({
                  name: d.location,
                  value: d.Close,
                }))}
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
                chartData={subLocationData.map((d) => ({
                  name: d.subLocation,
                  value: d.Open,
                }))}
                title="Open Incidents By Sub Location"
                min={0}
                max={4}
                stepSizes={1}
                ticksArray={[1, 2, 3, 4]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={subLocationData.map((d) => ({
                  name: d.subLocation,
                  value: d.Close,
                }))}
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
                chartData={supportDepartmentData.map((d) => ({
                  name: d.supportDepartment,
                  value: d.Open,
                }))}
                title="Open Incidents By Support Department"
                min={0}
                max={50}
                stepSizes={10}
                ticksArray={[0, 10, 20, 30, 40, 50]}
              />
            </Card>
            <Card className="flex-1 min-w-[300px] p-4 bg-white shadow-md rounded-lg">
              <BarGraphForIncident
                chartData={supportDepartmentData.map((d) => ({
                  name: d.supportDepartment,
                  value: d.Close,
                }))}
                title="Closed Incidents By Support Department"
                min={0}
                max={3}
                stepSizes={1}
                ticksArray={[0, 1, 2, 3, 4]}
              />
            </Card>
          </div>
        </div>
        {/* <div className="w-[23%] min-w-[250px] max-lg:w-[48%] max-md:w-full mt-4">
          <FeedbackForTicketClosedPieChart />
        </div> */}
      </div>
    </>
  );
}

export default IncidentDashboard;
