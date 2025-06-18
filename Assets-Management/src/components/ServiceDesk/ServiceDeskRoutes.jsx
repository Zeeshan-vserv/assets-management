import React from "react";
import { Routes, Route } from "react-router-dom";
import IncidentsData from "./Incidents/IncidentsData";
import NewIncident from "./Incidents/NewIncident";

const ServiceDeskRoutes = () => {
  return (
    <Routes>
      <Route path="IndicentData" element={<IncidentsData />} />
      <Route path="NewIncident" element={<NewIncident />} />
    </Routes>
  );
};

export default ServiceDeskRoutes;
