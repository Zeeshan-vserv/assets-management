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
import { createIncident } from "../../../api/IncidentRequest";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../../api/IncidentCategoryRequest";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { NavLink } from "react-router-dom";

const NewIncident = () => {
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
  const [technician, setTechnician] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    subCategory: "",
    loggedVia: "",
    description: "",
    submitter: {
      user: "",
      userId: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseLocation = await getAllLocation();
      setLocationData(responseLocation?.data?.data || []);

      const responseDepartment = await getAllDepartment();
      setDepartmentData(responseDepartment?.data?.data || []);

      const responseAsset = await getAllAssets();
      setAssetData(responseAsset?.data?.data || []);

      const responseCategory = await getAllCategory();
      setCategory(responseCategory?.data?.data || []);

      const responseSubCategory = await getAllSubCategory();
      setSubCategory(responseSubCategory?.data?.data || []);

      const responseReportingManager = await getAllUsers();
      setUsers(responseReportingManager?.data || []);

      const responseSupportDepartment = await getAllSupportDepartment();
      setSupportDepartmentData(responseSupportDepartment?.data?.data || []);

      const responseSupportGroup = await getAllSupportGroup();
      setSupportGroupData(responseSupportGroup?.data?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    if (formData.locationDetails.location) {
      const selectedLoc = locationData.find(
        (loc) => loc.locationName === formData.locationDetails.location
      );
      setFilteredSubLocations(selectedLoc?.subLocations || []);
    }
  }, [locationData, formData.locationDetails.location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createIncident({
        ...formData,
        userId: user?.userId,
        classificaton: {
          ...formData.classificaton,
          excludeSLA: formData.classificaton.excludeSLA || false,
        },
      });
      toast.success("Incident Added Successfully");
      setFormData({
        subject: "",
        category: "",
        subCategory: "",
        loggedVia: "",
        description: "",
        submitter: {
          user: "",
          userId: "",
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
          excludeSLA: "",
          severityLevel: "",
          supportDepartmentName: "",
          supportGroupName: "",
          technician: "",
        },
      });
    } catch (error) {
      toast.error("Failed to add Incident");
    }
  };

  const technicianOptions = users.filter(
    (u) =>
      u.userRole === "GoCollect Support Department" ||
      u.userRole === "Grievance Support Team" ||
      u.userRole === "L1 Technician" ||
      u.userRole === "L2 Technician" ||
      u.userRole === "L3 Technician" ||
      u.userRole === "Application Support Team"
  );

  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">ADD INCIDENT</h2>
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
            >
              Submit
            </button>
            <NavLink to="/main/ServiceDesk/IndicentData">
              <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
                Cancel
              </button>
            </NavLink>
          </div>

          <div className="flex flex-wrap gap-6 justify-between mt-3">
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
                getOptionLabel={(option) => option.categoryName}
                value={
                  category.find(
                    (cat) => cat.categoryName === formData.category
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    category: newValue ? newValue.categoryName : "",
                  }));
                }}
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
                getOptionLabel={(option) => option.subCategoryName}
                value={
                  subCategory.find(
                    (sub) => sub.subCategoryName === formData.subCategory
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: newValue ? newValue.subCategoryName : "",
                  }));
                }}
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
            <div className="flex flex-wrap gap-3 items-center w-[100%]">
              <label
                htmlFor="description"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Description
              </label>
              <textarea
                className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
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
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      user: newValue ? newValue.employeeName : "",
                      userContactNumber: newValue ? newValue.mobileNumber : "",
                      userEmail: newValue ? newValue.emailAddress : "",
                      userDepartment: newValue ? newValue.department : "",
                    },
                  });
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
                name="userContactNumber"
                value={formData.submitter.userContactNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      userContactNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
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
                name="userEmail"
                value={formData.submitter.userEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      userEmail: e.target.value,
                    },
                  })
                }
              />
            </div>
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
                getOptionLabel={(option) => option.departmentName}
                value={
                  departmentData.find(
                    (dep) =>
                      dep.departmentName === formData.submitter.userDepartment
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      userDepartment: newValue ? newValue.departmentName : "",
                    },
                  });
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
              {/* <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="userDepartment"
                name="userDepartment"
                value={formData.submitter.userDepartment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      userDepartment: e.target.value,
                    },
                  })
                }
              /> */}
            </div>
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
                onChange={(event, newValue) => {
                  // console.log(newValue);
                  setFormData({
                    ...formData,
                    assetDetails: {
                      ...formData.assetDetails,
                      asset: newValue ? newValue.assetInformation.assetTag : "",
                      make: newValue ? newValue.assetInformation.make : "",
                      model: newValue ? newValue.assetInformation.model : "",
                      serialNo: newValue
                        ? newValue.assetInformation.serialNumber
                        : "",
                    },
                  });
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetDetails: {
                      ...formData.assetDetails,
                      make: e.target.value,
                    },
                  })
                }
              />
            </div>
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetDetails: {
                      ...formData.assetDetails,
                      model: e.target.value,
                    },
                  })
                }
              />
            </div>
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetDetails: {
                      ...formData.assetDetails,
                      serialNo: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold">Location</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
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
                getOptionLabel={(option) => option.locationName}
                value={
                  locationData.find(
                    (loc) =>
                      loc.locationName === formData.locationDetails.location
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    locationDetails: {
                      ...formData.locationDetails,
                      location: newValue ? newValue.locationName : "",
                      subLocation: "", // Reset subLocation when location changes
                    },
                  });
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
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    locationDetails: {
                      ...formData.locationDetails,
                      subLocation: newValue ? newValue.subLocationName : "",
                    },
                  });
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    classificaton: {
                      ...prev.classificaton,
                      excludeSLA: e.target.checked,
                    },
                  }))
                }
              />
            </div>
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
                  id="loggedVia"
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
                getOptionLabel={(option) => option.supportDepartmentName}
                value={
                  supportDepartmentData.find(
                    (dept) =>
                      dept.supportDepartmentName ===
                      formData.classificaton.supportDepartmentName
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    classificaton: {
                      ...formData.classificaton,
                      supportDepartmentName: newValue
                        ? newValue.supportDepartmentName
                        : "",
                    },
                  });
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
                getOptionLabel={(option) => option.supportGroupName}
                value={
                  supportGroupData.find(
                    (group) => group.supportGroupName === formData.classificaton.supportGroupName
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    classificaton: {
                      ...formData.classificaton,
                      supportGroupName: newValue
                        ? newValue.supportGroupName
                        : "",
                    },
                  });
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
            {/* <div className="flex items-center w-[46%]">
              <label
                htmlFor="technician"
                className="w-[28%] text-xs font-semibold text-slate-600"
              >
                Technician
              </label>
              <input
                className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="technician"
                name="classificaton.technician"
                value={formData.classificaton.technician}
                onChange={handleChange}
              />
            </div> */}
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
                onChange={(event, newValue) => {
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

export default NewIncident;
