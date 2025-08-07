import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Autocomplete, Box, Button, IconButton } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import { FaDesktop } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getAllIncident } from "../../../api/IncidentRequest";
import {
  getAllServiceRequests,
  getServiceRequestStatusCounts,
  updateServiceRequest,
} from "../../../api/serviceRequest";
import { useSelector } from "react-redux";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { getAllUsers, getUserById } from "../../../api/AuthRequest";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});
const ticketOptions = ["All Tickets", "My Tickets"];

function ServiceRequest() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [changeStatus, setChangeStatus] = useState(false);
  const [seletecetdRowId, setSelectedRowId] = useState(null);
  const [selectDropDownValue, setSelectDropDownValue] = useState("");
  const [ticketType, setTicketType] = useState(ticketOptions[0]);
  const [selectedSupportDepartment, setSelectedSupportDepartment] =
    useState(null);
  const [selectedSupportGroup, setSelectedSupportGroup] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [supportDepartment, setSupportDepartment] = useState([]);
  const [supportGroup, setSupportGroup] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [onHoldComments, setOnHoldComments] = useState("");
  const [onHoldDept, setOnHoldDept] = useState("");
  const [onHoldRemarks, setOnHoldRemarks] = useState("");
  const [resolvedComments, setResolvedComments] = useState("");
  const [closureCode, setClosureCode] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchService = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllServiceRequests();
      setData(response?.data?.data || []);
      const countResponse = await getServiceRequestStatusCounts();
      // Convert object to array if needed
      let counts = countResponse?.data?.data;
      if (counts && !Array.isArray(counts)) {
        counts = [
          { id: "1", count: counts["New"] || 0, description: "New" },
          { id: "2", count: counts["Assigned"] || 0, description: "Assigned" },
          {
            id: "3",
            count: counts["In-Progress"] || 0,
            description: "In-Progress",
          },
          { id: "4", count: counts["Pause"] || 0, description: "Pause" },
          { id: "5", count: counts["Resolved"] || 0, description: "Resolved" },
          {
            id: "6",
            count: counts["Cancelled"] || counts["cancel"] || 0,
            description: "Cancelled",
          },
          {
            id: "7",
            count: counts["Reopened"] || counts["reopen"] || 0,
            description: "Reopened",
          },
          { id: "8", count: counts["Closed"] || 0, description: "Closed" },
          {
            id: "9",
            count: counts["Converted to SR"] || 0,
            description: "Converted to SR",
          },
          {
            id: "11",
            count: response?.data?.data?.length || 0,
            description: "Total",
          },
        ];
      }
      setCardData(counts || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, []);

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res?.data?.data || []);
    });
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [deptRes, groupRes, techRes] = await Promise.all([
        getAllSupportDepartment(),
        getAllSupportGroup(),
        getAllUsers(),
      ]);
      setSupportDepartment(deptRes?.data?.data || []);
      setSupportGroup(groupRes?.data?.data || []);
      setTechnician(Array.isArray(techRes?.data) ? techRes.data : []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  // console.log("data", data);
  //
  const filteredData = useMemo(() => {
    if (ticketType === "All Tickets") {
      return data;
    } else if (ticketType === "My Tickets") {
      return data.filter((item) => item.submitter?.userId === user?.userId);
    }
    return data;
  }, [data, ticketType, user?.userId]);

  //status
  const selectedRow = data.find((item) => item._id === seletecetdRowId);
  // console.log("selectedRow", selectedRow?._id); //use later

  // Helper to map select value to backend status
  const statusMap = {
    new: "New",
    approvalPending: "Approval Pending",
    provisioning: "Provisioning",
    assigned: "Assigned",
    inProgress: "In Progress",
    onHold: "On Hold",
    cancelled: "Cancelled",
    rejected: "Rejected",
    resolved: "Resolved",
    closed: "Closed",
    serviceToIncident: "Service To Incident",
    waitingForUpdate: "Waiting For Update",
  };

  const statusSubmitHandler = async (e) => {
    e.preventDefault();
    if (!seletecetdRowId || !selectDropDownValue) return;

    let updateData = {
      status: statusMap[selectDropDownValue] || selectDropDownValue,
      changedBy: user?.userId,
    };

    if (selectDropDownValue === "assigned") {
      updateData.classificaton = {
        supportDepartmentName:
          selectedSupportDepartment?.supportDepartmentName || "",
        supportGroupName: selectedSupportGroup?.supportGroupName || "",
        technician: selectedTechnician?._id || "",
      };
    }
    if (selectDropDownValue === "onHold") {
      updateData.comments = onHoldComments;
      updateData.onHoldDept = onHoldDept;
      updateData.remarks = onHoldRemarks;
    }
    if (selectDropDownValue === "resolved") {
      updateData.comments = resolvedComments;
      updateData.closureCode = closureCode;
    }

    try {
      await updateServiceRequest(seletecetdRowId, updateData);
      setChangeStatus(false);
      setSelectDropDownValue("");
      setSelectedSupportDepartment(null);
      setSelectedSupportGroup(null);
      setSelectedTechnician(null);
      setOnHoldComments("");
      setOnHoldDept("");
      setOnHoldRemarks("");
      setResolvedComments("");
      setClosureCode("");
      fetchService();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serviceId",
        header: "Service Req ID",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
      },
      {
        accessorKey: "submitter.user",
        header: "Submitter",
      },
      // {
      //   accessorKey: "classificaton.technician",
      //   header: "Assigned To",
      // },
      {
        accessorKey: "classificaton.technician",
        header: "Assigned To",
        Cell: ({ cell }) => {
          const technicianId = cell.getValue();
          const [email, setEmail] = React.useState(null);

          React.useEffect(() => {
            let isMounted = true;
            if (technicianId) {
              getUserById(technicianId)
                .then((res) => {
                  if (isMounted)
                    setEmail(res?.data?.emailAddress || technicianId);
                })
                .catch(() => {
                  if (isMounted) setEmail(technicianId);
                });
            }
            return () => {
              isMounted = false;
            };
          }, [technicianId]);

          return (
            <span
              style={{
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const res = await getUserById(technicianId);
                  setSelectedUser(res?.data);
                  setShowUserModal(true);
                } catch {
                  setSelectedUser(null);
                  setShowUserModal(false);
                }
              }}
            >
              {email || technicianId}
            </span>
          );
        },
      },
      // {
      //   accessorKey: "",
      //   header: "Approval",
      // },
      {
        accessorKey: "submitter.loggedInTime",
        header: "Logged Time",
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(cell.getValue()).toLocaleString("en-IN", {
                timeZone: "UTC",
              })
            : "",
      },
      // {
      //   accessorKey: "",
      //   header: "SLA",
      // },
      {
        header: "Status",
        accessorKey: "statusTimeline",
        Cell: ({ row }) => {
          const timeline = row.original.statusTimeline;
          if (!Array.isArray(timeline)) return "No Timeline";
          if (timeline.length === 0) return "No Status";
          const lastStatus = timeline[timeline.length - 1];
          return lastStatus.status || "No Status";
        },
      },

      // {
      //   accessorKey: "",
      //   header: "TAT",
      // },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() =>
              navigate(
                `/main/ServiceDesk/edit-service-request/${row.original._id}`
              )
            }
            color="primary"
            aria-label="edit"
          >
            <MdModeEdit />
          </IconButton>
        ),
      },
    ],
    [isLoading]
  );

  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

    const rowData = rows.map((row) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = row.original[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  const handleExportData = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

    const exportData = data.map((item) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = item[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(exportData);
    download(csvConfig)(csv);
  };

  const handlePdfData = () => {
    const excludedColumns = ["mrt-row-select", "edit", "delete"];

    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

    // Prepare headers for PDF
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    // Prepare data rows for PDF
    const exportData = data.map((item) =>
      visibleColumns.map((col) => {
        const key = col.id || col.accessorKey;
        let value = item[key];
        return value ?? "";
      })
    );

    const doc = new jsPDF({});
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });
    doc.save("Assets-Management-Components.pdf");
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box className="flex flex-wrap w-full">
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/main/ServiceDesk/new-service-request")}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
            }}
          >
            New
          </Button>
          <Autocomplete
            className="w-[15%]"
            sx={{
              ml: 2,
              mt: 1,
              mb: 1,
              "& .MuiInputBase-root": {
                borderRadius: "0.35rem",
                backgroundColor: "#f9fafb",
                fontSize: "0.85rem",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#94a3b8",
              },
            }}
            options={ticketOptions}
            value={ticketType}
            onChange={(_, newValue) =>
              setTicketType(newValue || ticketOptions[0])
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: "0.85rem", padding: "6px" },
                }}
              />
            )}
          />
          <Button
            variant="contained"
            size="small"
            disabled={table.getSelectedRowModel().rows.length !== 1}
            sx={{
              padding: "4px 12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 2,
              "&.Mui-disabled": {
                backgroundColor: "#B0BBE5",
                color: "#FFFFFF",
                cursor: "not-allowed",
              },
              opacity: table.getSelectedRowModel().rows.length !== 1 ? 0.5 : 1,
              cursor:
                table.getSelectedRowModel().rows.length !== 1
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() => {
              const selectedRow = table.getSelectedRowModel().rows[0];
              const id = selectedRow.original?._id;
              setSelectedRowId(id);
              setChangeStatus(true);
            }}
          >
            Change Status
          </Button>
          <Button
            onClick={handlePdfData}
            startIcon={<AiOutlineFilePdf />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export as PDF
          </Button>
          <Button
            onClick={handleExportData}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Selected Rows
          </Button>
        </Box>
      );
    },

    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: {
          captionSide: "top",
        },
      },
    },

    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 15],
      shape: "rounded",
      variant: "outlined",
    },
    enablePagination: true,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f1f5fa",
        color: "#303E67",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 1 ? "#f1f5fa" : "inherit",
      },
    }),
  });

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold mb-6 text-start">
            ALL SERVICE REQUESTS
          </h2>
          <button
            onClick={() => navigate("/main/dashboard/request")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-2 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span> View Dashboard</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {cardData.map((item) => (
            <div
              key={item?.id}
              className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
            >
              <h2 className="font-semibold text-xl text-blue-600 mb-1">
                {item.count}
              </h2>
              <span className="text-sm">{item.description}</span>
            </div>
          ))}
        </div>
        <MaterialReactTable table={table} />
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 animate-fade-in transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                User Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-gray-600">
                    {selectedUser.employeeName || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600 break-all">
                    {selectedUser.emailAddress || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Role</p>
                  <p className="text-gray-600">
                    {selectedUser.userRole || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Employee Code</p>
                  <p className="text-gray-600">
                    {selectedUser.employeeCode || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Contact Number</p>
                  <p className="text-gray-600">
                    {selectedUser.mobileNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Designation</p>
                  <p className="text-gray-600">
                    {selectedUser.designation || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {changeStatus && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
                <h2 className="text-md font-medium text-gray-800 mb-4">
                  CHANGE SERVICE REQUEST STATUS
                </h2>
                <form onSubmit={statusSubmitHandler} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-1">
                    <div className="flex items-center gap-2 mt-2">
                      <label className="w-[40%] text-sm font-medium text-gray-500">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectDropDownValue}
                        onChange={(e) => setSelectDropDownValue(e.target.value)}
                        className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="new">New</option>
                        <option value="approvalPending">
                          Approval Pending
                        </option>
                        <option value="provisioning">Provisioning</option>
                        <option value="assigned">Assigned</option>
                        <option value="inProgress">In Progress</option>
                        <option value="onHold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rejected">Rejected</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                        <option value="serviceToIncident">
                          Service To Incident
                        </option>
                        <option value="waitingForUpdate">
                          Waiting For Update
                        </option>
                      </select>
                    </div>
                    {selectDropDownValue === "assigned" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Department
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={supportDepartment}
                              getOptionLabel={(option) =>
                                option?.supportDepartmentName || ""
                              }
                              value={selectedSupportDepartment}
                              onChange={(_, newValue) =>
                                setSelectedSupportDepartment(newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Group<span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={supportGroup}
                              getOptionLabel={(option) =>
                                option?.supportGroupName || ""
                              }
                              value={selectedSupportGroup}
                              onChange={(_, newValue) =>
                                setSelectedSupportGroup(newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Technician<span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={technician.filter(
                                (t) => typeof t.emailAddress === "string"
                              )}
                              getOptionLabel={(option) =>
                                option?.employeeName && option?.emailAddress
                                  ? `${option.employeeName} (${option.emailAddress})`
                                  : option?.emailAddress || ""
                              }
                              value={selectedTechnician}
                              onChange={(_, newValue) =>
                                setSelectedTechnician(newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {selectDropDownValue === "onHold" && (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Comments
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                            value={onHoldComments}
                            onChange={(e) => setOnHoldComments(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Department
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={[
                                "Pending With Vendor / OEM",
                                "Pause With Other Reason",
                                "Standby Provided",
                              ]}
                              value={onHoldDept}
                              onChange={(_, newValue) =>
                                setOnHoldDept(newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Remarks<span className="text-red-500">*</span>
                          </label>
                          <textarea
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                            value={onHoldRemarks}
                            onChange={(e) => setOnHoldRemarks(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}
                    {selectDropDownValue === "resolved" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Comments
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={2}
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                            value={resolvedComments}
                            onChange={(e) =>
                              setResolvedComments(e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Closure Code<span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={[""]}
                              value={closureCode}
                              onChange={(_, newValue) =>
                                setClosureCode(newValue)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-6">
                    <button
                      type="submit"
                      className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangeStatus(false)}
                      className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ServiceRequest;
