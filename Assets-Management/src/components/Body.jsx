import React from "react";
import Navigation from "./Navigation";
import ConfigurationRoute from "./Configuration/ConfigurationRoute";
import { Routes, Route } from "react-router-dom";
import AssetRoute from "./Asset/AssetRoute";
import Test from "../pages/Test";
import ServiceDeskRoute from "./ServiceDesk/ServiceDeskRoute";
import DashboardRoute from "./Dashboard/DashboardRoute.jsx";

const Body = ({ nav, setNav }) => {
  return (
    <div className="flex mt-14">
      <div>
        <Navigation nav={nav} setNav={setNav} />
      </div>
      <div className="max-h-[calc(100vh-3.5rem)] w-[100%] overflow-scroll">
        <Routes>
          <Route path="/Configuration/*" element={<ConfigurationRoute />} />
          <Route path="/Asset/*" element={<AssetRoute />} />
          <Route path="/test" element={<Test />} />
          <Route path="/ServiceDesk/*" element={<ServiceDeskRoute />} />
          <Route path="/dashboard/*" element={<DashboardRoute />} />
        </Routes>
      </div>
    </div>
  );
};

export default Body;
