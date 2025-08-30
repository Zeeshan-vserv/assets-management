import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { NavLink } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import {
  getAllIncident,
  getIncidentStatusCounts,
  updateIncident,
  getAllIncidentsSla,
  getAllIncidentsTat,
} from "../../../api/IncidentRequest";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { getAllUsers, getUserById } from "../../../api/AuthRequest";
import { useSelector } from "react-redux";
import IncidentTimeline from "../TicketHistory/IncidentTimeline"; // or IncidentHistoryResponsive if you want the full card

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const ticketOptions = ["All Tickets", "My Tickets"];
const IncidentsData = () => {
  const currentUserId = useSelector(
    (state) => state.authReducer.authData?.userId
  );
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);
  const [seletecetdRowId, setSelectedRowId] = useState(null);
  const [assignedValue, setAssignedValue] = useState("");
  const [reopenValue, setReOpenValue] = useState("");
  const [inProgressValue, setInProgressValue] = useState("");
  const [selectedSupportDepartment, setSelectedSupportDepartment] =
    useState(null);
  const [selectedSupportGroup, setSelectedSupportGroup] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [supportDepartment, setSupportDepartment] = useState([]);
  const [supportGroup, setSupportGroup] = useState([]);
  const [technician, setTechnician] = useState([]);
  const [allSla, setAllSla] = useState([]);
  const [allTat, setAllTat] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [ticketType, setTicketType] = useState(ticketOptions[0]);
  const [timelineIncident, setTimelineIncident] = useState(null);

  const fetchDepartment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllIncident();
      setData(response?.data?.data || []);
      const countResponse = await getIncidentStatusCounts();
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

  // Fetch dropdowns
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

  // Fetch SLA/TAT
  const fetchSlaTat = useCallback(async () => {
    try {
      const [slaRes, tatRes] = await Promise.all([
        getAllIncidentsSla(),
        getAllIncidentsTat(),
      ]);
      setAllSla(slaRes?.data?.data || []);
      setAllTat(tatRes?.data?.data || []);
    } catch (error) {
      console.error("Error fetching SLA/TAT data:", error);
    }
  }, []);

  // Effects

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res?.data?.data || []);
    });
  }, []);
  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);
  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);
  useEffect(() => {
    fetchSlaTat();
  }, [fetchSlaTat]);

  // Update support group when department changes
  useEffect(() => {
    if (selectedSupportDepartment?.supportGroups) {
      setSupportGroup(selectedSupportDepartment.supportGroups);
      setSelectedSupportGroup(null);
    } else {
      setSupportGroup([]);
      setSelectedSupportGroup(null);
    }
  }, [selectedSupportDepartment]);

  // Selected row and status
  const selectedRow = data.find((item) => item._id === seletecetdRowId);
  const latestStatus = selectedRow?.statusTimeline?.at(-1)?.status || "";

  // Status update handler
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!seletecetdRowId) return;

    let updateData = {};
    if (latestStatus === "New" && assignedValue === "Assigned") {
      updateData = {
        status: "Assigned",
        changedBy: currentUserId,
        classificaton: {
          supportDepartmentName:
            selectedSupportDepartment?.supportDepartmentName || "",
          supportGroupName: selectedSupportGroup?.supportGroupName || "",
          technician: selectedTechnician?._id || "",
        },
      };
    } else if (
      latestStatus === "In Progress" &&
      inProgressValue === "Assigned"
    ) {
      updateData = {
        status: "Assigned",
        changedBy: currentUserId,
        classificaton: {
          supportDepartmentName:
            selectedSupportDepartment?.supportDepartmentName || "",
          supportGroupName: selectedSupportGroup?.supportGroupName || "",
          technician: selectedTechnician?._id || "",
        },
      };
    } else if (latestStatus === "In Progress" && inProgressValue) {
      updateData = {
        status: inProgressValue,
        changedBy: currentUserId,
      };
    } else if (latestStatus === "Resolved" && reopenValue) {
      updateData = {
        status: reopenValue,
        changedBy: currentUserId,
      };
    } else {
      updateData = {
        status: assignedValue || inProgressValue || reopenValue || "",
        changedBy: currentUserId,
      };
    }

    try {
      await updateIncident(seletecetdRowId, updateData);
      setChangeStatus(false);
      fetchDepartment();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Filter data based on ticketType
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (ticketType === "All Tickets") {
      return data;
    } else if (ticketType === "My Tickets") {
      return data.filter((item) => item.submitter?.userId === user?.userId);
    }
    return data;
  }, [data, ticketType, user?.userId]);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "incidentId", header: "Incident ID" },
      {
        header: "Status",
        accessorKey: "statusTimeline",
        Cell: ({ row }) => {
          const timeline = row.original.statusTimeline;
          const status =
            Array.isArray(timeline) && timeline.length > 0
              ? timeline[timeline.length - 1]?.status
              : "No Status";
          return (
            <span
              style={{
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 500,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setTimelineIncident(row.original);
              }}
              title="View Timeline"
            >
              {status}
            </span>
          );
        },
      },
      { accessorKey: "subject", header: "Subject" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "subCategory", header: "Sub Category" },
      {
        accessorKey: "userId",
        header: "Submitter",
        Cell: ({ cell }) => {
          const userId = cell.getValue();
          const [email, setEmail] = React.useState(null);

          React.useEffect(() => {
            let isMounted = true;
            if (userId) {
              getUserById(userId)
                .then((res) => {
                  if (isMounted) setEmail(res?.data?.emailAddress || userId);
                })
                .catch(() => {
                  if (isMounted) setEmail(userId);
                });
            }
            return () => {
              isMounted = false;
            };
          }, [userId]);

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
                  const res = await getUserById(userId);
                  setSelectedUser(res?.data);
                  setShowUserModal(true);
                } catch {
                  setSelectedUser(null);
                  setShowUserModal(false);
                }
              }}
            >
              {email || userId}
            </span>
          );
        },
      },
      { accessorKey: "assetDetails.asset", header: "Asset Id" },
      { accessorKey: "locationDetails.location", header: "Location" },
      { accessorKey: "locationDetails.subLocation", header: "Sub Location" },
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
      { accessorKey: "classificaton.severityLevel", header: "Severity" },
      // { accessorKey: "classificaton.technician", header: "Assigned To" },
      // {
      //   accessorKey: "classificaton.technician",
      //   header: "Assigned To",
      //   Cell: ({ cell }) => {
      //     const technicianId = cell.getValue();
      //     const technicianUser = allUsers.find((u) => u._id === technicianId);
      //     return (
      //       <span
      //         style={{
      //           color: "#2563eb",
      //           cursor: "pointer",
      //           textDecoration: "underline",
      //         }}
      //         onClick={async (e) => {
      //           e.stopPropagation();
      //           try {
      //             const res = await getUserById(technicianId);
      //             setSelectedUser(res?.data);
      //             setShowUserModal(true);
      //           } catch {
      //             setSelectedUser(null);
      //             setShowUserModal(false);
      //           }
      //         }}
      //       >
      //         {technicianUser
      //           ? technicianUser.employeeName || technicianUser.emailAddress
      //           : technicianId}
      //       </span>
      //     );
      //   },
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
      {
        accessorKey: "sla",
        header: "SLA",
        Cell: ({ row }) => {
          const id = row.original._id;
          const slaObj = allSla.find((item) => String(item._id) === String(id));
          if (!slaObj) return <span style={{ fontWeight: "bold" }}>...</span>;
          const breached = slaObj.slaRawMinutes < 0;
          const color = breached ? "red" : "green";
          const prefix = breached ? "-" : "";
          const formattedSla = slaObj.sla.replace(/^-/, "");
          return (
            <span style={{ fontWeight: "bold", color }}>
              {prefix}
              {formattedSla}
            </span>
          );
        },
      },
      {
        accessorKey: "tat",
        header: "TAT",
        Cell: ({ row }) => {
          const id = row.original._id;
          const tatObj = allTat.find((item) => String(item._id) === String(id));
          return (
            <span style={{ fontWeight: "bold" }}>
              {tatObj ? tatObj.tat : "..."}
            </span>
          );
        },
      },
      {
        accessorKey: "classificaton.supportDepartmentName",
        header: "Support Department",
      },
      {
        accessorKey: "classificaton.supportGroupName",
        header: "Support Group",
      },
      { accessorKey: "feedback", header: "Feedback Available" },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/ServiceDesk/EditIncident/${row.original._id}`}>
              <MdModeEdit />
            </NavLink>
          </IconButton>
        ),
      },
    ],
    [isLoading, allTat, allSla]
  );

  // Export helpers
  const getVisibleColumns = () =>
    table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

  const handleExportRows = (rows) => {
    const visibleColumns = getVisibleColumns();
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
    const visibleColumns = getVisibleColumns();
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
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);
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

  // Table instance
  const table = useMaterialReactTable({
    data: filteredData,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box className="flex flex-wrap w-full">
        <NavLink to="/main/ServiceDesk/NewIncident">
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
            }}
          >
            New Incident
          </Button>
        </NavLink>
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
    ),
    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: { captionSide: "top" },
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
    <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
      <h2 className="text-lg font-semibold mb-6 text-start">INCIDENT DATA</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {cardData.map((item) => (
          <div
            key={item.id}
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

      {/* Timeline Modal */}
      {timelineIncident && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 animate-fade-in transition-all duration-300 relative">
            <button
              onClick={() => setTimelineIncident(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-blue-600 text-2xl font-bold"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Incident Timeline: {timelineIncident.incidentId}
            </h2>
            {/* You can use IncidentTimeline or IncidentHistoryResponsive here */}
            <IncidentTimeline
  timeline={timelineIncident.statusTimeline}
  title="Incident Timeline"
/>
          </div>
        </div>
      )}

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
                <p className="text-gray-600">{selectedUser.userRole || "-"}</p>
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
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
            {latestStatus === "Assigned" ? (
              <>
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-xl px-6 py-6 flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-blue-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="#dbeafe"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M16 24l6 6 10-12"
                      />
                    </svg>
                    <h3 className="text-2xl font-bold text-blue-700 mb-2 text-center">
                      Ticket Already Assigned
                    </h3>
                    <p className="text-blue-700 text-center">
                      This incident is already assigned to a technician.
                      <br />
                      You cannot assign it again.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChangeStatus(false)}
                    className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-md font-medium text-gray-800 mb-4">
                  CHANGE INCIDENT STATUS
                </h2>
                <form onSubmit={handleStatusUpdate} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-1">
                    {latestStatus === "New" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={assignedValue}
                            onChange={(e) => setAssignedValue(e.target.value)}
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                          >
                            <option value="" className="text-start">
                              Select
                            </option>
                            <option value="Assigned" className="text-start">
                              Assigned
                            </option>
                            <option value="cancel" className="text-start">
                              Cancel
                            </option>
                          </select>
                        </div>
                        {assignedValue === "Assigned" && (
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
                                  onChange={(event, newValue) =>
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
                                Support Group
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="w-[60%]">
                                <Autocomplete
                                  options={supportGroup}
                                  getOptionLabel={(option) =>
                                    option?.supportGroupName || ""
                                  }
                                  value={selectedSupportGroup}
                                  onChange={(event, newValue) =>
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
                                Technician
                                <span className="text-red-500">*</span>
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
                                  onChange={(event, newValue) =>
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
                      </>
                    )}
                    {latestStatus === "Resolved" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={reopenValue}
                            onChange={(e) => setReOpenValue(e.target.value)}
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                          >
                            <option value="" className="text-start">
                              Select status
                            </option>
                            <option value="reopen" className="text-start">
                              reopen
                            </option>
                          </select>
                        </div>
                        {reopenValue === "reopen" && (
                          <div className="flex items-center gap-2 mt-2">
                            <label className="w-[40%] text-sm font-medium text-gray-500">
                              Reason for Reopen
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"></textarea>
                          </div>
                        )}
                      </>
                    )}
                    {latestStatus === "In Progress" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={inProgressValue}
                            onChange={(e) => setInProgressValue(e.target.value)}
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                          >
                            <option value="" className="text-start">
                              Select Status
                            </option>
                            <option value="Assigned" className="text-start">
                              Assigned
                            </option>
                            <option value="pause" className="text-start">
                              Pause
                            </option>
                            <option value="resolved" className="text-start">
                              Resolved
                            </option>
                            <option value="cancel" className="text-start">
                              Cancel
                            </option>
                          </select>
                        </div>
                        {inProgressValue === "Assigned" && (
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
                                  onChange={(event, newValue) =>
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
                                Support Group
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="w-[60%]">
                                <Autocomplete
                                  options={supportGroup}
                                  getOptionLabel={(option) =>
                                    option?.supportGroupName || ""
                                  }
                                  value={selectedSupportGroup}
                                  onChange={(event, newValue) =>
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
                                Technician
                                <span className="text-red-500">*</span>
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
                                  onChange={(event, newValue) =>
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
                        {inProgressValue === "pause" && (
                          <>
                            <div className="flex items-center gap-2 mt-2">
                              <label className="w-[40%] text-sm font-medium text-gray-500">
                                Pause Category
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="w-[60%]">
                                <Autocomplete
                                  options={[
                                    "Pending With Vendor/OEM",
                                    "Pause With Other Reason",
                                    "Standby Provided",
                                  ]}
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
                                Enter Remarks
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"></textarea>
                            </div>
                          </>
                        )}
                        {inProgressValue === "resolved" && (
                          <>
                            <div className="flex items-center gap-2 mt-2">
                              <label className="w-[40%] text-sm font-medium text-gray-500">
                                Closure Code
                                <span className="text-red-500">*</span>
                              </label>
                              <div className="w-[60%]">
                                <Autocomplete
                                  options={["", "", ""]}
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
                                Sloution Update
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                rows={2}
                                className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                              ></textarea>
                            </div>
                          </>
                        )}
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentsData;
