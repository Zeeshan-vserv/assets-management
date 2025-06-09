import React from "react";
import { Routes, Route } from "react-router-dom";
import Components from "./Global/Components.jsx";
import Users from "./Global/Users.jsx";
import AddUser from "./Global/AddUser.jsx";
import EditUser from "./Global/EditUser.jsx";
import Department from "./Global/Department.jsx";
import SubDepartment from "./Global/SubDepartment.jsx";
function ConfigurationRoute() {
  return (
    <>
      <Routes>
        <Route path="components" element={<Components />} />
        <Route path="Users" element={<Users />} />
        <Route path="AddUser" element={<AddUser />} />
        <Route path=":id" element={<EditUser />} />
        <Route path="department" element={<Department />} />
        <Route path="sub-department" element={<SubDepartment />} />
      </Routes>
    </>
  );
}

export default ConfigurationRoute;
