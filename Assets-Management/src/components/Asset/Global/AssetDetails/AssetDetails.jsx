import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetById } from "../../../../api/AssetsRequest";
import Dashboard from "./Dashboard";
import Summary from "./Summary";
import AssetMapping from "./AssetMapping";
// import Relationship from "./Relationship";
import Preventive from "./Preventive";
import Task from "./Task";
import Incidents from "./Incidents";
import Documents from "./Documents";
import AssetComponents from "./AssetComponents";
import StatusLogs from "./StatusLogs";
import AuditsLogs from "./AuditsLogs";
import HwChangeLogs from "./HwChangeLogs";
import SwChangeLogs from "./SwChangeLogs";
import Insurances from "./Insurances";
import Finance from "./Finance";

function AssetDetails() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assetMappingModal, setAssetMappingModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getAssetById(id);
      setData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching asset details:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard id={id} />;
      case "summary":
        return <Summary id={id} />;
      case "assetMapping":
        return (
          <AssetMapping
            assetMappingModal={assetMappingModal}
            setAssetMappingModal={setAssetMappingModal}
            id={id}
          />
        );
      // case "relationship":
      //   return <Relationship />;
      case "preventive":
        return <Preventive id={id} />;
      case "task":
        return <Task id={id} />;
      case "incidents":
        return <Incidents id={id} />;
      case "documents":
        return <Documents id={id} />;
      case "finance":
        return <Finance id={id} />;
      case "assetComponents":
        return <AssetComponents id={id} />;
      case "statusLogs":
        return <StatusLogs id={id} />;
      case "insurances":
        return <Insurances id={id} />;
      case "auditsLogs":
        return <AuditsLogs id={id} />;
      // case "hwChangeLogs":
      //   return <HwChangeLogs id={id} />;
      // case "swChangeLogs":
      //   return <SwChangeLogs id={id} />;
      default:
        return;
    }
  };

  return (
    <>
      <div className="w-[100%] h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-start">
          ASSET TAG NO - {data?.assetInformation?.assetTag}
        </h2>
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex flex-row justify-between items-start max-md:flex-col">
            <div className="flex flex-col gap-2 mb-6 w-48">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-2 py-1 border-2 border-gray-400 rounded-md transition-colors w-full text-left ${
                  activeTab === "dashboard"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-2 py-1 border-2 border-gray-400 rounded-md transition-colors w-full text-left ${
                  activeTab === "summary"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                Summary
              </button>
              {/* <button
                onClick={() => {
                  setActiveTab("assetMapping");
                  setAssetMappingModal(true);
                }}
                className={`px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "assetMapping"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                Asset Mapping
              </button> */}
              {/* <button
                onClick={() => setActiveTab("relationship")}
                className={`px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "relationship"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                Relationship
              </button> */}
              {/* <button
                onClick={() => setActiveTab("preventive")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "preventive"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Preventive</span>
                <span>()</span>
              </button> */}
              {/* <button
                onClick={() => setActiveTab("task")}
                className={`flex items-center justify-between px-2 py-1 border-2  rounded-md border-gray-400 transition-colors w-full text-left ${
                  activeTab === "task"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Task</span>
                <span>()</span>
              </button> */}
              <button
                onClick={() => setActiveTab("incidents")}
                className={`flex items-center justify-between px-2 py-1 border-2  rounded-md border-gray-400 transition-colors w-full text-left ${
                  activeTab === "incidents"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Incidents</span>
                <span>()</span>
              </button>
              {/* <button
                onClick={() => setActiveTab("documents")}
                className={`flex items-center justify-between px-2 py-1 border-2  rounded-md border-gray-400 transition-colors w-full text-left ${
                  activeTab === "documents"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Documents</span>
                <span>()</span>
              </button> */}
              {/* <button
                onClick={() => setActiveTab("finance")}
                className={`px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "finance"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                Finance
              </button> */}
              {/* <button
                onClick={() => setActiveTab("assetComponents")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "assetComponents"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Asset Components</span>
                <span>()</span>
              </button> */}
              {/* <button
                onClick={() => setActiveTab("statusLogs")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "statusLogs"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Status Logs</span>
                <span>()</span>
              </button> */}
              {/* <button
                onClick={() => setActiveTab("insurances")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "insurances"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Insurances</span>
                <span>()</span>
              </button> */}
              <button
                onClick={() => setActiveTab("auditsLogs")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "auditsLogs"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>Audits Logs</span>
                <span>()</span>
              </button>
              {/* <button
                onClick={() => setActiveTab("hwChangeLogs")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "hwChangeLogs"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>HW Change Logs</span>
                <span>()</span>
              </button>
              <button
                onClick={() => setActiveTab("swChangeLogs")}
                className={`flex items-center justify-between px-2 py-1 border-2 border-gray-400 rounded-md  transition-colors w-full text-left ${
                  activeTab === "swChangeLogs"
                    ? "bg-[#4397F3] text-white border-[#4397F3]"
                    : "border-[#A0C8F8] hover:border-[#7BB2F5]"
                }`}
              >
                <span>SW Change Logs</span>
                <span>()</span>
              </button> */}
            </div>
            <div className="flex-1 ml-4 p-4 min-h-full bg-white overflow-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AssetDetails;
