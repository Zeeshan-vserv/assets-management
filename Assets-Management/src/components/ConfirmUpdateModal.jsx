import React from "react";

const ConfirmUpdateModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
        <p className="text-start text-md text-gray-700 mb-4 font-normal">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
             className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUpdateModal;
