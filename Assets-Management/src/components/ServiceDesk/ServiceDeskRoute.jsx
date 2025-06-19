import React from "react";
import { Route, Routes } from "react-router-dom";
import AllVendors from "./vendor/AllVendors.jsx";
import NewVendor from "./vendor/NewVendor.jsx";
function ServiceDeskRoute() {
  return (
    <>
      <Routes>
        <Route path="all-vendors" element={<AllVendors />} />
        <Route path="new-vendor" element={<NewVendor />} />
      </Routes>
    </>
  );
}

export default ServiceDeskRoute;
