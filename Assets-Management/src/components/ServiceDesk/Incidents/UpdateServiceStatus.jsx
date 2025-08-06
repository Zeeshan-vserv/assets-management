import React, { useState } from "react";
import { useParams } from "react-router";
import {
  MdOutlineReply,
  MdOutlineSystemSecurityUpdateGood,
} from "react-icons/md";
import { useEffect } from "react";
import dayjs from "dayjs";
import { getUserById } from "../../../api/AuthRequest";
import { getServiceRequestById } from "../../../api/serviceRequest";

const UpdateServiceStatus = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userDets, setUserDets] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    subCategory: "",
    loggedVia: "",
    description: "",
    submitter: {
      user: "",
      userContactNumber: "",
      userEmail: "",
      userDepartment: "",
      loggedBy: "",
    },
    assetDetails: {
      asset: "",
      make: "",
      model: "",
      serialNo: "",
    },
    locationDetails: {
      location: "",
      subLocation: "",
      floor: "",
      roomNo: "",
    },
    classificaton: {
      excludeSLA: false,
      severityLevel: "",
      supportDepartmentName: "",
      supportGroupName: "",
      technician: "",
    },
  });
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getServiceRequestById(id);
      if (response?.data?.data) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching incident:", error);
      toast.error("Failed to load incident data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(formData.userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setUserDets(response?.data || {});
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formData.userId) {
      fetchUser();
    }
  }, [formData.userId]);

  const getLatestStatus = (timeline) => {
    if (!Array.isArray(timeline) || timeline.length === 0) return "No Status";
    return timeline[timeline.length - 1]?.status || "No Status";
  };

  const incidentDetails = [
    {
      label: "Status",
      value: getLatestStatus(formData?.statusTimeline),
    },
    { label: "Priority", value: formData?.classificaton?.priorityLevel || "" },
    { label: "Subject", value: formData?.subject || "" },
    {
      label: "Support Dept.",
      value: formData?.classificaton?.supportDepartmentName || "",
    },
    {
      label: "Support Group",
      value: formData?.classificaton?.supportGroupName || "",
    },
    {
      label: "Logged Time",
      value: formData?.createdAt
        ? dayjs(formData.createdAt).format("DD MMM YYYY, hh:mm A")
        : "",
    },
    { label: "Email", value: formData?.submitter?.userEmail || "" },
    { label: "Asset", value: formData?.assetDetails?.asset || "" },
    { label: "Asset S.No.", value: formData?.assetDetails?.serialNo || "" },
    { label: "User", value: formData?.submitter?.user || "" },
    { label: "VIP User", value: userDets?.isVip ? "Yes" : "No" },
    { label: "Assigned To", value: formData?.classificaton?.technician || "" },
    {
      label: "Contact No.",
      value: formData?.submitter?.userContactNumber || "",
    },
    { label: "Category", value: formData?.category || "" },
  ];

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">
          Service Request ID - {id}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex flex-col gap-3 flex-1 h-full min-w-[600px]">
            <div className="flex flex-wrap bg-white p-4 rounded-lg shadow-md ">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-base text-gray-800 font-semibold mb-4">
                  Update Work Status(Service)
                </h3>
                <button className="px-3 py-2 bg-blue-500 text-white rounded-md shadow cursor-pointer hover:bg-blue-600">
                  <div className="flex flex-row items-center">
                    <MdOutlineSystemSecurityUpdateGood size={20} />
                    <span className="text-sm">Update</span>
                  </div>
                </button>
              </div>
              <div className="flex items-center w-[50%] max-lg:w-[100%]">
                <label
                  htmlFor="status"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Status
                </label>
                <select
                  className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  name="status"
                  id="status"
                  // value={formData.loggedVia}
                  // onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Work On Process">Work On Process</option>
                  <option value="Person Not Available">
                    Person Not Available
                  </option>
                  <option value="Part Not Avaitable">Part Not Avaitable</option>
                  <option value="Work Done">Work Done</option>
                </select>
              </div>
              <div className="flex items-center w-[50%] max-lg:w-[100%]">
                <label
                  htmlFor="comment"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Comment
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="comment"
                  name="comment"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-base font-semibold mb-4 text-gray-800">
                Closer Statement
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
              <button className="mt-4 px-3 py-2 bg-slate-500 text-white rounded-md shadow cursor-pointer hover:bg-slate-600">
                <div className="flex flex-row items-center">
                  <MdOutlineReply size={20} />
                  <span className="text-sm">Send</span>
                </div>
              </button>
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
};
export default UpdateServiceStatus;
