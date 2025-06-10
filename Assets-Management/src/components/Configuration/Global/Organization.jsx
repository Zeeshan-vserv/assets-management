import React from "react";

function Organization() {
  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-200">
        <h2 className="text-md font-semibold mb-6 text-start">
          Organization Info
        </h2>
        {/* <div>
          <form className="flex flex-row max-w-4xl space-y-6 p-6 rounded-md shadow-sm mx-auto bg-white">
            <div className="space-y-4">
              <div className="flex">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Organization Name*
                </label>
                <input
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none"
                />
              </div>
              <div className="flex">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Application Admin*
                </label>
                <select>
                  <option value="">Select</option>
                </select>
              </div>
              <div className="flex">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Logo Size(944*328)
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-sm file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
              <div className="flex">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Support Email*
                </label>
                <input
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contact Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none shadow-sm"
                />
              </div>
              <div className="flex">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none shadow-sm focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Background Image (1772×1348)
                </label>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div> */}
      </div>
    </>
  );
}

export default Organization;
