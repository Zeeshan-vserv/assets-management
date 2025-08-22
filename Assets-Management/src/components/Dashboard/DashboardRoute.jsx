import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardAsset from "./Asset/DashboardAsset";
import IncidentDashboard from "./Incident/IncidentDashboard";
import RequestDashboard from "./Request/RequestDashboard";
import SoftwareDashboard from "./Software/SoftwareDashboard";
import VendorDashboard from "./Vendor/VendorDashboard";
import TaskDashboard from "./Task/TaskDashboard";
import Report from "./AuditReport/Report";
import UserInformation from "./AuditLogs/UserInformation";
import UserStatusLogs from "./AuditLogs/UserStatusLogs";
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
        <Route path="/user-information" element={<UserInformation />} />
        <Route path="/user-status-logs" element={<UserStatusLogs />} />
      </Routes>
    </>
  );
}

export default DashboardRoute;
