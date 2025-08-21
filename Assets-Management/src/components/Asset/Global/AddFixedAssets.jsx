import React, { useEffect, useState } from "react";
import { createAsset } from "../../../api/AssetsRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
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
import { getAllStoreLocations } from "../../../api/StoreLocationRequest";
import { getAllVendors } from "../../../api/vendorRequest";

const AddFixedAssets = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [isLoading, setIsLoading] = useState(true);
  const [locationData, setLocationData] = useState([]);
  // const [subLocationData, setSubLocationData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [filteredSubLocations, setFilteredSubLocations] = useState([]);
  const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);
  const [storeLocation, setstoreLocation] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendorData, setVendors] = useState([]);

  const [formData, setFormData] = useState({
    assetInformation: {
      category: "",
      assetTag: "",
      criticality: "",
      make: "",
      model: "",
      serialNumber: "",
      expressServiceCode: "",
      ipAddress: "",
      operatingSystem: "",
      cpu: "",
      hardDisk: "",
      ram: "",
      assetImage: "",
    },
    assetState: {
      assetIsCurrently: "",
      user: "",
      department: "",
      comment: "",
    },
    locationInformation: {
      location: "",
      subLocation: "",
      storeLocation: "",
    },
    warrantyInformation: {
      vendor: "",
      assetType: "",
      supportType: "",
    },
    financeInformation: {
      poNo: "",
      poDate: "",
      invoiceNo: "",
      invoiceDate: "",
      assetCost: "",
      residualCost: "",
      assetLife: "",
      depreciation: "",
      hsnCode: "",
      costCenter: "",
    },
    preventiveMaintenance: {
      pmCycle: "",
      schedule: "",
      istPmDate: "",
    },
  });

  useEffect(() => {
    const selectedLocation = locationData.find(
      (loc) => loc.locationName === formData.locationInformation.location
    );
    setFilteredSubLocations(selectedLocation?.subLocations || []);
  }, [formData.locationInformation.location, locationData]);

  useEffect(() => {
    const selectedDepartment = departmentData.find(
      (dept) => dept.departmentName === formData.assetState.department
    );
    setFilteredSubDepartments(selectedDepartment?.subdepartments || []);
  }, [formData.assetState.department, departmentData]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseLocation = await getAllLocation();
      setLocationData(responseLocation?.data?.data || []);

      const responseDepartment = await getAllDepartment();
      setDepartmentData(responseDepartment?.data?.data || []);

      const responseSubDepartment = await getAllSubDepartment();
      setSubDepartmentData(responseSubDepartment?.data?.data || []);

      const responseStoreLocation = await getAllStoreLocations();
      setstoreLocation(responseStoreLocation?.data?.data || []);

      const responseReportingManager = await getAllUsers();
      setUsers(responseReportingManager?.data || []);

      const responseVendors = await getAllVendors();
      // console.log("Vendors Response:", responseVendors?.data?.data || []);
      setVendors(responseVendors?.data?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    // Append all fields except the image
    Object.entries(formData).forEach(([sectionKey, sectionValue]) => {
      if (typeof sectionValue === "object" && sectionValue !== null) {
        Object.entries(sectionValue).forEach(([key, value]) => {
          // For assetImage, append as file
          if (
            sectionKey === "assetInformation" &&
            key === "assetImage" &&
            value
          ) {
            dataToSend.append("assetImage", value);
          } else {
            dataToSend.append(`${sectionKey}[${key}]`, value);
          }
        });
      }
    });

    // Append userId if needed
    dataToSend.append("userId", user.userId);

    // console.log(dataToSend);
    await createAsset(dataToSend);
    toast.success("Asset created Sucessfully");
    setFormData({
      assetInformation: {
        category: "",
        assetTag: "",
        criticality: "",
        make: "",
        model: "",
        serialNumber: "",
        expressServiceCode: "",
        ipAddress: "",
        operatingSystem: "",
        cpu: "",
        hardDisk: "",
        ram: "",
        assetImage: "",
      },
      assetState: {
        assetIsCurrently: "",
        user: "",
        department: "",
        subDepartment: "",
        comment: "",
      },
      locationInformation: {
        location: "",
        subLocation: "",
        storeLocation: "",
      },
      warrantyInformation: {
        vendor: "",
        assetType: "",
        supportType: "",
      },
      financeInformation: {
        poNo: "",
        poDate: "",
        invoiceNo: "",
        invoiceDate: "",
        assetCost: "",
        residualCost: "",
        assetLife: "",
        depreciation: "",
        hsnCode: "",
        costCenter: "",
      },
      preventiveMaintenance: {
        pmCycle: "",
        schedule: "",
        istPmDate: "",
      },
    });
  };

  return (
    <div className="w-[100%] h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">NEW ASSET</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <div className="flex gap-2 justify-end">
            <button className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Submit
            </button>
            <NavLink
              to="/main/asset/AssetData"
              className={({ isActive }) =>
                `hover:underline cursor-pointer ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
                Cancel
              </button>
            </NavLink>
          </div>
          <h3 className="text-slate-700 font-semibold mb-6">
            Asset Information
          </h3>
          {/* Asset Information fields */}
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="category"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Category <span className="text-red-500 text-base">*</span>
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="category"
                required
                id="category"
                value={formData.assetInformation.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      category: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="IT Assets">IT Assets</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Printer">Printer</option>
                <option value="Scanner">Scanner</option>
                <option value="Router">Router</option>
                <option value="Furniture">Furniture</option>
                <option value="Veichles">Veichles</option>
                <option value="Switch">Switch</option>
                <option value="Machinery">Machinery</option>
                <option value="Others">Others</option>
                <option value="Electronics">Electronics</option>
                <option value="Modem">Modem</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Storage Devices">Storage Devices</option>
                <option value="MacBook">MacBook</option>
                <option value="Smart Tv">Smart Tv</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Mobile Phone">Mobile Phone</option>
                <option value="Switch">Switch</option>
                <option value="UPS">UPS</option>
                <option value="Desk">Desk</option>
                <option value="File Cabinets">File Cabinets</option>
                <option value="Chairs">Chairs</option>
                <option value="Bookcases">Bookcases</option>
                <option value="Sofa Sets">Sofa Sets</option>
                <option value="Conference Speakers">Conference Speakers</option>
                <option value="Coffee Machine">Coffee Machine</option>
                <option value="Bag Scanner">Bag Scanner</option>
                <option value="Desk Phones">Desk Phones</option>
                <option value="Fan">Fan</option>
                <option value="Tool Kit">Tool Kit</option>
                <option value="Two Wheeler">Two Wheeler</option>
                <option value="Four Wheeler">Four Wheeler</option>
                <option value="Barcode Printer">Barcode Printer</option>
                <option value="Projector">Projector</option>
                <option value="Apple">Apple</option>
                <option value="Medical Desk">Medical Desk</option>
                <option value="Patient Bed">Patient Bed</option>
                <option value="Printer + Scanner">Printer + Scanner</option>
                <option value="VC">VC</option>
              </select>
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="assetTag"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Tag <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="assetTag"
                required
                name="assetTag"
                value={formData.assetInformation.assetTag}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      assetTag: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="criticality"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Criticality <span className="text-red-500 text-base">*</span>
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="criticality"
                id="criticality"
                required
                value={formData.assetInformation.criticality}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      criticality: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="Critical">Critical</option>
                <option value="Non-Critical">Non-Critical</option>
              </select>
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="make"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Make <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="make"
                name="make"
                required
                value={formData.assetInformation.make}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      make: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="model"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Model <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="model"
                name="model"
                required
                value={formData.assetInformation.model}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      model: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="serialNumber"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Serial Number <span className="text-red-500 text-base">*</span>
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="serialNumber"
                required
                name="serialNumber"
                value={formData.assetInformation.serialNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      serialNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="expressServiceCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Express Service Code
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="expressServiceCode"
                name="expressServiceCode"
                value={formData.assetInformation.expressServiceCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      expressServiceCode: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="ipAddress"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                IP Address
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="ipAddress"
                name="ipAddress"
                value={formData.assetInformation.ipAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      ipAddress: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="operatingSystem"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Operating System
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="operatingSystem"
                name="operatingSystem"
                value={formData.assetInformation.operatingSystem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      operatingSystem: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="cpu"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                CPU
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="cpu"
                name="cpu"
                value={formData.assetInformation.cpu}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      cpu: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="hardDisk"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Hard Disk
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="hardDisk"
                name="hardDisk"
                value={formData.assetInformation.hardDisk}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      hardDisk: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="ram"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                RAM
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="ram"
                name="ram"
                value={formData.assetInformation.ram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      ram: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="assetImage"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Image
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="file"
                id="assetImage"
                name="assetImage"
                // value={formData.assetInformation.assetImage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetInformation: {
                      ...formData.assetInformation,
                      assetImage: e.target.files[0],
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Asset State fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700 font-semibold mb-6">Asset State</h3>
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="assetIsCurrently"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset is Currently
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="assetIsCurrently"
                id="assetIsCurrently"
                value={formData.assetState.assetIsCurrently}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetState: {
                      ...formData.assetState,
                      assetIsCurrently: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="In Store">In Store</option>
                <option value="Allocated">Allocated</option>
                <option value="In Repair">In Repair</option>
                <option value="Lost">Theft/Lost</option>
                <option value="Discard">Discard/Replaced</option>
                <option value="Disposed">Disposed / Scrapped</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="user"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                User
              </label>
              <Autocomplete
                className="w-[65%]"
                options={users}
                getOptionLabel={(option) => option.emailAddress}
                value={
                  users.find((user) => user._id === formData.assetState.user) ||
                  null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    assetState: {
                      ...formData.assetState,
                      user: newValue ? newValue._id : "",
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
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="department"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Department
              </label>
              <Autocomplete
                className="w-[65%]"
                options={departmentData}
                getOptionLabel={(option) => option.departmentName}
                value={
                  departmentData.find(
                    (dept) =>
                      dept.departmentName === formData.assetState.department
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    assetState: {
                      ...formData.assetState,
                      department: newValue ? newValue.departmentName : "",
                      subDepartment: "",
                    },
                  });
                  setFilteredSubDepartments(newValue?.subdepartments || []);
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
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="subDepartment"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Department
              </label>
              <Autocomplete
                className="w-[65%]"
                options={filteredSubDepartments}
                getOptionLabel={(option) => option?.subdepartmentName || ""}
                value={
                  filteredSubDepartments.find(
                    (subDept) =>
                      subDept.subdepartmentName ===
                      formData.assetState.subDepartment
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    assetState: {
                      ...formData.assetState,
                      subDepartment: newValue ? newValue.subdepartmentName : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select SubDepartment"
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
                htmlFor="comment"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Comment
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="comment"
                name="comment"
                value={formData.assetState.comment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assetState: {
                      ...formData.assetState,
                      comment: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Location Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700 font-semibold mb-6">
            Location Information
          </h3>
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="location"
                className="w-[25%] text-xs font-semibold text-slate-600"
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
                      loc.locationName === formData.locationInformation.location
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    locationInformation: {
                      ...formData.locationInformation,
                      location: newValue ? newValue.locationName : "",
                      subLocation: "",
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
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="subLocation"
                className="w-[25%] text-xs font-semibold text-slate-600"
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
                      formData.locationInformation.subLocation
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    locationInformation: {
                      ...formData.locationInformation,
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
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="storeLocation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Store Location
              </label>
              <Autocomplete
                className="w-[65%]"
                options={storeLocation}
                getOptionLabel={(option) => option?.storeLocationName || ""}
                value={
                  storeLocation.find(
                    (loc) =>
                      loc.storeLocationName ===
                      formData.locationInformation.storeLocation
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    locationInformation: {
                      ...formData.locationInformation,
                      storeLocation: newValue ? newValue.storeLocationName : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Store Location"
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

        {/* Warranty Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700 font-semibold mb-6">
            Warranty Information
          </h3>
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="vendor"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Vendor
              </label>
              {/* <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="vendor"
                id="vendor"
                value={formData.warrantyInformation.vendor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warrantyInformation: {
                      ...formData.warrantyInformation,
                      vendor: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="N/A">N/A</option>
              </select> */}
              <Autocomplete
                className="w-[65%]"
                options={vendorData}
                getOptionLabel={(option) => option.vendorName}
                value={
                  vendorData.find(
                    (vendor) =>
                      vendor.vendorName === formData.warrantyInformation.vendor
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    warrantyInformation: {
                      ...formData.warrantyInformation,
                      vendor: newValue ? newValue.vendorName : "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Vendor"
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
                htmlFor="assetType"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Type
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="assetType"
                id="assetType"
                value={formData.warrantyInformation.assetType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warrantyInformation: {
                      ...formData.warrantyInformation,
                      assetType: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="New">New</option>
                <option value="Old">Old</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Damaged">Damaged</option>
                <option value="Provident by Landlord">
                  Provident by Landlord
                </option>
                <option value="N/A">N/A</option>
                <option value="Used">Used</option>
              </select>
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="supportType"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Support Type
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="supportType"
                id="supportType"
                value={formData.warrantyInformation.supportType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warrantyInformation: {
                      ...formData.warrantyInformation,
                      supportType: e.target.value,
                    },
                  })
                }
              >
                Support Type
                <option value="">Select</option>
                <option value="Under Warranty">Under Warranty</option>
                <option value="Under AMC">Under AMC</option>
                <option value="Out Of Support">Out Of Support</option>
              </select>
            </div>
          </div>
        </div>

        {/* Finance Information fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700 font-semibold mb-6">
            Finance Information
          </h3>
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="poNo"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PO No.
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="poNo"
                name="poNo"
                value={formData.financeInformation.poNo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      poNo: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="poDate"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PO Date
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="date"
                id="poDate"
                name="poDate"
                value={formData.financeInformation.poDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      poDate: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="invoiceNo"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Invoice No.
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={formData.financeInformation.invoiceNo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      invoiceNo: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="invoiceDate"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Invoice Date
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="date"
                id="invoiceDate"
                name="invoiceDate"
                value={formData.financeInformation.invoiceDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      invoiceDate: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="assetCost"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Cost
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(INR)"
                id="assetCost"
                name="assetCost"
                value={formData.financeInformation.assetCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      assetCost: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="residualCost"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Residual Cost
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(INR)"
                id="residualCost"
                name="residualCost"
                value={formData.financeInformation.residualCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      residualCost: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="assetLife"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Asset Life
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(YEARS)"
                id="assetLife"
                name="assetLife"
                value={formData.financeInformation.assetLife}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      assetLife: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="depreciation"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Depreciation(%)
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="(0.0)"
                id="depreciation"
                name="depreciation"
                value={formData.financeInformation.depreciation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      depreciation: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="hsnCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                HSN Code
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="hsnCode"
                name="hsnCode"
                value={formData.financeInformation.hsnCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      hsnCode: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="costCenter"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Cost Center
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="costCenter"
                id="costCenter"
                value={formData.financeInformation.costCenter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financeInformation: {
                      ...formData.financeInformation,
                      costCenter: e.target.value,
                    },
                  })
                }
              >
                <option value="">Select</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preventive Maintenance fields */}
        <div className="w-full p-8 bg-white rounded-md shadow-md">
          <h3 className="text-slate-700 font-semibold mb-6">
            Preventive Maintenance
          </h3>
          <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="pmCycle"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                PM Cycle
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="number"
                placeholder="No. of Days"
                id="pmCycle"
                name="pmCycle"
                value={formData.preventiveMaintenance.pmCycle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preventiveMaintenance: {
                      ...formData.preventiveMaintenance,
                      pmCycle: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label
                htmlFor="schedule"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Schedule
              </label>
              <div className="w-[65%] flex flex-col max-lg:flex-row flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="schedule-actual"
                    name="schedule"
                    value="From Actual PM Date"
                    checked={
                      formData.preventiveMaintenance.schedule ===
                      "From Actual PM Date"
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preventiveMaintenance: {
                          ...formData.preventiveMaintenance,
                          schedule: e.target.value,
                        },
                      })
                    }
                  />
                  From Actual PM Date
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="schedule-fixed"
                    name="schedule"
                    value="Fixed Schedule"
                    checked={
                      formData.preventiveMaintenance.schedule ===
                      "Fixed Schedule"
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preventiveMaintenance: {
                          ...formData.preventiveMaintenance,
                          schedule: e.target.value,
                        },
                      })
                    }
                  />
                  Fixed Schedule
                </div>
              </div>
            </div>

            {formData.preventiveMaintenance.schedule === "Fixed Schedule" && (
              <div className="flex items-center w-[46%] max-lg:w-full">
                <label
                  htmlFor="istPmDate"
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  1st PM Date
                </label>
                <input
                  className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="date"
                  id="istPmDate"
                  name="istPmDate"
                  value={formData.preventiveMaintenance.istPmDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preventiveMaintenance: {
                        ...formData.preventiveMaintenance,
                        istPmDate: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddFixedAssets;
