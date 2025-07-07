import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardAsset from "./DashboardAsset";
import IncidentDashboard from "./IncidentDashboard";
import RequestDashboard from "./RequestDashboard";
import SoftwareDashboard from "./SoftwareDashboard";
import VendorDashboard from "./VendorDashboard";
import TaskDashboard from "./TaskDashboard";

function DashboardRoute() {
  return (
    <>
      <Routes>
        <Route path="/incident" element={<IncidentDashboard />} />
        <Route path="/request" element={<RequestDashboard />} />
        <Route path="/software" element={<SoftwareDashboard />} />
        <Route path="/task" element={<TaskDashboard />} />
        <Route path="/asset" element={<DashboardAsset />} />
        <Route path="/vendor" element={<VendorDashboard />} />
      </Routes>
    </>
  );
}

export default DashboardRoute;
