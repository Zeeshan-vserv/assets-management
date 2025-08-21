import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSLA,
  getAllHolidayCalender,
  getSLAById,
  updateSLA,
} from "../../../api/slaRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

function EditSlaCreation() {
  const { id } = useParams();
  const user = useSelector((state) => state.authReducer.authData);
  const navigate = useNavigate();
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [isLoading, setIsLoading] = useState(true);
  // Controlled state for all fields
  const [formData, setFormData] = useState({
    slaName: "",
    holidayCalender: "",
    default: null,
    status: null,
    serviceWindow: null,
    slaTimeline: weekdays.map((day) => ({
      weekDay: day,
      // selected: false,
      startTime: "",
      endTime: "",
    })),
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [holidayCalender, setHolidayCalender] = useState([]);

  // const fetchData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await getSLAById(id);
  //     if (response.status !== 200) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     setFormData(response?.data || []);
  //     // setData(response);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getSLAById(id);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      const data = response?.data?.data || {};

      // Map fetched timeline to weekdays, fill blanks for missing days
      const timelineMap = {};
      if (Array.isArray(data.slaTimeline)) {
        data.slaTimeline.forEach((item) => {
          timelineMap[item.weekDay] = {
            weekDay: item.weekDay,
            selected: item.selected ?? true,
            startTime: item.startTime
              ? new Date(item.startTime).toISOString().substr(11, 5)
              : "",
            endTime: item.endTime
              ? new Date(item.endTime).toISOString().substr(11, 5)
              : "",
          };
        });
      }
      const mergedTimeline = weekdays.map(
        (day) =>
          timelineMap[day] || {
            weekDay: day,
            selected: false,
            startTime: "",
            endTime: "",
          }
      );

      setFormData({
        slaName: data.slaName || "",
        holidayCalender: data.holidayCalender || "",
        default:
          data.default === true ? "Yes" : data.default === false ? "No" : null,
        status:
          data.status === true ? "Yes" : data.status === false ? "No" : null,
        serviceWindow:
          data.serviceWindow === true
            ? "Yes"
            : data.serviceWindow === false
            ? "No"
            : null,
        slaTimeline: mergedTimeline,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchHolidayCalender = async () => {
    // Fetch holiday calendar from the API
    try {
      const response = await getAllHolidayCalender();
      if (response?.data?.success) {
        setHolidayCalender(response?.data?.data);
      } else {
        toast.error("Failed to fetch holiday calendar");
      }
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
      toast.error("Error fetching holiday calendar");
    }
  };
  useEffect(() => {
    fetchHolidayCalender();
  }, []);

  // For text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // For Autocomplete fields
  const handleAutoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // For SLA Timeline table
  const handleTimelineChange = (idx, field, value) => {
    setFormData((prev) => {
      const updatedTimeline = prev.slaTimeline.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      );
      return { ...prev, slaTimeline: updatedTimeline };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      userId: user.userId,
      default:
        formData.default === "Yes"
          ? true
          : formData.default === "No"
          ? false
          : null,
      status:
        formData.status === "Yes"
          ? true
          : formData.status === "No"
          ? false
          : null,
      serviceWindow:
        formData.serviceWindow === "Yes"
          ? true
          : formData.serviceWindow === "No"
          ? false
          : null,
      slaTimeline: formData.slaTimeline
        .filter((item) => item.startTime && item.endTime)
        .map(({ weekDay, startTime, endTime }) => ({
          weekDay,
          startTime: new Date(`1970-01-01T${startTime}:00Z`),
          endTime: new Date(`1970-01-01T${endTime}:00Z`),
        })),
    };
    const response = await updateSLA(id, payload);
    if (response?.data.success) {
      toast.success("SLA Updated successfully");
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-slate-700 font-semibold">NEW SLA</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="my-2 flex gap-2 justify-end">
              <button
                // type="submit"
                type="button"
                onClick={() => setShowConfirm(true)}
                className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => navigate("/main/configuration/sla-creation")}
                className="bg-[#df656b] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
              >
                Cancel
              </button>
              <ConfirmUpdateModal
                isOpen={showConfirm}
                onConfirm={handleSubmit}
                message="Are you sure you want to update SLA Creation?"
                onCancel={() => setShowConfirm(false)}
              />
            </div>
            <div className="flex flex-wrap max-lg:flex-col gap-6 justify-between mt-8">
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label
                  htmlFor="slaName"
                  className="w-[25%] text-xs font-semibold text-slate-600"
                >
                  SLA Name<span className="text-red-500 text-base">*</span>
                </label>
                <input
                  className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="slaName"
                  name="slaName"
                  value={formData.slaName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Holiday Calendar
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={holidayCalender}
                  getOptionLabel={(option) =>
                    option.holidayCalenderLocation || ""
                  }
                  required
                  value={
                    holidayCalender.find(
                      (val) =>
                        val.holidayCalenderLocation === formData.holidayCalender
                    ) || null
                  }
                  onChange={(event, value) =>
                    handleAutoChange(
                      "holidayCalender",
                      value.holidayCalenderLocation || ""
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Set as default
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  value={formData.default}
                  required
                  onChange={(_, value) => handleAutoChange("default", value)}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Active
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  required
                  options={["Yes", "No"]}
                  value={formData.status}
                  onChange={(_, value) =>
                    handleAutoChange("status", value || "")
                  }
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%] max-lg:w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Service Window (24x7)
                  <span className="text-red-500 text-base">*</span>
                </label>
                <Autocomplete
                  className="w-[65%]"
                  required
                  options={["Yes", "No"]}
                  value={formData.serviceWindow}
                  onChange={(_, value) =>
                    handleAutoChange("serviceWindow", value || "")
                  }
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-10 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 shadow-sm text-xs">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-2 border text-left  text-sm">Select</th>
                    <th className="p-2 border text-left text-sm">Weekday</th>
                    <th className="p-2 border text-left text-sm">From Time</th>
                    <th className="p-2 border text-left text-sm">To Time</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.slaTimeline.map((item, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="p-2 border text-start">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={item.selected}
                          onChange={(e) =>
                            handleTimelineChange(
                              idx,
                              "selected",
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <td className="p-2 border font-medium text-sm">
                        {item.weekDay}
                      </td>
                      <td className="p-2 border">
                        <div className="flex flex-row justify-between items-center gap-1">
                          <span>Select Time</span>
                          <input
                            type="time"
                            className="max:w-full w-[60%] shadow-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={item.startTime}
                            onChange={(e) =>
                              handleTimelineChange(
                                idx,
                                "startTime",
                                e.target.value
                              )
                            }
                            disabled={!item.selected}
                          />
                        </div>
                      </td>
                      <td className="p-2 border">
                        <div className="flex flex-row justify-between items-center gap-1">
                          <span>Select Time</span>
                          <input
                            type="time"
                            className="max:w-full w-[60%] shadow-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={item.endTime}
                            onChange={(e) =>
                              handleTimelineChange(
                                idx,
                                "endTime",
                                e.target.value
                              )
                            }
                            disabled={!item.selected}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSlaCreation;
