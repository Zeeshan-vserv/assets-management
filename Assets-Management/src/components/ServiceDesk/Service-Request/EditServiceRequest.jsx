import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Autocomplete, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

function EditServiceRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [excludeSLA, setExcludeSLA] = useState(false);

  const updateSubmitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-slate-700 font-semibold">UPDATE NEW REQUEST</h2>
        <form onSubmit={updateSubmitHandler} className="flex flex-col gap-8">
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
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Title<span className="text-red-500">*</span>
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
                  Logged Via<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["Call", "Walk-In", "Email"]}
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
                <div className="w-[65%]">
                  <Autocomplete
                    options={[
                      "Application",
                      "Asset Maintenance",
                      "Email ID related",
                      "Finnone",
                      "GoColletc",
                    ]}
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
                  Sub Category<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["", "", ""]}
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

              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Request Description
                </label>
                <textarea
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id=""
                  name=""
                  rows="6"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label
                  htmlFor=""
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Catalogue Description
                </label>
                <textarea
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id=""
                  name=""
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
                  Cost<span className="text-red-500">*</span>
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
            </div>
          </div>

          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <h2 className="text-slate-700 font-semibold">Submitter</h2>
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  User Name<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={["danish@gmail.com", "bittu@gmail.com"]}
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
                  User Contact Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id=""
                  name=""
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
                <div className="w-[65%]">
                  <Autocomplete
                    options={["BSOMUMBAI15"]}
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
                  Serial No<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id=""
                  name=""
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
                  type="text"
                  id=""
                  name=""
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
                  type="text"
                  id=""
                  name=""
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
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
                <div className="w-[65%]">
                  <Autocomplete
                    options={[
                      "AGRA",
                      "BANGALORE",
                      "BOKARO",
                      "BURNPUR",
                      "CHANDIGARH",
                      "CHHATTISGARH",
                      "CHENNAI",
                      "COIMBATORE",
                      "DANKUNI",
                      "DELHI",
                      "DURGAPUR",
                      "FARIDABAD",
                      "GHAZIABAD",
                      "GUJARAT",
                      "GUWAHATI",
                      "HALDIA",
                      "HYDERABAD",
                      "JAGDISHPUR",
                      "JALANDHAR",
                      "JAMMU",
                      "KANDRORI",
                      "KANPUR",
                      "KOCHI",
                      "KOLKATA",
                      "LUCKNOW",
                      "LUDHIANA",
                      "MADHYA PRADESH",
                      "MAHARASHTRA",
                      "MANALI",
                      "MANDIGOBINDGARH",
                      "M/A",
                      "PARADEEP",
                      "PATNA",
                      "PRAYAGRAJ",
                      "RAJASHTHAN",
                      "RISHIKESH",
                      "ROURKELA",
                      "SALEM",
                      "SILIGURI",
                      "SRINAGAR",
                      "TRICHY",
                      "VIJAYAWADA",
                      "VIZAG",
                      "AHMEDABAD",
                      "BSO BHUBANESWAR",
                    ]}
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
                  Sub Location<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={[
                      "BARODA",
                      "BSAO AGRA",
                      "Sail Banglore",
                      "BSO Bokaro",
                      "SRM BURNPUR",
                      "BSO CHANNDIGARH",
                      "BSO BHILAI",
                      "Chennai RO",
                      "COIMBATORE BSO",
                      "WH DANKUNI",
                      "RO NR DELHI",
                      "BSO DURGAPUR",
                      "SRM Bokaro",
                      "WH Bokaro",
                      "WH CHANDIGARH",
                      "WH BHILAI",
                      "SRM BHILAI",
                      "CD DELHI",
                      "BSO DELHI",
                      "WH DELHI",
                      "SRM DURGAPUR",
                      "WH DURGAPUR",
                      "BSO Faridabad",
                      "WH Faridabad",
                      "BSO Ghaziabad",
                      "WH Ghaziabad",
                      "BSO AHMEDABAD",
                      "BSO Guwahati",
                      "BTSO HALDIA",
                      "SAIL Hyderabad",
                      "SPJ-JAGDISHPUR",
                      "BSO JALANDHAR",
                      "BSO JAMMU",
                      "WH-JAMMU",
                      "SPU KANDRORI",
                      "BSO KANPUR",
                      "WH-Kanpur",
                      "KOCHI BSO",
                      "KOCHI WH",
                      "CMO HQ",
                      "CMO HQ50",
                      "BSO KOLKATA",
                      "BTSO KOLKATA",
                      "RMC KOLKATA",
                      "COMO ER",
                      "SLCC",
                      "CCO LUCKNOW",
                      "BSO LUDHIANA",
                      "WH LUCHIANA",
                      "GWALIOR",
                      "MADHYA PRADESH",
                      "BSO INDORE",
                      "INDORE",
                      "BSO JABALPUR",
                      "BHOPAL CCO",
                      "BHOPAL",
                      "BSO MUMBAI",
                      "BSO NAGPUR",
                      "PUNE",
                      "MUMBAI RO",
                      "KALAMBOLIWH",
                      "MANALI-WH",
                      "BSO MANDIGOBIDGARH",
                      "WH MANDIGOBINDGARH",
                      "BSO BHUBENESWAR",
                      "SR-BSO",
                      "BTSO PRADEEP",
                      "BSO PATNA",
                      "BSO PRAYAGRAJ",
                      "WH PRAYAGRAJ",
                      "BSO JAIPUR",
                      "KOTA",
                      "CA YARD RISHIKESH",
                      "CCO DEHARADUN",
                      "ROURKELA",
                      "SALEM SRMO",
                      "CCO SILIGURI",
                      "CCO SRINAGAR",
                      "CA YARD SRINAGAR",
                      "TRICHY BSO",
                      "TRICHY WH",
                      "BSO VIJAYAWADA",
                      "BSO VIZAG",
                      "BSO YARD",
                      "BSO yardVIZAG",
                      "BTSO VIZAG",
                      "BTSO VIZAG YARD",
                      "JABALPUR",
                      "BSOYARD",
                      "BTSO VIZAG YARD",
                      "BSO Faridabad",
                      "BSO LUDHIANA",
                      "BSO PRAYAGRAJ",
                    ]}
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
                <div className="w-[65%]">
                  <Autocomplete
                    options={[""]}
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
                  Support Group<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={[""]}
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
                  Technicians<span className="text-red-500">*</span>
                </label>
                <div className="w-[65%]">
                  <Autocomplete
                    options={[""]}
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
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditServiceRequest;
