import React, { useState } from "react";

function ImportUser() {
  const [fileData, setFileData] = useState(null);

  const uploadFileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const importUserHandler = (e) => {
    e.preventDefault();
    //api
    console.log(fileData);
  };

  const downloadTemplateHandler = () => {
    //logic
  };
  return (
    <>
      <div className="flex flex-col gap-8 w-[100%] min-h-full p-4 bg-slate-200">
        <h2 className="text-md font-semibold mb-6 text-start">IMPORT USER</h2>
        <div>
          <form
            onSubmit={importUserHandler}
            className="flex flex-col md:flex-row justify-between max-w-3xl space-y-6 p-10 rounded-md shadow-sm mx-auto bg-white"
          >
            <div className="w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Import File
              </label>
              <input
                type="file"
                onChange={uploadFileChangeHandler}
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-sm file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer
                       ${
                         fileData ? "border-gray-300" : "border-gray-500"
                       } border rounded-sm`}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                onClick={importUserHandler}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition outline-none"
              >
                Import
              </button>
              <button
                type="button"
                onClick={downloadTemplateHandler}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition outline-none"
              >
                Download Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ImportUser;
