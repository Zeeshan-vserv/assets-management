import React from "react";
import { Routes, Route } from "react-router-dom";
import Components from "./Global/Components.jsx";
function ConfigurationRoute() {
  return (
    <>
      <Routes>
        <Route path="components" element={<Components />} />
      </Routes>
    </>
  );
}

export default ConfigurationRoute;
