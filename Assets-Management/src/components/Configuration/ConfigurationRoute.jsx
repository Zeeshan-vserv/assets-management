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
import SoftwareCategory from "./Assets/SoftwareCategory.jsx";
import SoftwareName from "./Assets/SoftwareName.jsx";
import Publisher from "./Assets/Publisher.jsx";
import StoreLocation from "./Assets/StoreLocation.jsx";
import Condition from "./Assets/Condition.jsx";
import ConsumableCategory from "./Assets/ConsumableCategory.jsx";
import ConsumableSubCategory from "./Assets/ConsumableSubCategory.jsx";
import AssetTag from "./Assets/AssetTag.jsx";
import VendorCategory from "./Vendor/VendorCategory.jsx";
import Status from "./Vendor/Status.jsx";
import ServiceCategory from "./Vendor/ServiceCategory.jsx";
import GatePassAddress from "./GatePass/GatePassAddress.jsx";
import SupportDepartment from "./Global/SupportDepartment.jsx";
import SupportGroup from "./Global/SupportGroup.jsx";
import CloserCode from "./Incident/CloserCode.jsx";
import PredefinedReplies from "./Incident/PredefinedReplies.jsx";
import PendingReason from "./Incident/PendingReason.jsx";
import IncidentRules from "./Incident/IncidentRules.jsx";
import IncidentAutoCloserTime from "./Incident/IncidentAutoCloserTime.jsx";
import AddRule from "./Incident/AddRule.jsx";
import EditRule from "./Incident/EditRule.jsx";
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
        <Route path="supportDepartment" element={<SupportDepartment />} />
        <Route path="supportGroup" element={<SupportGroup />} />
        {/* Incident Routes */}
        <Route path="AutoCloseTime" element={<IncidentAutoCloserTime />} />
        <Route path="Category" element={<Category />} />
        <Route path="SubCategory" element={<SubCategory />} />
        <Route path="CloserCode" element={<CloserCode />} />
        <Route path="PredefinedReplies" element={<PredefinedReplies />} />
        <Route path="PendingReason" element={<PendingReason />} />
        <Route path="IncidentRules" element={<IncidentRules />} />
        <Route path="AddRule" element={<AddRule />} />
        <Route path="EditRule/:id" element={<EditRule />} />

        {/* GatePass Routes */}
        <Route path="GatePassAddress" element={<GatePassAddress />} />

        {/* Assets Routes */}
        <Route path="software-category" element={<SoftwareCategory />} />
        <Route path="software-name" element={<SoftwareName />} />
        <Route path="publisher" element={<Publisher />} />
        <Route path="store-location" element={<StoreLocation />} />
        <Route path="condition" element={<Condition />} />
        <Route path="consumable-category" element={<ConsumableCategory />} />
        <Route
          path="consumable-sub-category"
          element={<ConsumableSubCategory />}
        />
        <Route path="asset-tag" element={<AssetTag />} />

        {/* Vendor Routes */}
        <Route path="vendor-category" element={<VendorCategory />} />
        <Route path="status" element={<Status />} />
        <Route path="service-category" element={<ServiceCategory />} />
      </Routes>
    </>
  );
}

export default ConfigurationRoute;
