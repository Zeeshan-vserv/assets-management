import React from "react";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
        <p className="text-start text-md text-gray-700 mb-4 font-normal">
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg shadow-md transition duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg shadow-md transition duration-200 ease-in-out hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
