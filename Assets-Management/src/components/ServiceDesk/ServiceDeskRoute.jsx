import React from "react";
import { Route, Routes } from "react-router-dom";
import AllVendors from "./vendor/AllVendors.jsx";
import NewVendor from "./vendor/NewVendor.jsx";
import IncidentsData from "./Incidents/IncidentsData.jsx";
import NewIncident from "./Incidents/NewIncident.jsx";
import EditIncident from "./Incidents/EditIncident.jsx";
import NewIncidentsAssigned from "./Incidents/NewIncidentsAssigned.jsx";
import ServiceRequest from "./Service-Request/ServiceRequest.jsx";
import NewServiceRequest from "./Service-Request/NewServiceRequest.jsx";
import EditServiceRequest from "./Service-Request/EditServiceRequest.jsx";
import EditVendor from "./vendor/EditVendor.jsx";
import TaskAssigned from "./Incidents/TaskAssigned.jsx";
import UpdateStatus from "./Incidents/UpdateStatus.jsx";
import UpdateServiceStatus from "./Incidents/UpdateServiceStatus.jsx";
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
        <Route path="TaskAssigned" element={<TaskAssigned />} />
        <Route path="AllVendors" element={<AllVendors />} />
        <Route path="NewVendor" element={<NewVendor />} />
        <Route path="EditVendor/:id" element={<EditVendor />} />
        <Route path="UpdateStatus/:id" element={<UpdateStatus />} />
        <Route path="UpdateServiceStatus/:id" element={<UpdateServiceStatus />} />
        {/* service-request route */}
        <Route path="service-request" element={<ServiceRequest />} />
        <Route path="new-service-request" element={<NewServiceRequest />} />
        <Route path="edit-service-request/:id" element={<EditServiceRequest />} />
      </Routes>
    </>
  );
}

export default ServiceDeskRoute;
