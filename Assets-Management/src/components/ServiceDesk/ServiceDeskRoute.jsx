import React from "react";
import { Route, Routes } from "react-router-dom";
import AllVendors from "./vendor/AllVendors.jsx";
import NewVendor from "./vendor/NewVendor.jsx";
import IncidentsData from "./Incidents/IncidentsData.jsx";
import NewIncident from "./Incidents/NewIncident.jsx";
function ServiceDeskRoute() {
  return (
    <>
      <Routes>
        <Route path="NewIncident" element={<NewIncident />} />
        <Route path="IndicentData" element={<IncidentsData />} />
        <Route path="AllVendors" element={<AllVendors />} />
        <Route path="NewVendor" element={<NewVendor />} />
      </Routes>
    </>
  );
}

export default ServiceDeskRoute;
