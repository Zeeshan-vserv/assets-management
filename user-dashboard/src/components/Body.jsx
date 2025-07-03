import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./Navigation.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Incident from "../pages/Incidents/Incident.jsx";
import ServiceRequest from "../pages/Service-Request/ServiceRequest.jsx";
import MyAssets from "../pages/My-Assests/MyAssets.jsx";
import MyApproval from "../pages/My-Approval/MyApproval.jsx";
import NewIncidents from "../pages/Incidents/NewIncidents.jsx";
import IncidentDetails from "../pages/Incidents/IncidentDetails.jsx";
const Body = ({ nav, setNav }) => {
  return (
    <div className="flex mt-14">
      <div>
        <Navigation nav={nav} setNav={setNav} />
      </div>
      <div className="max-h-[calc(100vh-3.5rem)] w-[100%] overflow-y-auto ">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incidents" element={<Incident />} />
          <Route path="incidents/:id" element={<IncidentDetails />} />
          <Route path="new-incident" element={<NewIncidents />} />
          <Route path="service-request" element={<ServiceRequest />} />
          <Route path="my-assets" element={<MyAssets />} />
          <Route path="my-approval" element={<MyApproval />} />
          {/* <Route path="auth" element={<Login />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default Body;
