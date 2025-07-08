import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import { getUserById } from "../../../../Assets-Management/src/api/AuthRequest";
import {
  getAllCategory,
  getAllSubCategory,
} from "../../api/IncidentCategoryRequest";
import { getAllAssets } from "../../api/AssetsRequest";
import { createIncident } from "../../api/IncidentRequest";
import { toast } from "react-toastify";
import { getAllUsers } from "../../api/UserAuth";

function NewIncidents() {
  const user = useSelector((state) => state.authReducer.authData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectUser, setSelectUser] = useState(false);
  const [category, setCategory] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [subCategory, setSubCategory] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    subCategory: "",
    loggedVia: "",
    description: "",
    attachment: "",
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

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseAsset = await getAllAssets();
      setAssetData(responseAsset?.data?.data || []);

      const responseCategory = await getAllCategory();
      setCategory(responseCategory?.data?.data || []);

      const responseSubCategory = await getAllSubCategory();
      setSubCategory(responseSubCategory?.data?.data || []);

         const responseReportingManager = await getAllUsers();
            setUsers(responseReportingManager?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(user.userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }

      setUserData(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // console.log(userData._id);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If not raising for another user, fill submitter and locationDetails from logged-in user
      let submitterData = { ...formData.submitter };
      let locationDetailsData = { ...formData.locationDetails };
      let classificaton = { ...formData.classificaton };

      if (!selectUser && userData) {
        submitterData = {
          user: userData.employeeName || "",
          userId: userData._id || "",
          userContactNumber: userData.mobileNumber || "",
          userEmail: userData.emailAddress || "",
          userDepartment: userData.department || "",
          loggedBy: userData.employeeName || "",
          loggedInTime: new Date().toISOString(),
        };
        locationDetailsData = {
          location: userData.location || "",
          subLocation: userData.subLocation || "",
          floor: userData.floor || "",
          roomNo: userData.roomNo || "",
        };
      }

      if (userData.userRole === "Employee") {
        classificaton = {
          excludeSLA: false,
          severityLevel: "Severity-1",
          priorityLevel: "Priority-1",
          supportDepartmentName: "",
          supportGroupName: "",
          technician: "",
        };
      }
      const form = new FormData();


      // Append all fields to form data
      form.append("userId", user?.userId);
      form.append("subject", formData.subject);
      form.append("category", formData.category);
      form.append("subCategory", formData.subCategory);
      form.append("loggedVia", formData.loggedVia);
      form.append("description", formData.description);
      // form.append("status", formData.status);
      form.append("sla", formData.sla);
      form.append("tat", formData.tat);
      form.append("feedback", formData.feedback);

      // Nested objects must be stringified
      form.append("submitter", JSON.stringify(submitterData));
      form.append("assetDetails", JSON.stringify(formData.assetDetails));
      form.append("locationDetails", JSON.stringify(locationDetailsData));
      form.append("classificaton", JSON.stringify(classificaton));

      // Attachment (file)
      if (formData.attachment) {
        form.append("attachment", formData.attachment);
      }
      await createIncident(form);

      toast.success("Incident Added Successfully");
      setFormData({
        userId: "",
        incidentId: "",
        subject: "",
        category: "",
        subCategory: "",
        loggedVia: "",
        description: "",
        status: "",
        sla: "",
        tat: "",
        feedback: "",
        attachment: "",
        submitter: {
          user: "",
          userContactNumber: "",
          userEmail: "",
          userDepartment: "",
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to add Incident");
    }
  };

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-1 justify-center items-center">
                <input
                  type="checkbox"
                  checked={selectUser}
                  onChange={(e) => setSelectUser(e.target.checked)}
                  className="w-4 text-xs text-slate-600 border-2 border-slate-300 px-2 py-1"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Raise Incident for Other User
                </span>
              </div>
              <div className="my-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white cursor-pointer"
                >
                  Submit
                </button>
                <NavLink
                  to="/incidents"
                  className={({ isActive }) =>
                    `hover:underline cursor-pointer ${
                      isActive ? "text-blue-400" : ""
                    }`
                  }
                >
                  <button className="bg-[#df656b] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white cursor-pointer">
                    Cancel
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
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
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
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
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label
                  htmlFor="subCategory"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Sub Category
                </label>
                {/* {console.log(formData)} */}
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

              <div className="flex items-center w-[46%] max-lg:w-[100%]">
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

              <div className="flex items-center w-[46%] max-lg:w-full">
                <label
                  htmlFor="attachment"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Attachment
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleChange}
                  // required
                  className="file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700
               hover:file:bg-blue-100
               transition-all duration-200
               w-[65%] text-sm text-slate-600 border border-slate-300 rounded-md p-1.5
               focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              {selectUser && (
                <>
                  <div className="flex items-center w-[46%] max-lg:w-[100%]">
                    <label
                      htmlFor=""
                      className="w-[25%] text-xs font-semibold text-slate-600"
                    >
                      User<span className="text-red-500 text-base">*</span>
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
                          (user) =>
                            user.employeeName === formData.submitter.user
                        ) || null
                      }
                      onChange={(event, newValue) => {                                                
                        setFormData({
                          ...formData,
                          submitter: {
                            ...formData.submitter,
                            user: newValue ? newValue.employeeName : "",
                            userId: newValue ? newValue._id : "",
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
                          className="text-xs text-slate-600"
                          placeholder="Select User"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                    {/* {console.log(formData.submitter)} */}
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label
                  htmlFor="description"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Description
                </label>
                <textarea
                  className="w-[96.8%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
        </form>
      </div>
    </>
  );
}

export default NewIncidents;
