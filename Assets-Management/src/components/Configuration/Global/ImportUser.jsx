import React, { useRef, useState } from "react";
import { uploadUsersFromExcel } from "../../../api/AuthRequest.js";
import { toast } from "react-toastify";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import ConfirmUpdateModal from "../../ConfirmUpdateModal.jsx";

function ImportUser() {
  const [fileData, setFileData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null); // Add this line

  const uploadFileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const importUserHandler = async (e) => {
    e.preventDefault();
    if (!fileData) {
      toast.warning("Please select a user file before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileData);
    try {
      const response = await uploadUsersFromExcel(formData);
      if (response?.data?.success) {
        toast.success("Users uploaded successfully");
        setFileData(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input
        }
      }
      setShowConfirm(false);
    } catch (error) {
      console.error("User Upload Failed:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8 w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">IMPORT USER</h2>
        <div>
          <form
            onSubmit={importUserHandler}
            className="flex flex-col md:flex-row justify-between max-w-3xl space-y-6 p-10 rounded-md shadow-lg mx-auto bg-white"
          >
            <div className="w-full md:w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Import User File
              </label>
              <input
                type="file"
                required
                ref={fileInputRef} // Add this prop
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
              <div className="flex justify-center items-center border-[0.1rem] border-green-500 rounded-md p-1 cursor-pointer">
                <button
                  // type="submit"
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="text-green-500 rounded-sm transition outline-none"
                >
                  <div className="flex justify-center items-center gap-1">
                    <span className="text-green-500">Upload</span>
                    <IoCloudUploadOutline size={20} />
                  </div>
                </button>
                <ConfirmUpdateModal
                  isOpen={showConfirm}
                  message="Are you sure you want to upload users?"
                  onConfirm={importUserHandler}
                  onCancel={() => setShowConfirm(false)}
                />
              </div>

              <div className="flex justify-center items-center gap-1 border-[0.1rem] border-blue-600 rounded-md p-1 cursor-pointer">
                <a
                  href="/User_Format.xlsx"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 rounded-sm transition outline-none"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-blue-500">Download Template</span>
                    <IoMdDownload size={20} />
                  </div>
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
