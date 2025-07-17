import React from "react";
import { Route, Routes } from "react-router-dom";
import AllVendors from "./vendor/AllVendors.jsx";
import NewVendor from "./vendor/NewVendor.jsx";
import IncidentsData from "./Incidents/IncidentsData.jsx";
import NewIncident from "./Incidents/NewIncident.jsx";
import EditIncident from "./Incidents/EditIncident.jsx";
import NewIncidentsAssigned from "./Incidents/NewIncidentsAssigned.jsx";
import ServiceRequest from "./Service-Request/ServiceRequest.jsx";
function ServiceDeskRoute() {
  return (
    <>
      <Routes>
        {/* inciendt and vendor routes */}
        <Route path="NewIncident" element={<NewIncident />} />
        <Route
          path="new-incidents-assigned"
          element={<NewIncidentsAssigned />}
        />
        <Route path="EditIncident/:id" element={<EditIncident />} />
        <Route path="IndicentData" element={<IncidentsData />} />
        <Route path="AllVendors" element={<AllVendors />} />
        <Route path="NewVendor" element={<NewVendor />} />
        {/* service-request route */}
        <Route path="service-request" element={<ServiceRequest />} />
      </Routes>
    </>
  );
}

export default ServiceDeskRoute;
