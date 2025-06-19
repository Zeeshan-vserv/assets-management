import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";

function NewVendor() {
  const [formData, setFormData] = useState({
    vendorCode: "VSERV123",
    vendorName: "",
    contactPerson: "",
    contactNumber: "",
    emailAddress: "",
    city: "",
    address: "",
    vendorCategory: "",
    vendorStatus: "",
    serviceCategory: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
  };
  return (
    <>
      <div className="w-[100%] h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">NEW VENDOR</h2>
        <form
          onSubmit={handleFormSubmitHandler}
          className="flex flex-col w-full p-8 bg-white rounded-md shadow-sm"
        >
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
            >
              Submit
            </button>
            <NavLink
              to="/main/configuration/all-vendors"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 mt-4 mb-8">
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Vendor Code*
              </label>
              <input
                type="text"
                name="vendorCode"
                value={formData.vendorCode || ""}
                onChange={handleChange}
                readOnly
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Vendor Name*
              </label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Contact Person*
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Contact Number*
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Email Address*
              </label>
              <input
                type="text"
                name="emailAddress"
                value={formData.emailAddress || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                City*
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Vendor Category*
              </label>
              <Autocomplete
                className="w-[65%]"
                name="vendorCategory"
                value={formData.vendorCategory}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, vendorCategory: value }))
                }
                options={["Online Time Service"]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Vendor Category"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Vendor Status*
              </label>
              <Autocomplete
                className="w-[65%]"
                name="vendorStatus"
                value={formData.vendorStatus}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, vendorStatus: value }))
                }
                options={["Active", "In-Active"]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Vendor Status"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Service Category*
              </label>
              <Autocomplete
                className="w-[65%]"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, serviceCategory: value }))
                }
                options={["Category-A", "Category-B", "Category-C"]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Service Category"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex flex-row flex-wrap gap-2 w-[100%]">
            <label className="w-[25%] text-xs font-semibold text-slate-600">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              rows={5}
              className="w-[100%] text-xs bg-[#F0F8FF] text-slate-600 border-2 border-slate-300 p-2 outline-none"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default NewVendor;
