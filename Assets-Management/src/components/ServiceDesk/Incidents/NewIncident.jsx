import React from "react";

const NewIncident = () => {
  return (
    <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">ADD INCIDENT</h2>
      <form action="">
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
                htmlFor="employeeName"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Subject
              </label>
              <input
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                id="employeeName"
                name="employeeName"
                //value={formData.employeeName}
                //onChange={handleChange}
              />
            </div>
            <div className="flex items-center w-[46%]">
              <label
                htmlFor="employeeCode"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Category
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
                htmlFor="grade"
                className="w-[25%] text-xs font-semibold text-slate-600"
              >
                Sub Category
              </label>
              <select
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                name="grade"
                id="grade"
                //value={formData.grade}
                //onChange={handleChange}
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
                //value={formData.businessUnit}
                //onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Call">Call</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Email">Email</option>
              </select>
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
      </form>
    </div>
  );
};

export default NewIncident;
