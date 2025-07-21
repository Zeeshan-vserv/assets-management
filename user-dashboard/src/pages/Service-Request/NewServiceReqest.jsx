import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { createServiceRequest } from "../../api/ServiceRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllServiceCategory,
  getAllServiceSubCategory,
} from "../../api/globalServiceRequest";
import { getAllUsers } from "../../api/UserAuth";

function NewServiceReqest() {
  const user = useSelector((state) => state.authReducer.authData);
  const userId = user?.userId;
  const [serviceCategoryData, setServiceCategoryData] = useState([]);
  const [serviceSubCategoryData, setServiceSubCategoryDta] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseRequired, setPurchaseRequired] = useState("");
  const [approvalRequired, setApprovalRequired] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subCategory: "",
    requestDescription: "",
    purchaseRequest: false,
    cost: "",
    approval: false,
    approver1: "",
    approver2: "",
    approver3: "",
  });

  const fetchServiceCategoryData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllServiceCategory();
      if (response?.data?.data) {
        setServiceCategoryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceCategoryData();
  }, []);

  const fetchServiceSubCategoryData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllServiceSubCategory();
      if (response?.data?.data) {
        setServiceSubCategoryDta(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceSubCategoryData();
  }, []);

  const fetchGetAllUsersData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      if (response?.data) {
        setUserData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching service request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGetAllUsersData();
  }, []);

  console.log("userData", userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cost" ? Number(value) : value,
    }));
  };

  const handleAutoChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handlePurchaseRequired = (e, value) => {
    setPurchaseRequired(value);
    setFormData((prev) => ({
      ...prev,
      purchaseRequest: value === "Yes",
    }));
  };

  const handleApprovalRequired = (e, value) => {
    setApprovalRequired(value);
    setFormData((prev) => ({
      ...prev,
      approval: value === "Yes",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDatas = { ...formData, userId };
      const response = await createServiceRequest(formDatas);
      if (response?.data?.success) {
        toast.success("Service Request created successfully");
      }
      setFormData({
        title: "",
        category: "",
        subCategory: "",
        requestDescription: "",
        purchaseRequest: false,
        cost: "",
        approval: false,
        approver1: "",
        approver2: "",
        approver3: "",
      });
    } catch (error) {
      console.log("Error Creating in Service Request");
    }
  };

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">
          NEW SERVICE REQUEST
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="w-full p-8 bg-white rounded-md shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-6 mt-6">
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor="subject"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Subject
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter Subject"
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor="category"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Category
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={serviceCategoryData}
                  value={
                    serviceCategoryData.find(
                      (cat) => cat.categoryName === formData.category
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    handleAutoChange("category", newValue?.categoryName)
                  }
                  getOptionLabel={(option) => option.categoryName || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Select Category"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor="subCategory"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Sub Category
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={serviceSubCategoryData}
                  value={
                    serviceSubCategoryData.find(
                      (cat) => cat.subCategoryName === formData.subCategory
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    handleAutoChange("subCategory", newValue?.subCategoryName)
                  }
                  getOptionLabel={(option) => option.subCategoryName || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Select Sub Category"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-wrap gap-3 items-center w-[100%]">
                <label
                  htmlFor="requestDescription"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Description
                </label>
                <textarea
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  id="requestDescription"
                  name="requestDescription"
                  value={formData.requestDescription}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Enter Description"
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Purchase Required
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  value={purchaseRequired}
                  onChange={handlePurchaseRequired}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select Purchase Required"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label
                  htmlFor="cost"
                  className="w-[28%] text-xs font-semibold text-slate-600"
                >
                  Cost
                </label>
                <input
                  className="w-[65%] text-sm text-slate-800 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Enter Cost"
                />
              </div>
              <div className="flex items-center w-[46%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Approval Required
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={["Yes", "No"]}
                  value={approvalRequired}
                  onChange={handleApprovalRequired}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select Approval Required"
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </div>
              {formData.approval && (
                <>
                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approval (Level-1)
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={userData}
                      value={
                        userData.find(
                          (user) => user.emailAddress === formData.approver1
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        handleAutoChange("approver1", newValue?.emailAddress)
                      }
                      getOptionLabel={(option) => option?.emailAddress || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select Approver Level-1"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approval (Level-2)
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={userData}
                      value={
                        userData.find(
                          (user) => user.emailAddress === formData.approver2
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        handleAutoChange("approver2", newValue?.emailAddress)
                      }
                      getOptionLabel={(option) => option?.emailAddress || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select Approver Level-2"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center w-[46%]">
                    <label className="w-[28%] text-xs font-semibold text-slate-600">
                      Approval (Level-3)
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={userData}
                      value={
                        userData.find(
                          (user) => user.emailAddress === formData.approver3
                        ) || null
                      }
                      onChange={(e, newValue) =>
                        handleAutoChange("approver3", newValue?.emailAddress)
                      }
                      getOptionLabel={(option) => option?.emailAddress || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select Approver Level-3"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="my-2 flex justify-end gap-2 mt-6">
              <button
                type="submit"
                className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md py-1.5 px-3 rounded-md text-sm text-white cursor-pointer"
              >
                Submit
              </button>
              <NavLink
                to="/service-request"
                className={({ isActive }) =>
                  `hover:underline cursor-pointer ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
              >
                <button className="bg-[#df656b] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white cursor-pointer">
                  Cancel
                </button>
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewServiceReqest;
