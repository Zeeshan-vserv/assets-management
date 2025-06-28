import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
function EditSlaCreation() {
  const { id } = useParams();
  const navigate = useNavigate();

  // console.log("id", id);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-slate-700 font-semibold">NEW SLA</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="my-2 flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Update
              </button>
              <button
                onClick={() => navigate("/main/configuration/sla-creation")}
                className="bg-[#df656b] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-3">
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  SLA Name<span className="text-red-500 text-base">*</span>
                </label>
                <input
                  className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id=""
                  name=""
                  value=""
                  required
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Holiday Calendar
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Pan India"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Set as default
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Active
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Service Window (24x7)
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-10 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 shadow-sm text-xs">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-2 border text-left text-sm">Select</th>
                    <th className="p-2 border text-left text-sm">Weekday</th>
                    <th className="p-2 border text-left text-sm">From Time</th>
                    <th className="p-2 border text-left text-sm">To Time</th>
                  </tr>
                </thead>
                <tbody>
                  {weekdays.map((day, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="p-2 border text-start">
                        <input type="checkbox" className="w-4 h-4" />
                      </td>
                      <td className="p-2 border font-medium text-sm">{day}</td>
                      <td className="p-2 border">
                        <div className="flex flex-row justify-between items-center gap-1">
                          <span>Select Time</span>
                          <input
                            type="time"
                            className="max:w-full w-[60%] shadow-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      </td>
                      <td className="p-2 border">
                        <div className="flex flex-row justify-between items-center gap-1">
                          <span>Select Time</span>
                          <input
                            type="time"
                            className="max:w-full w-[60%] shadow-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSlaCreation;
