import React, { useEffect, useState } from "react";
import "../../Table.css";
import { GoPlusCircle, GoTrash } from "react-icons/go";
import { createRule } from "../../../api/ConfigurationIncidentRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllSupportDepartment } from "../../../api/SuportDepartmentRequest";
import { Autocomplete, TextField } from "@mui/material";
import { getAllAssets } from "../../../api/AssetsRequest";
import { getAllLocation } from "../../../api/LocationRequest";
import { getAllSubCategory } from "../../../api/IncidentCategoryRequest";
import { NavLink } from "react-router-dom";

const AddRule = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [isLoading, setIsLoading] = useState(true);
  const [supportDepartment, setSupportDepartment] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [assetsData, setAssetsData] = useState([]);
  const [incidentSubCategoryData, setIncidentSubCategoryData] = useState([]);
  const [filteredSupportGroup, setFilteredSupportGroup] = useState([]);
  const [formData, setFormData] = useState({
    ruleName: "",
    priority: "",
    addConditions: [
      {
        condition: "condition-1",
        conditionValue: "",
        assetLocation: "",
        userLocation: "",
        assetCategory: "",
        asset: "",
        assetCriticality: "",
        incidentSubCategory: "",
      },
    ],
    assignTo: {
      supportDepartment: "",
      supportGroup: "",
      technician: "",
      severityLevel: "",
    },
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const res = await getAllSupportDepartment();
        setSupportDepartment(res?.data?.data || []);

        const locationResponse = await getAllLocation();
        setLocationData(locationResponse?.data?.data || []);

        const incidentSubCategoryResponse = await getAllSubCategory();
        setIncidentSubCategoryData(
          incidentSubCategoryResponse?.data?.data || []
        );

        const assetResponse = await getAllAssets();
        setAssetsData(assetResponse?.data?.data || []);
      } catch (error) {
        console.error("Error fetching support departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, []);

  useEffect(() => {
    const selectedDept = supportDepartment.find(
      (d) => d.supportDepartmentName === formData.assignTo.supportDepartment
    );
    setFilteredSupportGroup(selectedDept?.supportGroups || []);
  }, [formData.assignTo.supportDepartment, supportDepartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      assignTo: { ...prev.assignTo, [name]: value },
    }));
  };

  const handleConditionChange = (index, field, value) => {
    const updated = [...formData.addConditions];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, addConditions: updated }));
  };

  const handleAddCondition = () => {
    const nextIndex = formData.addConditions.length + 1;
    setFormData((prev) => ({
      ...prev,
      addConditions: [
        ...prev.addConditions,
        {
          condition: `condition-${nextIndex}`,
          conditionValue: "",
          assetLocation: "",
          userLocation: "",
          assetCategory: "",
          asset: "",
          assetCriticality: "",
          incidentSubCategory: "",
        },
      ],
    }));
  };

  const handleDeleteCondition = (indexToRemove) => {
    const updated = formData.addConditions
      .filter((_, i) => i !== indexToRemove)
      .map((cond, i) => ({ ...cond, condition: `condition-${i + 1}` }));
    setFormData((prev) => ({ ...prev, addConditions: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ruleName.trim() || !formData.priority.trim()) {
      toast.error("Rule Name and Priority are required.");
      return;
    }

    const finalData = { userId: user.userId, ...formData };

    try {
      await createRule(finalData);
      toast.success("Rule created successfully");
      setFormData({
        ruleName: "",
        priority: "",
        addConditions: [
          {
            condition: "condition-1",
            conditionValue: "",
            assetLocation: "",
            userLocation: "",
            assetCategory: "",
            asset: "",
            assetCriticality: "",
            incidentSubCategory: "",
          },
        ],
        assignTo: {
          supportDepartment: "",
          supportGroup: "",
          technician: "",
          severityLevel: "",
        },
      });
    } catch (error) {
      toast.error("Failed to create rule");
    }
  };

  const getConditionFieldValue = (condition, fieldName) => {
    const key = fieldName.replace(/\s/g, "");
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    return condition[camelKey] || "";
  };

  const setConditionFieldValue = (index, fieldName, value) => {
    const key = fieldName.replace(/\s/g, "");
    const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
    handleConditionChange(index, camelKey, value);
  };

  const getOptions = (type) => {
    switch (type) {
      case "Asset Location":
      case "User Location":
        return locationData.map((loc) => ({ label: loc.locationName }));
      case "Incident SubCategory":
        return incidentSubCategoryData.map((item) => ({
          label: item.subCategoryName,
        }));
      case "Asset":
        return assetsData.map((item) => ({
          label: item.assetInformation.assetTag,
        }));
      case "Asset Category":
        return [
          "IT Assets",
          "Laptop",
          "Monitor",
          "Printer",
          "Scanner",
          "Router",
          "Furniture",
          "Veichles",
          "Switch",
          "Machinery",
          "Others",
          "Electronics",
          "Modem",
          "Keyboard",
          "Mouse",
          "Storage Devices",
          "MacBook",
          "Smart Tv",
          "Mobile Phone",
          "UPS",
          "Desk",
          "File Cabinets",
          "Chairs",
          "Bookcases",
          "Sofa Sets",
          "Conference Speakers",
          "Coffee Machine",
          "Bag Scanner",
          "Desk Phones",
          "Fan",
          "Tool Kit",
          "Two Wheeler",
          "Four Wheeler",
          "Barcode Printer",
          "Projector",
          "Apple",
          "Medical Desk",
          "Patient Bed",
          "Printer + Scanner",
          "VC",
        ].map((label) => ({ label }));
      case "Asset Criticality":
        return ["Critical", "Non-Critical"].map((label) => ({ label }));
      default:
        return [];
    }
  };

  return (
    <div className="w-full h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
      <h2 className="text-slate-700 font-semibold">ADD NEW RULES</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="w-full p-8 bg-white rounded-md shadow-md pt-10">
          <div className="flex gap-2 justify-end">
            <button className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
              Submit
            </button>
            <NavLink
              to="/main/configuration/IncidentRules"
              className={({ isActive }) =>
                `hover:underline cursor-pointer ${
                  isActive ? "text-blue-400" : ""
                }`
              }
            >
              <button className="bg-[#F26E75] shadow-[#F26E75] shadow-md py-1.5 px-3 rounded-md text-sm text-white">
                Cancel
              </button>
            </NavLink>
          </div>
          <div className="flex flex-wrap gap-6 justify-between mt-3">
            {/* Rule Name */}
            <div className="flex items-center w-[46%]">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Rule Name
              </label>
              <input
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                name="ruleName"
                value={formData.ruleName}
                onChange={handleChange}
              />
            </div>

            {/* Priority */}
            <div className="flex items-center w-[46%]">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Priority
              </label>
              <input
                className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                type="text"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              />
            </div>

            {/* Add Condition Button */}
            <div className="w-full">
              <button
                type="button"
                onClick={handleAddCondition}
                className="flex items-center gap-2 bg-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white hover:bg-[#6c7bbf]"
              >
                <GoPlusCircle size={14} /> Add Condition
              </button>
            </div>

            {/* Conditions List */}
            {formData.addConditions.map((condition, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-6 border border-slate-200 p-3 rounded"
              >
                <div className="flex flex-wrap gap-6 w-full">
                  <div className="flex items-center min-w-[400px]">
                    <label className="text-xs font-semibold w-32 text-slate-600">
                      {condition.condition}
                    </label>
                    <select
                      className="w-full text-xs border-b-2 border-slate-300 p-2 outline-none"
                      value={condition.conditionValue}
                      onChange={(e) =>
                        handleConditionChange(
                          index,
                          "conditionValue",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select</option>
                      <option value="Asset Location">Asset Location</option>
                      <option value="User Location">User Location</option>
                      <option value="User is VIP">User is VIP</option>
                      <option value="Asset Category">Asset Category</option>
                      <option value="Asset">Asset</option>
                      <option value="Asset Criticality">
                        Asset Criticality
                      </option>
                      <option value="Incident SubCategory">
                        Incident SubCategory
                      </option>
                    </select>
                  </div>
                  {condition.conditionValue &&
                    condition.conditionValue !== "User is VIP" && (
                      <div className="flex items-center min-w-[400px]">
                        <label className="text-xs font-semibold w-32 text-slate-600">
                          {condition.conditionValue}
                        </label>
                        <Autocomplete
                          className="w-[65%]"
                          options={getOptions(condition.conditionValue)}
                          getOptionLabel={(option) => option.label || ""}
                          value={
                            {
                              label: getConditionFieldValue(
                                condition,
                                condition.conditionValue
                              ),
                            } || null
                          }
                          onChange={(e, newValue) =>
                            setConditionFieldValue(
                              index,
                              condition.conditionValue,
                              newValue?.label || ""
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              placeholder={`Select ${condition.conditionValue}`}
                              inputProps={{
                                ...params.inputProps,
                                style: { fontSize: "0.8rem" },
                              }}
                            />
                          )}
                        />
                      </div>
                    )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCondition(index)}
                  className="text-red-500 hover:text-red-700 ml-4"
                  title="Delete Condition"
                >
                  <GoTrash size={18} />
                </button>
              </div>
            ))}

            {/* Assignment Section */}
            <h3 className="text-sm text-[#303E67] font-semibold bg-[#F1F5FA] w-full p-2 mt-4">
              Assign To
            </h3>

            {/* Support Department */}
            <div className="flex items-center w-[46%]">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Support Department
              </label>
              <Autocomplete
                className="w-[65%]"
                options={supportDepartment}
                getOptionLabel={(option) => option.supportDepartmentName || ""}
                value={
                  supportDepartment.find(
                    (d) =>
                      d.supportDepartmentName ===
                      formData.assignTo.supportDepartment
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignTo: {
                      ...prev.assignTo,
                      supportDepartment: newValue?.supportDepartmentName || "",
                      supportGroup: "", // reset support group on department change
                    },
                  }));
                  setFilteredSupportGroup(newValue?.supportGroups || []);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Select Department"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>

            {/* Support Group */}
            <div className="flex items-center w-[46%] max-lg:w-full">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Support Group
              </label>
              <Autocomplete
                className="w-[65%]"
                options={filteredSupportGroup}
                getOptionLabel={(option) => option?.supportGroupName || ""}
                value={
                  filteredSupportGroup.find(
                    (subGroup) =>
                      subGroup.supportGroupName ===
                      formData.assignTo.supportGroup
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    assignTo: {
                      ...prev.assignTo,
                      supportGroup: newValue?.supportGroupName || "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Support Group"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>

            {/* Technician & Severity */}
            {[
              { id: "technician", label: "Technician" },
              {
                id: "severityLevel",
                label: "Severity Level",
                options: [
                  "Severity-1",
                  "Severity-2",
                  "Severity-3",
                  "Severity-4",
                ],
              },
            ].map((field) => (
              <div className="flex items-center w-[46%]" key={field.id}>
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  {field.label}
                </label>
                <select
                  className="w-[65%] text-xs border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                  name={field.id}
                  value={formData.assignTo[field.id]}
                  onChange={handleAssignChange}
                >
                  <option value="">{`Select ${field.label}`}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )) || <option value="N/A">N/A</option>}
                </select>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRule;
