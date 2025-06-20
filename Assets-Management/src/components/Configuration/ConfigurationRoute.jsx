import React from "react";
import { Routes, Route } from "react-router-dom";
import Components from "./Global/Components.jsx";
import Users from "./Global/Users.jsx";
import AddUser from "./Global/AddUser.jsx";
import EditUser from "./Global/EditUser.jsx";
import Department from "./Global/Department.jsx";
import SubDepartment from "./Global/SubDepartment.jsx";
import Location from "./Global/Location.jsx";
import SubLocation from "./Global/SubLocation.jsx";
import ImportUser from "./Global/ImportUser.jsx";
import Organization from "./Global/Organization.jsx";
import Category from "./Incident/Category.jsx";
import SubCategory from "./Incident/SubCategory.jsx";
import AllVendors from "./Incident/AllVendors.jsx";
import NewVendor from "./Incident/NewVendor.jsx";
function ConfigurationRoute() {
  return (
    <>
      <Routes>
        {/* Global Routes */}
        <Route path="components" element={<Components />} />
        <Route path="Users" element={<Users />} />
        <Route path="AddUser" element={<AddUser />} />
        <Route path=":id" element={<EditUser />} />
        <Route path="department" element={<Department />} />
        <Route path="sub-department" element={<SubDepartment />} />
        <Route path="location" element={<Location />} />
        <Route path="sub-location" element={<SubLocation />} />
        <Route path="import-user" element={<ImportUser />} />
        <Route path="organization" element={<Organization />} />

        {/* Incident Routes */}
        <Route path="Category" element={<Category />} />
        <Route path="SubCategory" element={<SubCategory />} />
        <Route path="all-vendors" element={<AllVendors />} />
        <Route path="new-vendor" element={<NewVendor />} />
      </Routes>
    </>
  );
}

export default ConfigurationRoute;
