import React, { useRef, useState } from "react";
import { uploadUsersFromExcel } from "../../../api/AuthRequest.js";
import { toast } from "react-toastify";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";

function ImportUser() {
  const [fileData, setFileData] = useState(null);

  const uploadFileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const importUserHandler = async (e) => {
    e.preventDefault();
    if (!fileData) {
      toast.warning("Please select a file before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileData);
    try {
      const response = await uploadUsersFromExcel(formData);
      if (response?.data?.success) {
        toast.success("Users uploaded successfully");
        setFileData(null);
      }
    } catch (error) {
      console.log(error);
      console.error("Upload Failed:", error);
    }
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
                Import User File
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
              <div className="flex justify-center items-center gap-1 border-2 border-green-500 rounded-md p-1">
                <span className="text-green-500">Upload</span>
                <button
                  type="submit"
                  onClick={importUserHandler}
                  className="flex items-center justify-center text-green-500 rounded-sm hover:bg-green-600 transition outline-none"
                >
                  <IoCloudUploadOutline size={22} />
                </button>
              </div>

              <div className="flex justify-center items-center gap-1 border-2 border-blue-600 rounded-md p-1">
                <span className="text-blue-500">Download Template</span>
                <a
                  href="/User_Format.xlsx"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-blue-600 rounded-sm hover:bg-blue-700 transition outline-none"
                >
                  <IoMdDownload size={22} />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ImportUser;
