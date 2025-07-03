import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";

function NewIncidents() {
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectUser, setSelectUser] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("formData", formData);
    } catch (error) {
      console.log("Failed to create incident", error);
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
                  htmlFor=""
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  Subject <span className="text-red-500 text-base">*</span>
                </label>
                <input
                  className="w-[65%] text-xs text-slate-600 border-b border-slate-400 p-2 outline-none focus:border-blue-500 focus:border-b-2"
                  type="text"
                  id=""
                  name=""
                  value={formData}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label
                  htmlFor=""
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  Category<span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Software", "Hardware", "Network", "other"]}
                  getOptionLabel={(option) => option}
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
                  htmlFor=""
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  Sub Category<span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["sub"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select Sub Category"
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
                  htmlFor=""
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  Asset<span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["GUWEBRL007"]}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select Asset"
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
                  htmlFor=""
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  User Name <span className="text-red-500 text-base">*</span>
                </label>
                <input
                  className="w-[65%] text-xs text-slate-600 border-b border-slate-400 p-2 outline-none focus:border-blue-500 focus:border-b-2"
                  type="text"
                  id=""
                  name=""
                  value={formData}
                  onChange={handleChange}
                  required
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
                      options={["Shreya Bajpai"]}
                      getOptionLabel={(option) => option}
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
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewIncidents;
