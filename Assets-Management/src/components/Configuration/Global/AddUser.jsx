import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../Table.css";
import { getAllUsers, signup } from "../../../api/AuthRequest";
import { toast } from "react-toastify";
import {
  getAllLocation,
  getAllSubLocation,
} from "../../../api/LocationRequest";
import {
  getAllDepartment,
  getAllSubDepartment,
} from "../../../api/DepartmentRequest";
import { Autocomplete, TextField } from "@mui/material";

const AddUser = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeCode: "",
    emailAddress: "",
    mobileNumber: "",
    designation: "",
    location: "",
    subLocation: "",
    department: "",
    subDepartment: "",
    reportingManager: "",
    departmentHead: "",
    businessHead: "",
    password: "",
    confirmPassword: "",
    users: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    components: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    departments: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    subDepartments: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    locations: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    subLocations: {
      isView: false,
      isEdit: false,
      isDelete: false,
    },
    assets: {
      isView: false,
    },
    tickets: {
      isView: false,
    },
    showUsers: {
      isView: false,
    },
    summary: {
      isView: false,
    },
    importAsset: {
      isView: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState([]);
  const [subLocationData, setSubLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [reportingManagerData, setReportingManagerData] = useState([]);

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
      setReportingManagerData(responseReportingManager?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(formData);
      toast.success("User created successfully");
      setFormData({
        employeeName: "",
        employeeCode: "",
        emailAddress: "",
        mobileNumber: "",
        designation: "",
        location: "",
        subLocation: "",
        department: "",
        subDepartment: "",
        reportingManager: "",
        departmentHead: "",
        businessHead: "",
        password: "",
        confirmPassword: "",
        users: { isView: false, isEdit: false, isDelete: false },
        components: { isView: false, isEdit: false, isDelete: false },
        departments: { isView: false, isEdit: false, isDelete: false },
        subDepartments: { isView: false, isEdit: false, isDelete: false },
        locations: { isView: false, isEdit: false, isDelete: false },
        subLocations: { isView: false, isEdit: false, isDelete: false },
        assets: { isView: false },
        tickets: { isView: false },
        showUsers: { isView: false },
        summary: { isView: false },
        importAsset: { isView: false },
      });
    } catch (error) {
      toast.error("Failed to create user");
    }
  };
  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <h2 className="text-slate-700 font-semibold">ADD USER</h2>
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeName"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Employee Name <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Employee Code <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeCode"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="emailAddress"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Email Address <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="mobileNumber"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Mobile Number <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="designation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Designation <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="location"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Location <span className="text-red-500 text-base">*</span>
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location</option>
                {locationData?.map((locationValue) => (
                  <option
                    key={locationValue?._id}
                    value={locationValue?.locationName}
                  >
                    {locationValue?.locationName?.toUpperCase()}
                  </option>
                ))}
                {/* <option value="agra">AGRA</option>
                <option value="ahmedabad">AHMEDABAD</option>
                <option value="banglore">BANGLORE</option>
                <option value="bokaro">BOKARO</option>
                <option value="bokaburnpurro">BURNPUR</option>
                <option value="chandigarh">CHANDIGARH</option>
                <option value="chattisgarh">CHATTISGARH</option>
                <option value="chennai">CHENNAI</option>
                <option value="coimbatore">COIMBATORE</option>
                <option value="dankuni">DANKUNI</option>
                <option value="delhi">DELHI</option>
                <option value="durgapur">DURGAPUR</option>
                <option value="faridabad">FARIDABAD</option>
                <option value="ghaziabad">GHAZIABAD</option>
                <option value="gujarat">GUJARAT</option>
                <option value="guwahati">GUWAHATI</option>
                <option value="haldia">HALDIA</option>
                <option value="hyderabad">HYDERABAD</option>
                <option value="jagdishpur">JAGDISHPUR</option>
                <option value="jalandhar">JALANDHAR</option>
                <option value="jammu">JAMMU</option>
                <option value="kandrori">KANDRORI</option>
                <option value="kanpur">KANPUR</option>
                <option value="kochi">KOCHI</option>
                <option value="kolkata">KOLKATA</option>
                <option value="lucknow">LUCKNOW</option>
                <option value="ludhiana">LUDHIANA</option>
                <option value="madhya pradesh">MADHYA PRADESH</option>
                <option value="maharashtra">MAHARASHTRA</option>
                <option value="manali">MANALI</option>
                <option value="mandigobindgarh">MANDIGOBINDGARH</option>
                <option value="N/A">N/A</option>
                <option value="paradeep">PARADEEP</option>
                <option value="patna">PATNA</option>
                <option value="prayagraj">PRAYAGRAJ</option>
                <option value="rajasthan">RAJASTHAN</option>
                <option value="rishikesh">RISHIKESH</option>
                <option value="roorkela">ROORKELA</option>
                <option value="salem">SALEM</option>
                <option value="siliguri">SILIGURI</option>
                <option value="srinagar">SRINAGAR</option>
                <option value="trichy">TRICHY</option>
                <option value="vizag">VIZAG</option> */}
              </select>
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subLocation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Location
              </label>
              <select
                name="subLocation"
                id="subLocation"
                value={formData.subLocation}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
              >
                <option value="">Select Sub Location</option>
                {subLocationData?.map((subLocationValue) => (
                  <option
                    key={subLocationValue?._id}
                    value={subLocationValue?.subLocationName}
                  >
                    {subLocationValue?.subLocationName?.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="subLocation"
                name="subLocation"
                value={formData.subLocation}
                onChange={handleChange}
              /> */}
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="department"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Department <span className="text-red-500 text-base">*</span>
              </label>
              <select
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
              >
                <option value="">Select Department</option>
                {departmentData?.map((departmentValue) => (
                  <option
                    key={departmentValue?._id}
                    value={departmentValue?.departmentName}
                  >
                    {departmentValue?.departmentName?.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              /> */}
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="subDepartment"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Department
              </label>
              <select
                name="subDepartment"
                id="subDepartment"
                value={formData.subDepartment}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
              >
                <option value="">Select Sub Department</option>
                {subDepartmentData?.map((subDepartmentValue) => (
                  <option
                    key={subDepartmentValue?._id}
                    value={subDepartmentValue?.subdepartmentName}
                  >
                    {subDepartmentValue?.subdepartmentName?.toUpperCase()}
                  </option>
                ))}
              </select>
              {/* <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="subDepartment"
                name="subDepartment"
                value={formData.subDepartment}
                onChange={handleChange}
              /> */}
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="reportingManager"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Reporting Manager{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <Autocomplete
                className="w-[65%]"
                options={reportingManagerData}
                getOptionLabel={(option) => option.emailAddress}
                value={
                  reportingManagerData.find(
                    (user) => user.emailAddress === formData.reportingManager
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    reportingManager: newValue ? newValue.emailAddress : "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Reporting Manager"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
              {/* <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="reportingManager"
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
                required
              /> */}
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="departmentHead"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Department Head
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="departmentHead"
                name="departmentHead"
                value={formData.departmentHead}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="businessHead"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Business Head
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="businessHead"
                name="businessHead"
                value={formData.businessHead}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="password"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Password <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="confirmPassword"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Confirm Password{" "}
                <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <h2 className="text-slate-700 font-semibold">USER ROLE PERMISSIONS</h2>
        <div className="w-full flex gap-5 max-lg:flex-col">
          <div className="w-1/2 p-4 bg-white rounded-md shadow-md max-lg:w-full">
            <table>
              <h2 className="text-slate-700 font-semibold mb-3">
                Page View Permissions
              </h2>
              <tr>
                <th className="w-[85%]">Page Name</th>
                <th>View</th>
              </tr>
              <tr>
                <td>Dashboard - Assets</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    id="assets"
                    name="assets"
                    checked={formData.assets.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assets: {
                          ...formData.assets,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Dashboard - Ticket</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    id="tickets"
                    name="tickets"
                    checked={formData.tickets.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tickets: {
                          ...formData.tickets,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Dashboard - Users</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    id="showUsers"
                    name="showUsers"
                    checked={formData.showUsers.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showUsers: {
                          ...formData.showUsers,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Assets - Summary</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    id="importAsset"
                    name="importAsset"
                    checked={formData.importAsset.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        importAsset: {
                          ...formData.importAsset,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Assets - Import</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    id="summary"
                    name="summary"
                    checked={formData.summary.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        summary: {
                          ...formData.summary,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
            </table>
          </div>
          <div className="w-1/2 p-4 bg-white rounded-md shadow-md max-lg:w-full">
            <table>
              <h2 className="text-slate-700 font-semibold mb-3">
                Data Permissions
              </h2>
              <tr>
                <th className="w-[70%]">Data Name</th>
                <th>View</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
              <tr>
                <td>Users</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="users"
                    checked={formData.users.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        users: {
                          ...formData.users,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="users"
                    checked={formData.users.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        users: {
                          ...formData.users,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="users"
                    checked={formData.users.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        users: {
                          ...formData.users,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Components</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="components"
                    checked={formData.components.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        components: {
                          ...formData.components,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="components"
                    checked={formData.components.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        components: {
                          ...formData.components,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="components"
                    checked={formData.components.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        components: {
                          ...formData.components,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Department</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="departments"
                    checked={formData.departments.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departments: {
                          ...formData.departments,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="departments"
                    checked={formData.departments.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departments: {
                          ...formData.departments,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="departments"
                    checked={formData.departments.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departments: {
                          ...formData.departments,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Sub-Department</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subDepartments"
                    checked={formData.subDepartments.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subDepartments: {
                          ...formData.subDepartments,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subDepartments"
                    checked={formData.subDepartments.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subDepartments: {
                          ...formData.subDepartments,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subDepartments"
                    checked={formData.subDepartments.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subDepartments: {
                          ...formData.subDepartments,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Location</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="locations"
                    checked={formData.locations.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locations: {
                          ...formData.locations,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="locations"
                    checked={formData.locations.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locations: {
                          ...formData.locations,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="locations"
                    checked={formData.locations.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        locations: {
                          ...formData.locations,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Sub-location</td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subLocations"
                    checked={formData.subLocations.isView || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subLocations: {
                          ...formData.subLocations,
                          isView: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subLocations"
                    checked={formData.subLocations.isEdit || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subLocations: {
                          ...formData.subLocations,
                          isEdit: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    className="w-5 h-5"
                    type="checkbox"
                    name="subLocations"
                    checked={formData.subLocations.isDelete || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subLocations: {
                          ...formData.subLocations,
                          isDelete: e.target.checked,
                        },
                      })
                    }
                  />
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="my-2 flex gap-2 justify-end">
          <button
            type="submit"
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
          >
            Submit
          </button>
          <NavLink
            to="/main/configuration/Users"
            className={({ isActive }) =>
              `hover:underline cursor-pointer ${
                isActive ? "text-blue-400" : ""
              }`
            }
          >
            <button className="bg-[#df656b] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Cancel
            </button>
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
