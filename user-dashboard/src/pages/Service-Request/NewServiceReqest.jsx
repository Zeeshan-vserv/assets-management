import React from "react";
import { NavLink } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import { Autocomplete, TextField } from "@mui/material";

function NewServiceReqest() {
  const dropdownData = [
    {
      label: "Application",
      children: [
        {
          label: "Provisioning",
          children: [{ label: "User ID request", path: "" }],
        },
      ],
    },
    {
      label: "Asset Maintenance",
      children: [
        {
          label: "New Asset Request",
          children: [
            {
              label: "Test Maintenance Template",
              path: "",
            },
          ],
        },
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hdhhd");
  };
  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">
          NEW SERVICE REQUEST
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="flex flex-row gap-4 mb-4">
              <div className="w-full max-w-72 h-full bg-white">
                {dropdownData.map((item, index) => (
                  <DropdownButton
                    key={index}
                    label={item.label}
                    children={item.children}
                  />
                ))}
              </div>
              <div className="w-full">
                <div className="flex flex-wrap gap-4 w-full max-w-4xl h-full bg-white p-4 rounded-md">
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
                      id=""
                      name=""
                      placeholder=""
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
                      options={[]}
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
                  <div className="flex items-center w-[46%]">
                    <label
                      htmlFor="category"
                      className="w-[28%] text-xs font-semibold text-slate-600"
                    >
                      Sub Category
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={[]}
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
                </div>
                <div>Editor</div>
              </div>
            </div>
            <div className="my-2 flex justify-end gap-2">
              <button
                type="submit"
                className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white cursor-pointer"
              >
                Submit
              </button>
              <NavLink
                to="/service-request"
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
        </form>
      </div>
    </>
  );
}

export default NewServiceReqest;
