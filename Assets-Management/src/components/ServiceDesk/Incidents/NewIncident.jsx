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

const NewIncident = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState([]);
  const [subLocationData, setSubLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
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

  console.log(formData);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseLocation = await getAllLocation();
      setLocationData(responseLocation?.data?.data || []);

      const responseSubLocation = await getAllSubLocation();
      setSubLocationData(responseSubLocation?.data?.data || []);

      const responseDepartment = await getAllDepartment();
      setDepartmentData(responseDepartment?.data?.data || []);

      const responseSubDepartment = await getAllSubDepartment();
      setSubDepartmentData(responseSubDepartment?.data?.data || []);

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

  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">ADD INCIDENT</h2>
      <form action="" className="flex flex-col gap-8">
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-1 justify-end">
            <button
              type="submit"
              className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
            >
              Submit
            </button>
            <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Cancel
            </button>
          </div>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subject"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Subject
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Category
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subCategory"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Category
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="subCategory"
                id="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="businessUnit"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Logged Via
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="businessUnit"
                id="businessUnit"
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
                className="w-[25%] text-xs font-semibold text-slate-600"
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
                className="w-[25%] text-xs font-semibold text-slate-600"
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
                    (user) => user.emailAddress === formData.submitter.user
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    submitter: {
                      ...formData.submitter,
                      user: newValue ? newValue.employeeName : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
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
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                User Contact Number
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="userContactNumber"
                name="userContactNumber"
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="userEmail"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                User Email
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="email"
                id="userEmail"
                name="userEmail"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                User Department
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex flex-wrap gap-3 items-center w-[100%]">
              <label
                htmlFor="employeeAddress"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Description
              </label>
              <textarea
                className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeAddress"
                name="employeeAddress"
                rows="6"
                //value={formData.emailAddress}
                //onChange={handleChange}
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
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Make
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Model
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Serial No.
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
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
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Location
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Location
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Floor
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Room No
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h2 className="text-slate-700 font-semibold mb-10">Classification</h2>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center gap-10 w-[100%]">
              <label
                htmlFor="employeeCode"
                className="text-xs font-semibold text-slate-600"
              >
                Exclude From SLA
              </label>
              <input
                className="text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="checkbox"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Severity Level
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Support Department Name
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Support Group Name
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Technician
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                //value={formData.employeeCode}
                //onChange={handleSubmit}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewIncident;
