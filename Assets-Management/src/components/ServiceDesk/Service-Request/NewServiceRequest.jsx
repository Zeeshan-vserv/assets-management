import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Autocomplete, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllLocation } from "../../../api/LocationRequest";
import { getAllDepartment } from "../../../api/DepartmentRequest";
import { getAllAssets } from "../../../api/AssetsRequest";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../../api/IncidentCategoryRequest";
import { getAllUsers } from "../../../api/AuthRequest";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { createServiceRequest } from "../../../api/serviceRequest";
import { getAllServiceCategory, getAllServiceSubCategory } from "../../../api/globalServiceRequest";

function NewServiceRequest() {
  const user = useSelector((state) => state.authReducer.authData);
  const navigate = useNavigate();
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
  const [excludeSLA, setExcludeSLA] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    loggedVia: "",
    category: "",
    subCategory: "",
    requestDescription: "",
    catalogueDescription: "",
    purchaseRequest: false,
    cost: "",
    approval: false,
    approver1: "",
    approver2: "",
    approver3: "",
    submitter: {
      user: "",
      userContactNumber: "",
      userEmail: "",
      userDepartment: "",
      loggedBy: "",
    },
    asset: {
      asset: "",
      make: "",
      model: "",
      serialNo: "",
    },
    location: {
      location: "",
      subLocation: "",
    },
    classificaton: {
      excludeSLA: false,
      severityLevel: "Severity-3",
      priorityLevel: "Priority-3",
      supportDepartmentName: "",
      supportGroupName: "",
      technician: "",
    },
  });

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseLocation = await getAllLocation();
      setLocationData(responseLocation?.data?.data || []);

      const responseDepartment = await getAllDepartment();
      setDepartmentData(responseDepartment?.data?.data || []);

      const responseAsset = await getAllAssets();
      setAssetData(responseAsset?.data?.data || []);

      const responseCategory = await getAllServiceCategory();
      setCategory(responseCategory?.data?.data || []);

      const responseSubCategory = await getAllServiceSubCategory();
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

  // General handleChange for all fields (including nested)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createServiceRequest({
        ...formData,
        userId: user?.userId,
      });
      toast.success("Service Request Added Successfully");
      setFormData({
        title: "",
        loggedVia: "",
        category: "",
        subCategory: "",
        requestDescription: "",
        catalogueDescription: "",
        purchaseRequest: false,
        cost: "",
        approval: false,
        approver1: "",
        approver2: "",
        approver3: "",
        submitter: {
          user: "",
          userContactNumber: "",
          userEmail: "",
          userDepartment: "",
          loggedBy: "",
        },
        asset: {
          asset: "",
          make: "",
          model: "",
          serialNo: "",
        },
        location: {
          location: "",
          subLocation: "",
        },
        classificaton: {
          excludeSLA: false,
          severityLevel: "Severity-3",
          priorityLevel: "Priority-3",
          supportDepartmentName: "",
          supportGroupName: "",
          technician: "",
        },
      });
      navigate("/main/ServiceDesk/service-request");
    } catch (error) {
      toast.error("Failed to add Service Request");
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
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-slate-700 font-semibold">NEW REQUEST</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="flex gap-3 justify-end">
              <button
                type="submit"
                className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Submit
              </button>
              <button
                onClick={() => navigate("/main/ServiceDesk/service-request")}
                className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Cancel
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Logged Via<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["Call", "Walk-In", "Email"]}
                    value={formData.loggedVia || null}
                    onChange={(_, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        loggedVia: newValue || "",
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                  />
                </div>
              </div>
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Category<span className="text-red-500">*</span>
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
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Sub Category<span className="text-red-500">*</span>
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
              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Request Description
                </label>
                <textarea
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  name="requestDescription"
                  value={formData.requestDescription}
                  onChange={handleChange}
                  rows="6"
                />
              </div>
              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Catalogue Description
                </label>
                <textarea
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  name="catalogueDescription"
                  value={formData.catalogueDescription}
                  onChange={handleChange}
                  rows="6"
                />
              </div>

              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Purchase Required<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["Yes", "No"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center w-[46%]">
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Cost
                </label>
                <input
                  type="text"
                  id=""
                  name=""
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Approval Required<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["Yes", "No"]}
                    value={approvalRequired}
                    onChange={(e, newValue) => setApprovalRequired(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required 
                      />
                    )}
                  />
                </div>
              </div>
              {approvalRequired === "Yes" && (
                <>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approval Type<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[65%]">
                      <Autocomplete
                        options={["Hierarchical", "Custom"]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="standard"
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approver (Level 1)<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[65%]">
                      <Autocomplete
                        options={["", ""]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="standard"
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approver (Level 2)<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[65%]">
                      <Autocomplete
                        options={["", ""]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="standard"
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approver (Level 3)<span className="text-red-500">*</span>
                    </label>
                    <div className="w-[65%]">
                      <Autocomplete
                        options={["", ""]}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select"
                            variant="standard"
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <h2 className="text-slate-700 font-semibold">Submitter</h2>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  User Name<span className="text-red-500">*</span>
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
                        userContactNumber: newValue
                          ? newValue.mobileNumber
                          : "",
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
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  User Contact Number<span className="text-red-500">*</span>
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
            </div>
          </div>

          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <h2 className="text-slate-700 font-semibold">Asset</h2>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Asset<span className="text-red-500">*</span>
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
                        asset.assetInformation.assetTag === formData.asset.asset
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    // console.log(newValue);
                    setFormData({
                      ...formData,
                      asset: {
                        ...formData.asset,
                        asset: newValue
                          ? newValue.assetInformation.assetTag
                          : "",
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
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Serial No<span className="text-red-500">*</span>
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="serialNo"
                  name="asset.serialNo"
                  value={formData.asset.serialNo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      asset: {
                        ...formData.asset,
                        serialNo: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Make<span className="text-red-500">*</span>
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="make"
                  name="asset.make"
                  value={formData.asset.make}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      asset: {
                        ...formData.asset,
                        make: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Model<span className="text-red-500">*</span>
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="model"
                  name="asset.model"
                  value={formData.asset.model}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      asset: {
                        ...formData.asset,
                        model: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <h2 className="text-slate-700 font-semibold">Location</h2>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Location<span className="text-red-500">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={locationData}
                  getOptionLabel={(option) => option.locationName}
                  value={
                    locationData.find(
                      (loc) => loc.locationName === formData.location.location
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
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
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Sub Location<span className="text-red-500">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={filteredSubLocations}
                  getOptionLabel={(option) => option?.subLocationName || ""}
                  value={
                    filteredSubLocations.find(
                      (subLoc) =>
                        subLoc.subLocationName === formData.location.subLocation
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
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
            </div>
          </div>

          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <h2 className="text-slate-700 font-semibold">Classification</h2>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex justify-start items-center gap-10 w-[100%]">
                <label
                  htmlFor=""
                  className="text-xs font-semibold text-slate-600"
                >
                  Exclude From SLA
                </label>
                <input
                  className="text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="checkbox"
                  id=""
                  checked={excludeSLA}
                  onChange={(e) => setExcludeSLA(e.target.checked)}
                />
              </div>
              {excludeSLA && (
                <>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Severity Level<span className="text-red-500">*</span>
                    </label>
                    <select className="w-[65%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer">
                      <option value="">Select</option>
                      <option value="severity-1">Severity-1</option>
                      <option value="severity-2">Severity-2</option>
                      <option value="severity-3">Severity-3</option>
                      <option value="severity-4">Severity-4</option>
                    </select>
                  </div>
                </>
              )}
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Support Department<span className="text-red-500">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={supportDepartmentData}
                  getOptionLabel={(option) => option.supportDepartmentName}
                  value={
                    supportDepartmentData.find(
                      (dept) =>
                        dept.supportDepartmentName ===
                        formData.supportDepartmentName
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
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Support Group<span className="text-red-500">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={supportGroupData}
                  getOptionLabel={(option) => option.supportGroupName}
                  value={
                    supportGroupData.find(
                      (group) =>
                        group.supportGroupName === formData.supportGroups
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
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Technicians<span className="text-red-500">*</span>
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
    </>
  );
}

export default NewServiceRequest;
