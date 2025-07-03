import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./Navigation.jsx";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.jsx"));
const Incident = lazy(() => import("../pages/Incidents/Incident.jsx"));
const ServiceRequest = lazy(() => import("../pages/Service-Request/ServiceRequest.jsx"));
const MyAssets = lazy(() => import("../pages/My-Assests/MyAssets.jsx"));
const MyApproval = lazy(() => import("../pages/My-Approval/MyApproval.jsx"));

const Body = ({ nav, setNav }) => {
  return (
    <div className="flex mt-14">
      <div>
        <Navigation nav={nav} setNav={setNav} />
      </div>
      <div className="max-h-[calc(100vh-3.5rem)] w-[100%] overflow-y-auto ">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidents" element={<Incident />} />
            <Route path="service-request" element={<ServiceRequest />} />
            <Route path="my-assets" element={<MyAssets />} />
            <Route path="my-approval" element={<MyApproval />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Body;