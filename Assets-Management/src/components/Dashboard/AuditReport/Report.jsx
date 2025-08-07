import React, { useState } from "react";
import {
  exportAssetReport,
  exportIncidentReport,
  exportServiceRequestReport,
} from "../../../api/DashboardRequest";

// User-friendly labels for columns
const columnLabels = {
  incidentId: "Incident ID",
  subject: "Subject",
  category: "Category",
  subCategory: "Sub Category",
  loggedVia: "Logged Via",
  description: "Description",
  status: "Status",
  sla: "SLA",
  tat: "TAT",
  feedback: "Feedback",
  attachment: "Attachment",
  "submitter.user": "Submitter Name",
  "submitter.userContactNumber": "Submitter Contact Number",
  "submitter.userEmail": "Submitter Email",
  "submitter.userDepartment": "Submitter Department",
  "submitter.loggedBy": "Logged By",
  "submitter.loggedInTime": "Logged In Time",
  "assetDetails.asset": "Asset",
  "assetDetails.make": "Asset Make",
  "assetDetails.model": "Asset Model",
  "assetDetails.serialNo": "Asset Serial No",
  "locationDetails.location": "Location",
  "locationDetails.subLocation": "Sub Location",
  "locationDetails.floor": "Floor",
  "locationDetails.roomNo": "Room No",
  "classificaton.severityLevel": "Severity Level",
  "classificaton.priorityLevel": "Priority Level",
  "classificaton.supportDepartmentName": "Support Department",
  "classificaton.supportGroupName": "Support Group",
  "classificaton.technician": "Technician",

  // Service Requests
  serviceId: "Service ID",
  requestDescription: "Request Description",
  catalogueDescription: "Catalogue Description",
  purchaseRequest: "Purchase Request",
  cost: "Cost",
  approval: "Approval",
  approver1: "Approver 1",
  approver2: "Approver 2",
  approver3: "Approver 3",
  "asset.asset": "Asset",
  "asset.make": "Asset Make",
  "asset.model": "Asset Model",
  "asset.serialNo": "Asset Serial No",
  "location.location": "Location",
  "location.subLocation": "Sub Location",

  // Assets
  assetId: "Asset ID",
  "assetInformation.category": "Category",
  "assetInformation.assetTag": "Asset Tag",
  "assetInformation.criticality": "Criticality",
  "assetInformation.make": "Make",
  "assetInformation.model": "Model",
  "assetInformation.serialNumber": "Serial Number",
  "assetInformation.expressServiceCode": "Express Service Code",
  "assetInformation.ipAddress": "IP Address",
  "assetInformation.operatingSystem": "Operating System",
  "assetInformation.cpu": "CPU",
  "assetInformation.hardDisk": "Hard Disk",
  "assetInformation.ram": "RAM",
  "assetInformation.assetImage": "Asset Image",
  "assetInformation.loggedTime": "Logged Time",
  "assetState.assetIsCurrently": "Asset Is Currently",
  "assetState.user": "User",
  "assetState.department": "Department",
  "assetState.subDepartment": "Sub Department",
  "assetState.comment": "Comment",
  "locationInformation.location": "Location",
  "locationInformation.subLocation": "Sub Location",
  "locationInformation.storeLocation": "Store Location",
  "warrantyInformation.vendor": "Vendor",
  "warrantyInformation.assetType": "Asset Type",
  "warrantyInformation.supportType": "Support Type",
  "financeInformation.poNo": "PO No",
  "financeInformation.poDate": "PO Date",
  "financeInformation.invoiceNo": "Invoice No",
  "financeInformation.invoiceDate": "Invoice Date",
  "financeInformation.assetCost": "Asset Cost",
  "financeInformation.residualCost": "Residual Cost",
  "financeInformation.assetLife": "Asset Life",
  "financeInformation.depreciation": "Depreciation",
  "financeInformation.hsnCode": "HSN Code",
  "financeInformation.costCenter": "Cost Center",
  "preventiveMaintenance.pmCycle": "PM Cycle",
  "preventiveMaintenance.schedule": "Schedule",
  "preventiveMaintenance.istPmDate": "IST PM Date",
};

const columnsMap = {
  incidents: [
    "incidentId",
    "subject",
    "category",
    "subCategory",
    "loggedVia",
    "description",
    "status",
    "sla",
    "tat",
    "feedback",
    "attachment",
    "submitter.user",
    "submitter.userContactNumber",
    "submitter.userEmail",
    "submitter.userDepartment",
    "submitter.loggedBy",
    "submitter.loggedInTime",
    "assetDetails.asset",
    "assetDetails.make",
    "assetDetails.model",
    "assetDetails.serialNo",
    "locationDetails.location",
    "locationDetails.subLocation",
    "locationDetails.floor",
    "locationDetails.roomNo",
    "classificaton.excludeSLA",
    "classificaton.severityLevel",
    "classificaton.priorityLevel",
    "classificaton.supportDepartmentName",
    "classificaton.supportGroupName",
    "classificaton.technician",
  ],
  serviceRequests: [
    "serviceId",
    "subject",
    "category",
    "subCategory",
    "requestDescription",
    "catalogueDescription",
    "purchaseRequest",
    "cost",
    "approval",
    "approver1",
    "approver2",
    "approver3",
    "submitter.user",
    "submitter.userEmail",
    "submitter.loggedBy",
    "submitter.loggedInTime",
    "asset.asset",
    "asset.make",
    "asset.model",
    "asset.serialNo",
    "location.location",
    "location.subLocation",
    "classificaton.excludeSLA",
    "classificaton.severityLevel",
    "classificaton.priorityLevel",
    "classificaton.supportDepartmentName",
    "classificaton.supportGroupName",
    "classificaton.technician",
  ],
  assets: [
    "assetId",
    "assetInformation.category",
    "assetInformation.assetTag",
    "assetInformation.criticality",
    "assetInformation.make",
    "assetInformation.model",
    "assetInformation.serialNumber",
    "assetInformation.expressServiceCode",
    "assetInformation.ipAddress",
    "assetInformation.operatingSystem",
    "assetInformation.cpu",
    "assetInformation.hardDisk",
    "assetInformation.ram",
    "assetInformation.assetImage",
    "assetInformation.loggedTime",
    "assetState.assetIsCurrently",
    "assetState.user",
    "assetState.department",
    "assetState.subDepartment",
    "assetState.comment",
    "locationInformation.location",
    "locationInformation.subLocation",
    "locationInformation.storeLocation",
    "warrantyInformation.vendor",
    "warrantyInformation.assetType",
    "warrantyInformation.supportType",
    "financeInformation.poNo",
    "financeInformation.poDate",
    "financeInformation.invoiceNo",
    "financeInformation.invoiceDate",
    "financeInformation.assetCost",
    "financeInformation.residualCost",
    "financeInformation.assetLife",
    "financeInformation.depreciation",
    "financeInformation.hsnCode",
    "financeInformation.costCenter",
    "preventiveMaintenance.pmCycle",
    "preventiveMaintenance.schedule",
    "preventiveMaintenance.istPmDate",
  ],
};

export default function Report() {
  const [type, setType] = useState("incidents");
  const [columns, setColumns] = useState(columnsMap.incidents);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);
    setColumns(columnsMap[selectedType]);
    setSelectedColumns([]);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedColumns([]);
      setSelectAll(false);
    } else {
      setSelectedColumns([...columns]);
      setSelectAll(true);
    }
  };

  const handleColumnChange = (col) => {
    if (selectedColumns.includes(col)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== col));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedColumns, col];
      setSelectedColumns(newSelected);
      if (newSelected.length === columns.length) setSelectAll(true);
    }
  };

  const handleDownload = async () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column.");
      return;
    }
    const filterWithDates = {
      ...filters,
      ...(fromDate && { from: fromDate }),
      ...(toDate && { to: toDate }),
    };

    let apiFunc, filename;
    if (type === "incidents") {
      apiFunc = exportIncidentReport;
      filename = "incidents_report.csv";
    } else if (type === "serviceRequests") {
      apiFunc = exportServiceRequestReport;
      filename = "service_requests_report.csv";
    } else if (type === "assets") {
      apiFunc = exportAssetReport;
      filename = "assets_report.csv";
    }

    try {
      const response = await apiFunc({
        filters: filterWithDates,
        columns: selectedColumns,
      });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      alert("An error occurred while downloading the report.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
        Generate Report
      </h1>

      {/* Report Type */}
      <div className="mb-6">
        <label className="block text-slate-700 font-medium mb-1">
          Report Type
        </label>
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="incidents">Incidents</option>
          <option value="serviceRequests">Service Requests</option>
          <option value="assets">Assets</option>
        </select>
      </div>

      {/* Columns */}
      <div className="mb-6">
        <label className="block text-slate-700 font-medium mb-2">
          Select Columns
        </label>
        <div className="mb-2">
          <label className="flex items-center text-sm text-gray-700 font-semibold">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2 accent-indigo-600"
            />
            Select All
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {columns.map((col) => (
            <label key={col} className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => handleColumnChange(col)}
                className="mr-2 accent-indigo-600"
              />
              {columnLabels[col] || col}
            </label>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-slate-700 font-medium mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Download Button */}
      <div className="text-right">
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-md shadow transition"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}