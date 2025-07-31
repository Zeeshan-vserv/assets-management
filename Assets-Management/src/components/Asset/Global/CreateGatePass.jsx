import React, { useEffect, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";
import { GoPlusCircle } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createGatePass } from "../../../api/GatePassRequest";
import { getAllGatePassAddress } from "../../../api/gatePassAddressRequest";
import { getAllUsers } from "../../../api/AuthRequest";
import { getAllAssets } from "../../../api/AssetsRequest";
import Chip from "@mui/material/Chip";

function CreateGatePass() {
  const user = useSelector((state) => state.authReducer.authData);

  const [attachmentType, setAttachmentType] = useState("");
  const [assetType, setAssetType] = useState("");
  const [showItemRow, setShowItemRow] = useState(false);
  const [gpAddress, setGpAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: "",
    serialNo: "",
    quantity: "",
  });
  const [fileData, setFileData] = useState(null);
  const [formData, setFormData] = useState({
    movementType: "",
    gatePassType: "",
    returnDate: "",
    fromAddress: "",
    toAddress: "",
    gatePassValidity: "",
    approvalRequired: "",
    approverLevel1: "",
    approverLevel2: "",
    approverLevel3: "",
    remarks: `1. The above products are not part of any commercial sale.
2. It is only an internal transfer.
3. The tentative value of the above products for the purpose of insurance for transit period can be ascertained at Rs 5,000/-
    `,
    reasonForGatePass: "",
    toReceiveBy: "",
    receiverNumber: "",
    // asset: "",
    asset: [],
    assetComponent: "",
    others: {
      itemName: "",
      quantity: "",
      description: "",
    },
    consumables: [
      {
        sNo: Number,
        itemName: "",
        serialNo: "",
        qty: Number,
      },
    ],
  });
  const [assetComponent, setAssetComponent] = useState("");
  const [userData, setUserData] = useState([]);
  const [assetData, setAssetData] = useState([]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      const responseLocation = await getAllGatePassAddress();
      // console.log(responseLocation?.data?.data || []);
      setGpAddress(responseLocation?.data?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDetails();
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

  const fetchGetAllAssetData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets();
      setAssetData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching asset data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchGetAllAssetData();
  }, []);

  console.log("assetData", assetData);

  // console.log(gpAddress);
  // const fetchGatePass = async () => {
  //   try {
  //     setIsLoading(true);
  //     // const response = await getUser(id);
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

  // useEffect(() => {
  //   fetchGatePass();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (newItem.itemName && newItem.quantity) {
      setItems((prev) => [
        ...prev,
        {
          ...newItem,
          id: Date.now(),
        },
      ]);
      setNewItem({
        itemName: "",
        serialNo: "",
        quantity: "",
      });
    }
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFormSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("userId", user?.userId);

      fd.append("movementType", formData.movementType);
      fd.append("gatePassType", formData.gatePassType);
      fd.append("expectedReturnDate", formData.returnDate);
      fd.append("fromAddress", formData.fromAddress);
      fd.append("toAddress", formData.toAddress);
      fd.append("gatePassValidity", formData.gatePassValidity);
      fd.append("approvalRequired", formData.approvalRequired);
      fd.append("approverLevel1", formData.approverLevel1);
      fd.append("approverLevel2", formData.approverLevel2);
      fd.append("approverLevel3", formData.approverLevel3);
      fd.append("remarks", formData.remarks);
      fd.append("reasonForGatePass", formData.reasonForGatePass);
      fd.append("toBeReceivedBy", formData.toReceiveBy);
      fd.append("receiverNo", formData.receiverNumber);
      fd.append("assetType", assetType);

      // Attach file if present
      if (attachmentType === "Yes" && fileData) {
        fd.append("attachment", fileData);
      }

      // Asset type specific fields
      if (assetType === "Consumables") {
        fd.append("consumables", JSON.stringify(items));
      }

      if (assetType === "Fixed Assets") {
        fd.append(
          "asset",
          JSON.stringify(
            formData.asset.map((a) => a.assetInformation.serialNumber)
          )
        );
      }
      if (assetType === "Asset Components") {
        fd.append("assetComponent", JSON.stringify(formData.assetComponent));
      }
      if (assetType === "Others") {
        fd.append("others", JSON.stringify(formData.others));
      }

      const res = await createGatePass(fd);
      if (res.data.success) {
        toast.success("Gate Pass created successfully!");
        // Optionally reset form here
      } else {
        toast.error(res.data.message || "Failed to create gate pass");
      }
    } catch (err) {
      toast.error("Error creating gate pass");
    }
  };

  return (
    <>
      <div className="w-[100%] h-[94vh] overflow-auto p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">NEW GATE PASS</h2>
        <form
          onSubmit={handleFormSubmitHandler}
          className="flex flex-col w-full p-8 bg-white rounded-md shadow-sm"
        >
          <div className="flex gap-3 justify-end">
            <button
              type="submit"
              className="bg-[#8092D1] shadow-[#8092D1] shadow-md py-1.5 px-3 rounded-md text-sm text-white"
            >
              Submit
            </button>
            <NavLink
              to="/main/Asset/GatePassData"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4 mt-4 mb-8">
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Movement Type
              </label>
              <Autocomplete
                className="w-[65%]"
                name="movementType"
                value={formData.movementType}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, movementType: value }))
                }
                options={[
                  "Floor Movement",
                  "Building Movement",
                  "Store Movement",
                  "To Repair",
                  "Office Movement",
                ]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Movement Type"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Gate Pass Type
              </label>
              <Autocomplete
                className="w-[65%]"
                name="gatePassType"
                value={formData.gatePassType}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, gatePassType: value }))
                }
                options={["Returnable", "Non-Returnable"]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Gate Pass Type"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Expected Date of Return
              </label>
              <input
                type="date"
                name="returnDate"
                // value={formData.returnDate}
                value={
                  formData.gatePassType === "Returnable"
                    ? formData.returnDate
                    : ""
                }
                onChange={handleChange}
                disabled={formData.gatePassType === "Non-Returnable"}
                placeholder="mm/dd/yyyy"
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                From Address
              </label>
              <Autocomplete
                className="w-[65%]"
                name="fromAddress"
                options={gpAddress.map((addr) => addr.addressName)}
                value={formData.fromAddress || ""}
                onChange={(e, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    fromAddress: value || "",
                  }))
                }
                getOptionLabel={(option) => option || ""}
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
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Gate Pass Validity
              </label>
              <input
                type="date"
                name="gatePassValidity"
                value={formData.gatePassValidity}
                onChange={handleChange}
                placeholder="mm/dd/yyyy"
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Approval Required
              </label>
              <Autocomplete
                className="w-[65%]"
                name="approvalRequired"
                value={formData.approvalRequired}
                onChange={(e, value) =>
                  setFormData((prev) => ({ ...prev, approvalRequired: value }))
                }
                options={["Yes", "No"]}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder="Select Approval"
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {formData.approvalRequired === "Yes" && (
              <>
                <div className="flex flex-row gap-2">
                  <label className="w-[25%] text-xs font-semibold text-slate-600">
                    Approver (Level 1)
                  </label>
                  <Autocomplete
                    className="w-[65%]"
                    options={userData}
                    value={
                      userData.find(
                        (user) => user.emailAddress === formData.approverLevel1
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        approverLevel1: newValue?.emailAddress || "",
                      }))
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
                <div className="flex flex-row">
                  <label className="w-[25%] text-xs font-semibold text-slate-600">
                    Approver (Level 2)
                  </label>
                  <Autocomplete
                    className="w-[65%]"
                    options={userData}
                    value={
                      userData.find(
                        (user) => user.emailAddress === formData.approverLevel2
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        approverLevel2: newValue?.emailAddress || "",
                      }))
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
                <div className="flex flex-row gap-2">
                  <label className="w-[25%] text-xs font-semibold text-slate-600">
                    Approver (Level 3)
                  </label>
                  <Autocomplete
                    className="w-[65%]"
                    options={userData}
                    value={
                      userData.find(
                        (user) => user.emailAddress === formData.approverLevel3
                      ) || null
                    }
                    onChange={(e, newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        approverLevel3: newValue?.emailAddress || "",
                      }))
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
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                To Address
              </label>
              <input
                type="text"
                name="toAddress"
                value={formData.toAddress}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={5}
                className="w-[65%] text-xs text-slate-600 border-2 rounded-md border-slate-300 p-2 outline-none"
              ></textarea>
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Reason for Gate Pass
              </label>
              <textarea
                name="reasonForGatePass"
                value={formData.reasonForGatePass}
                onChange={handleChange}
                rows={5}
                className="w-[65%] text-xs text-slate-600 border-2 rounded-md border-slate-300 p-2 outline-none"
              ></textarea>
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                To be received by
              </label>
              <input
                type="text"
                name="toReceiveBy"
                value={formData.toReceiveBy}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Receiver Number
              </label>
              <input
                type="text"
                name="receiverNumber"
                value={formData.receiverNumber}
                onChange={handleChange}
                className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none"
              />
            </div>
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Attachment
              </label>
              <Autocomplete
                className="w-[65%]"
                options={["Yes", "No"]}
                value={attachmentType}
                onChange={(e, value) => {
                  setAttachmentType(value || "");
                  if (value !== "Yes") setFileData(null);
                }}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className="text-xs text-slate-600"
                    placeholder=""
                    inputProps={{
                      ...params.inputProps,
                      style: { fontSize: "0.8rem" },
                    }}
                  />
                )}
              />
            </div>
            {attachmentType === "Yes" && (
              <div className="flex flex-row gap-2">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={fileChangeHandler}
                  className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-1 outline-none"
                />
              </div>
            )}
            <div className="flex flex-row gap-2">
              <label className="w-[25%] text-xs font-semibold text-slate-600">
                Asset Type
              </label>
              <Autocomplete
                className="w-[65%]"
                options={[
                  "Consumables",
                  "Fixed Assets",
                  "Asset Components",
                  "Others",
                ]}
                value={assetType}
                onChange={(e, value) => {
                  setAssetType(value || "");
                  setItems([]);
                }}
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
            {assetType === "Fixed Assets" && (
              <div className="flex flex-row gap-2">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Asset
                </label>
                <Autocomplete
                  className="w-[65%]"
                  multiple
                  options={assetData}
                  value={formData.asset}
                  onChange={(e, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      asset: newValue,
                    }))
                  }
                  getOptionLabel={(option) =>
                    option?.assetInformation
                      ? `${option.assetInformation.assetTag || ""} / ${
                          option.assetInformation.serialNumber || ""
                        }`
                      : ""
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
            )}

            {assetType === "Asset Components" && (
              <div className="flex flex-row gap-2">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Asset Components
                </label>
                <Autocomplete
                  className="w-[65%]"
                  options={assetData}
                  value={
                    assetData.find(
                      (asset) =>
                        asset?.assetInformation?.assetTag ===
                          formData.assetComponent?.assetTag &&
                        asset?.assetInformation?.serialNumber ===
                          formData.assetComponent?.serialNumber
                    ) || null
                  }
                  onChange={(e, newValue) =>
                    setFormData((prev) => ({
                      ...prev,
                      assetComponent: newValue
                        ? {
                            assetTag: newValue.assetInformation?.assetTag || "",
                            serialNumber:
                              newValue.assetInformation?.serialNumber || "",
                          }
                        : { assetTag: "", serialNumber: "" },
                    }))
                  }
                  getOptionLabel={(option) =>
                    option?.assetInformation
                      ? `${option.assetInformation.assetTag || ""} / ${
                          option.assetInformation.serialNumber || ""
                        }`
                      : ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      className="text-xs text-slate-600"
                      placeholder="Select Asset Component"
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
          {assetType === "Others" && (
            <div className="flex flex-wrap gap-14 justify-between mt-3">
              <div className="flex items-center w-[46%] max-md:w-[100%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.others.itemName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      others: { ...prev.others, itemName: e.target.value },
                    }))
                  }
                  className="w-[70%] text-xs text-slate-600 border-b-2 border-slate-300 p-1 outline-none"
                />
              </div>
              <div className="flex items-center w-[46%] max-md:w-[100%]">
                <label className="w-[28%] text-xs font-semibold text-slate-600">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.others.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      others: { ...prev.others, quantity: e.target.value },
                    }))
                  }
                  className="w-[70%] text-xs text-slate-600 border-b-2 border-slate-300 p-1 outline-none"
                />
              </div>
              <div className="flex flex-row flex-wrap gap-4 w-[100%]">
                <label className="w-[25%] text-xs font-semibold text-slate-600">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.others.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      others: { ...prev.others, description: e.target.value },
                    }))
                  }
                  rows={4}
                  className="w-[97%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none"
                ></textarea>
              </div>
            </div>
          )}
          {assetType === "Consumables" && (
            <div className="mt-4">
              <Button
                onClick={() => setShowItemRow(true)}
                variant="contained"
                size="small"
                startIcon={<GoPlusCircle />}
                sx={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  textTransform: "none",
                  mb: 2,
                }}
              >
                New
              </Button>
              <table className="w-full text-sm text-left border max-md:overflow-x-auto">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-2 border">S.No.</th>
                    <th className="p-2 border">Item Name</th>
                    <th className="p-2 border">Serial No.</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {showItemRow && (
                    <tr>
                      <td className="p-2 border">1</td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          name="itemName"
                          value={newItem.itemName}
                          onChange={handleNewItemChange}
                          className="w-full border-b outline-none text-xs"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="text"
                          name="serialNo"
                          value={newItem.serialNo}
                          onChange={handleNewItemChange}
                          className="w-full border-b outline-none text-xs"
                        />
                      </td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          name="quantity"
                          value={newItem.quantity}
                          onChange={handleNewItemChange}
                          className="w-full border-b outline-none text-xs"
                          placeholder="Qty"
                        />
                      </td>
                      <td className="p-2 border flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (newItem.itemName && newItem.quantity) {
                              setItems([
                                ...items,
                                {
                                  ...newItem,
                                  id: Date.now(),
                                  sNo: items.length + 1,
                                  qty: Number(newItem.quantity),
                                },
                              ]);
                              setNewItem({
                                itemName: "",
                                serialNo: "",
                                quantity: "",
                              });
                              setShowItemRow(false);
                            }
                          }}
                          className="bg-indigo-100 text-indigo-600 rounded-full p-1"
                        >
                          <FaCheck size={22} />
                        </button>
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 rounded-full p-1"
                          onClick={() => setShowItemRow(false)}
                        >
                          <RxCross2 size={22} />
                        </button>
                      </td>
                    </tr>
                  )}
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td className="p-2 border">{item.sNo}</td>
                      <td className="p-2 border">{item.itemName}</td>
                      <td className="p-2 border">{item.serialNo}</td>
                      <td className="p-2 border">{item.qty}</td>
                      <td className="p-2 border">
                        <button
                          type="button"
                          className="bg-red-100 text-red-600 rounded-full p-1"
                          onClick={() => removeItem(item.id)}
                        >
                          <RxCross2 size={22} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default CreateGatePass;
