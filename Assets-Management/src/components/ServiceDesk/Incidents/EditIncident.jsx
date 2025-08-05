import React, { useEffect, useState } from "react";
import {
  getAllLocation,
  getAllSubLocation,
} from "../../../api/LocationRequest";
import {
  getAllDepartment,
  getAllSubDepartment,
} from "../../../api/DepartmentRequest";
import { getAllUsers } from "../../../api/AuthRequest";
import { Autocomplete, TextField } from "@mui/material";
import { getAllAssets } from "../../../api/AssetsRequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getIncidentById, updateIncident } from "../../../api/IncidentRequest";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../../api/IncidentCategoryRequest";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { NavLink, useParams } from "react-router-dom";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const EditIncident = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.authReducer.authData);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredSubLocations, setFilteredSubLocations] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [supportDepartmentData, setSupportDepartmentData] = useState([]);
  const [supportGroupData, setSupportGroupData] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    subCategory: "",
    loggedVia: "",
    description: "",
    submitter: {
      user: "",
      userContactNumber: "",
      userEmail: "",
      userDepartment: "",
      loggedBy: "",
    },
    assetDetails: {
      asset: "",
      make: "",
      model: "",
      serialNo: "",
    },
    locationDetails: {
      location: "",
      subLocation: "",
      floor: "",
      roomNo: "",
    },
    classificaton: {
      excludeSLA: false,
      severityLevel: "",
      supportDepartmentName: "",
      supportGroupName: "",
      technician: "",
    },
  });
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all dropdown data
  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const [
        responseLocation,
        responseDepartment,
        responseAsset,
        responseCategory,
        responseSubCategory,
        responseUsers,
        responseSupportDepartment,
        responseSupportGroup,
      ] = await Promise.all([
        getAllLocation(),
        getAllDepartment(),
        getAllAssets(),
        getAllCategory(),
        getAllSubCategory(),
        getAllUsers(),
        getAllSupportDepartment(),
        getAllSupportGroup(),
      ]);
      setLocationData(responseLocation?.data?.data || []);
      setDepartmentData(responseDepartment?.data?.data || []);
      setAssetData(responseAsset?.data?.data || []);
      setCategory(responseCategory?.data?.data || []);
      setSubCategory(responseSubCategory?.data?.data || []);
      setUsers(responseUsers?.data || []);
      setSupportDepartmentData(responseSupportDepartment?.data?.data || []);
      setSupportGroupData(responseSupportGroup?.data?.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch incident data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getIncidentById(id);
      if (response?.data?.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching incident:", error);
      toast.error("Failed to load incident data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (formData.locationDetails.location) {
      const selectedLoc = locationData.find(
        (loc) => loc.locationName === formData.locationDetails.location
      );
      setFilteredSubLocations(selectedLoc?.subLocations || []);
    }
  }, [locationData, formData.locationDetails.location]);

  // Unified handleChange for nested fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };
  // console.log("id", id);
  // console.log("Form Data:", formData?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateIncident(id, {
        ...formData,
        userId: user?.userId,
      });
      //   await console.log(id, {
      //     ...formData,
      //     userId: user?.userId,
      //   });
      toast.success("Incident updated successfully");
      setShowConfirm(false);
    } catch (error) {
      toast.error("Failed to update Incident");
    }
  };

  const technicianOptions = users.filter((u) =>
    [
      "GoCollect Support Department",
      "Grievance Support Team",
      "L1 Technician",
      "L2 Technician",
      "L3 Technician",
      "Application Support Team",
    ].includes(u.userRole)
  );

  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">EDIT INCIDENT</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Incident Details */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-2 justify-end">
            <button
              // type="submit"
              type="button"
              onClick={() => setShowConfirm(true)}
              className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              disabled={isLoading}
            >
              Submit
            </button>
            <NavLink to="/main/ServiceDesk/IndicentData">
              <button
                type="button"
                className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Cancel
              </button>
            </NavLink>
            <ConfirmUpdateModal
              isOpen={showConfirm}
              message="Are you sure you want to update Incident?"
              onConfirm={handleSubmit}
              onCancel={() => setShowConfirm(false)}
            />
          </div>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* Subject */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subject"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Subject
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            {/* Category */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="category"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Category
              </label>
              <Autocomplete
                className="w-[65%]"
                options={category}
                getOptionLabel={(option) => option.categoryName || ""}
                value={
                  category.find(
                    (cat) => cat.categoryName === formData.category
                  ) || null
                }
                onChange={(_, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: newValue ? newValue.categoryName : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Category"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Sub Category */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subCategory"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Sub Category
              </label>
              <Autocomplete
                className="w-[65%]"
                options={subCategory}
                getOptionLabel={(option) => option.subCategoryName || ""}
                value={
                  subCategory.find(
                    (sub) => sub.subCategoryName === formData.subCategory
                  ) || null
                }
                onChange={(_, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: newValue ? newValue.subCategoryName : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select SubCategory"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Logged Via */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="loggedVia"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Logged Via
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="loggedVia"
                id="loggedVia"
                value={formData.loggedVia}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Call">Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Email">Email</option>
              </select>
            </div>
            {/* Description */}
            <div className="flex flex-wrap gap-3 items-center w-[100%]">
              <label
                htmlFor="description"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Description
              </label>
              <textarea
                className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submitter */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold">Submitter</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* User */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="user"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                User
              </label>
              <Autocomplete
                className="w-[65%]"
                options={users}
                getOptionLabel={(option) =>
                  option.employeeName && option.emailAddress
                    ? `${option.employeeName} - ${option.emailAddress}`
                    : option.emailAddress || ""
                }
                value={
                  users.find(
                    (user) => user.employeeName === formData.submitter.user
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    submitter: {
                      ...prev.submitter,
                      user: newValue ? newValue.employeeName : "",
                      userContactNumber: newValue ? newValue.mobileNumber : "",
                      userEmail: newValue ? newValue.emailAddress : "",
                      userDepartment: newValue ? newValue.department : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-sm text-slate-800"
                    placeholder="Select Users"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* User Contact Number */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="userContactNumber"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                User Contact Number
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="userContactNumber"
                name="submitter.userContactNumber"
                value={formData.submitter.userContactNumber}
                onChange={handleChange}
              />
            </div>
            {/* User Email */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="userEmail"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                User Email
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="email"
                id="userEmail"
                name="submitter.userEmail"
                value={formData.submitter.userEmail}
                onChange={handleChange}
              />
            </div>
            {/* User Department */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="userDepartment"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                User Department
              </label>
              <Autocomplete
                className="w-[65%]"
                options={departmentData}
                getOptionLabel={(option) => option.departmentName || ""}
                value={
                  departmentData.find(
                    (dep) =>
                      dep.departmentName === formData.submitter.userDepartment
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    submitter: {
                      ...prev.submitter,
                      userDepartment: newValue ? newValue.departmentName : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Department"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Logged By */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="loggedBy"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Logged By
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="loggedBy"
                name="submitter.loggedBy"
                value={formData.submitter.loggedBy}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Asset Details */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold">Asset Details</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* Asset */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="asset"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Asset
              </label>
              <Autocomplete
                className="w-[65%]"
                options={assetData}
                getOptionLabel={(asset) =>
                  asset.assetInformation.assetTag &&
                  asset.assetInformation.serialNumber
                    ? `${asset.assetInformation.assetTag} - ${asset.assetInformation.serialNumber}`
                    : asset.assetInformation.serialNumber || ""
                }
                value={
                  assetData.find(
                    (asset) =>
                      asset.assetInformation.assetTag ===
                      formData.assetDetails.asset
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    assetDetails: {
                      ...prev.assetDetails,
                      asset: newValue ? newValue.assetInformation.assetTag : "",
                      make: newValue ? newValue.assetInformation.make : "",
                      model: newValue ? newValue.assetInformation.model : "",
                      serialNo: newValue
                        ? newValue.assetInformation.serialNumber
                        : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-sm text-slate-800"
                    placeholder="Select Assets"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Make */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="make"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Make
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="make"
                name="assetDetails.make"
                value={formData.assetDetails.make}
                onChange={handleChange}
              />
            </div>
            {/* Model */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="model"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Model
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="model"
                name="assetDetails.model"
                value={formData.assetDetails.model}
                onChange={handleChange}
              />
            </div>
            {/* Serial No. */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="serialNo"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Serial No.
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="serialNo"
                name="assetDetails.serialNo"
                value={formData.assetDetails.serialNo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold">Location</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* Location */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="location"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Location
              </label>
              <Autocomplete
                className="w-[65%]"
                options={locationData}
                getOptionLabel={(option) => option.locationName || ""}
                value={
                  locationData.find(
                    (loc) =>
                      loc.locationName === formData.locationDetails.location
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    locationDetails: {
                      ...prev.locationDetails,
                      location: newValue ? newValue.locationName : "",
                      subLocation: "",
                    },
                  }));
                  setFilteredSubLocations(newValue?.subLocations || []);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Location"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Sub Location */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subLocation"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Sub Location
              </label>
              <Autocomplete
                className="w-[65%]"
                options={filteredSubLocations}
                getOptionLabel={(option) => option?.subLocationName || ""}
                value={
                  filteredSubLocations.find(
                    (subLoc) =>
                      subLoc.subLocationName ===
                      formData.locationDetails.subLocation
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    locationDetails: {
                      ...prev.locationDetails,
                      subLocation: newValue ? newValue.subLocationName : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Sub Location"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Floor */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="floor"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Floor
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="floor"
                name="locationDetails.floor"
                value={formData.locationDetails.floor}
                onChange={handleChange}
              />
            </div>
            {/* Room No */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="roomNo"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Room No
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="roomNo"
                name="locationDetails.roomNo"
                value={formData.locationDetails.roomNo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold mb-10">Classification</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* Exclude From SLA */}
            <div className="flex justify-start items-center gap-10 w-[100%]">
              <label
                htmlFor="excludeSLA"
                className="text-xs font-semibold text-slate-600"
              >
                Exclude From SLA
              </label>
              <input
                className="text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="checkbox"
                id="excludeSLA"
                name="classificaton.excludeSLA"
                checked={formData.classificaton.excludeSLA}
                onChange={handleChange}
              />
            </div>
            {/* Severity Level */}
            {!formData.classificaton.excludeSLA && (
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor="severityLevel"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Severity Level
                </label>
                <select
                  className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  name="classificaton.severityLevel"
                  id="severityLevel"
                  value={formData.classificaton.severityLevel}
                  onChange={handleChange}
                >
                  <option value="">Select Priority</option>
                  <option value="Severity-1">Severity-1</option>
                  <option value="Severity-2">Severity-2</option>
                  <option value="Severity-3">Severity-3</option>
                  <option value="Severity-4">Severity-4</option>
                </select>
              </div>
            )}
            {/* Support Department Name */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="supportDepartmentName"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Support Department Name
              </label>
              <Autocomplete
                className="w-[65%]"
                options={supportDepartmentData}
                getOptionLabel={(option) => option.supportDepartmentName || ""}
                value={
                  supportDepartmentData.find(
                    (dept) =>
                      dept.supportDepartmentName ===
                      formData.classificaton.supportDepartmentName
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    classificaton: {
                      ...prev.classificaton,
                      supportDepartmentName: newValue
                        ? newValue.supportDepartmentName
                        : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Support Department"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Support Group Name */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="supportGroupName"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Support Group Name
              </label>
              <Autocomplete
                className="w-[65%]"
                options={supportGroupData}
                getOptionLabel={(option) => option.supportGroupName || ""}
                value={
                  supportGroupData.find(
                    (group) =>
                      group.supportGroupName ===
                      formData.classificaton.supportGroupName
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    classificaton: {
                      ...prev.classificaton,
                      supportGroupName: newValue
                        ? newValue.supportGroupName
                        : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Support Group"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {/* Technician */}
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="technician"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Technician
              </label>
              <Autocomplete
                className="w-[65%]"
                options={technicianOptions}
                getOptionLabel={(option) =>
                  option.employeeName && option.emailAddress
                    ? `${option.employeeName} - ${option.emailAddress}`
                    : option.employeeName || ""
                }
                value={
                  technicianOptions.find(
                    (user) =>
                      user.employeeName === formData.classificaton.technician
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    classificaton: {
                      ...prev.classificaton,
                      technician: newValue ? newValue.employeeName : "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Technician"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditIncident;
