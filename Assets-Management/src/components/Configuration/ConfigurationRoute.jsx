import React from "react";
import { Routes, Route } from "react-router-dom";
import Components from "./Global/Components.jsx";
import Users from "./Global/Users.jsx";
import AddUser from "./Global/AddUser.jsx";
function ConfigurationRoute() {
  return (
    <>
      <Routes>
        <Route path="components" element={<Components />} />
        <Route path="Users" element={<Users />} />
        <Route path="AddUser" element={<AddUser />} />
      </Routes>
    </>
  );
}

export default ConfigurationRoute;
