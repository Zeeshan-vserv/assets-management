import React, { useRef, useState } from "react";
import { useParams } from "react-router";
import { MdOutlineReply } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
// import { Editor } from "@tinymce/tinymce-react";

function IncidentDetails() {
  const { id } = useParams();
  const [openIndex, setOpenIndex] = useState(null);
  // const editorRef = useRef(null);

  const incidentDetails = [
    { label: "Status", value: "Resolved" },
    { label: "Priority", value: "Severity - 3" },
    { label: "Subject", value: "VC connect issue" },
    { label: "Support Dept.", value: "IT Support" },
    { label: "Support Group", value: "VIDEO CONFERENCE" },
    { label: "Logged Time", value: "6/30/2025 – 12:38" },
    { label: "Email", value: "deydebabratahooghly@gmail.com" },
    { label: "Business Unit", value: "Steel Authority of India Ltd" },
    { label: "Asset", value: "CALIBVC6THCONF" },
    { label: "Asset S.No.", value: "POLY6TH" },
    { label: "User", value: "Debabrata Dey" },
    { label: "VIP User", value: "NO" },
    { label: "Assigned To", value: "Debabrata Dey" },
    { label: "Contact No.", value: "6291167601" },
    { label: "Category", value: "VIDEO CONFERENCE" },
  ];

  const messages = [
    {
      id: 1,
      sender: "superadmin@zservicedesk.com",
      timestamp: "7/2/2025 – 12:14:12 PM",
      to: "deydebabratahooghly@gmail.com",
      cc: "null",
      message: "After video Connecting issue has been resolved",
    },
    {
      id: 2,
      sender: "deydebabratahooghly@gmail.com",
      timestamp: "6/30/2025 – 12:38:00 PM",
      to: "",
      cc: "",
      message: "",
    },
  ];

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">
          INCIDENT ID - {id}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex-1 h-full bg-white p-6 rounded-lg shadow-md min-w-[600px]">
            <h2 className="text-sm font-semibold mb-4 text-gray-600">
              Reply To Service Desk
            </h2>

            <textarea
              className="w-full border border-gray-300 rounded-md p-3  resize-y font-['Verdana'] text-[11pt] outline-none"
              placeholder="Type your reply..."
            />
            <div className=" flex flex-row justify-between items-center mt-2">
              <label className="block font-medium mb-1 text-sm">
                Attachment:
              </label>
              <input
                type="file"
                className="border file:border file:rounded-sm file:px-1 border-gray-300 rounded-md px-2 py-1 file:cursor-pointer"
              />
            </div>
            <button className="mt-4 px-3 py-2 bg-slate-500 text-white rounded-md shadow cursor-pointer">
              <div className="flex flex-row items-center">
                <MdOutlineReply size={20} />
                <span className="text-sm">Reply</span>
              </div>
            </button>
            <div className="w-full mx-auto p-4">
              {messages.map((item, index) => (
                <div
                  key={item.id}
                  className={`border rounded-md my-3 ${
                    index === 1 ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-1">
                    <div className="text-sm font-medium">
                      {item.sender} ({item.timestamp})
                    </div>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-600 cursor-pointer"
                    >
                      {openIndex === index ? <FaMinus /> : <FaPlus />}
                    </button>
                  </div>
                  {/* Dropdown Content */}
                  {openIndex === index && (
                    <div className="bg-white px-4 py-3 text-sm space-y-1 border-t">
                      {item.to && (
                        <p>
                          <strong>To:</strong> {item.to}
                        </p>
                      )}
                      {item.cc && (
                        <p>
                          <strong>CC:</strong> {item.cc}
                        </p>
                      )}
                      {item.message && <p className="pt-2">{item.message}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full lg:max-w-[500px] bg-white p-4 rounded-md shadow-md overflow-x-auto">
            <table className="w-full text-sm border border-gray-300 rounded-md">
              <tbody>
                {incidentDetails.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="p-3 font-medium border border-gray-300 text-gray-700">
                      {item.label}
                    </td>
                    <td className="p-3 border border-gray-300 text-gray-600">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default IncidentDetails;
