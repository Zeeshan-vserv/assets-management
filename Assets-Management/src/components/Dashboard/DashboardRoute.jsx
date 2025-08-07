import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardAsset from "./Asset/DashboardAsset";
import IncidentDashboard from "./Incident/IncidentDashboard"
import RequestDashboard from "./Request/RequestDashboard";
import SoftwareDashboard from "./Software/SoftwareDashboard";
import VendorDashboard from "./Vendor/VendorDashboard";
import TaskDashboard from "./Task/TaskDashboard"
import Report from "./AuditReport/Report";
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
        <Route path="/AuditReport" element={<Report />} />
      </Routes>
    </>
  );
}

export default DashboardRoute;
