import React from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineClockCircle,
} from "react-icons/ai";

function ServiceRequest() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Service Request
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="space-y-1">
            <p>
              <span className="font-medium">Service ID:</span> SER2807202515
            </p>
            <p>
              <span className="font-medium">Subject:</span> Keypad
            </p>
            <p>
              <span className="font-medium">Category:</span> Service Category
            </p>
            <p>
              <span className="font-medium">Subcategory:</span> Service Sub
              Category
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Requester:</span> Bittu Kumar
            </p>
            <p>
              <span className="font-medium">Created:</span> 28 Jul 2025, 02:36
              PM
            </p>
            <p>
              <span className="font-medium">Last Updated:</span> 06 Aug 2025,
              12:59 PM
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Status Timeline
          </h3>
          <div className="relative border-l border-gray-300 pl-5 space-y-6">
            <div className="relative flex items-start">
              <AiFillCheckCircle
                className="text-green-500 mt-0.5 mr-2"
                size={20}
              />
              <div>
                <p className="font-medium text-gray-800">New</p>
                <p className="text-xs text-gray-500">28 Jul 2025, 02:33 PM</p>
              </div>
            </div>

            <div className="relative flex items-start">
              <AiOutlineClockCircle
                className="text-blue-400 mt-0.5 mr-2"
                size={20}
              />
              <p className="font-medium text-gray-800">Assigned</p>
            </div>

            <div className="relative flex items-start">
              <AiOutlineClockCircle
                className="text-yellow-400 mt-0.5 mr-2"
                size={20}
              />
              <p className="font-medium text-gray-800">In Progress</p>
            </div>

            <div className="relative flex items-start">
              <AiFillCloseCircle
                className="text-red-500 mt-0.5 mr-2"
                size={20}
              />
              <div>
                <p className="font-medium text-gray-800">
                  Rejected by Approver 2
                </p>
                <p className="text-xs text-gray-500">02 Aug 2025, 06:19 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Flow */}
        <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Approval Flow
          </h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-green-400 bg-green-50 rounded-md">
              <p className="font-medium text-gray-800">
                Approver 1 - danish@gmail.com
              </p>
              <p className="text-green-700 text-sm font-semibold">Approved</p>
              <p className="text-xs text-gray-500">02 Aug 2025, 06:17 PM</p>
              <p className="text-xs italic text-gray-500">Remarks: update it</p>
            </div>

            <div className="p-4 border-l-4 border-red-400 bg-red-50 rounded-md">
              <p className="font-medium text-gray-800">
                Approver 2 - bittu.kumar@vservit.com
              </p>
              <p className="text-red-700 text-sm font-semibold">Rejected</p>
              <p className="text-xs text-gray-500">02 Aug 2025, 06:19 PM</p>
            </div>

            <div className="p-4 border-l-4 border-gray-300 bg-gray-50 rounded-md">
              <p className="font-medium text-gray-800">Approver 3</p>
              <p className="text-gray-500 text-sm font-semibold">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ServiceRequest;