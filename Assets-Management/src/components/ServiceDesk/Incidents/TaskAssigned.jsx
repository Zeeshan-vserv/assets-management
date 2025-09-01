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
import { BiTask } from "react-icons/bi";
import {
  getAllIncident,
  getIncidentStatusCounts,
  updateIncident,
  getIncidentSla,
  getIncidentTat,
  getAllIncidentsSla,
  getAllIncidentsTat,
} from "../../../api/IncidentRequest";
import {
  getAllSupportDepartment,
  getAllSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { getAllUsers, getUserById } from "../../../api/AuthRequest";
import { useSelector } from "react-redux";
import { getAllByTechnician } from "../../../api/ReportRequest";
const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const ticketOptions = ["All Tickets", "Incidents Tickets", "Service Tickets"];

const TaskAssigned = () => {
  // Redux userId
  const user = useSelector((state) => state.authReducer.authData);

  // State
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
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [ticketType, setTicketType] = useState(ticketOptions[0]);

  const fetchDepartment = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllByTechnician(user?.userId);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // console.log(data);

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

  // Filter data based on ticketType
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (ticketType === "All Tickets") {
      return data;
    } else if (ticketType === "Incidents Tickets") {
      // Show only tickets with incidentId
      return data.filter((item) => !!item.incidentId);
    } else if (ticketType === "Service Tickets") {
      // Show only tickets with serviceId
      return data.filter((item) => !!item.serviceId);
    }
    return data;
  }, [data, ticketType]);

  // console.log(data);

  // Table columns
  const columns = useMemo(
    () => [
      {
        id: "edit",
        header: "Update Status",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => {
          const incidentId = row.original.incidentId;
          const serviceId = row.original.serviceId;
          const link = incidentId
            ? `/main/ServiceDesk/UpdateStatus/${row.original._id}`
            : serviceId
            ? `/main/ServiceDesk/UpdateServiceStatus/${row.original._id}`
            : "#";
          return (
            <div className="flex justify-center items-center">
              <IconButton color="primary" aria-label="edit">
                <NavLink to={link}>
                  <BiTask />
                </NavLink>
              </IconButton>
            </div>
          );
        },
      },
      {
        header: "Ticket ID",
        accessorKey: "ticketId",
        Cell: ({ row }) => {
          const incidentId = row.original.incidentId;
          const serviceId = row.original.serviceId;
          return incidentId ? incidentId : serviceId ? serviceId : "-";
        },
      },
      {
        header: "Status",
        accessorKey: "statusTimeline",
        Cell: ({ row }) => {
          const timeline = row.original.statusTimeline;
          if (!Array.isArray(timeline) || timeline.length === 0)
            return "No Status";
          return timeline[timeline.length - 1]?.status || "No Status";
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
        {/* <NavLink to="/main/ServiceDesk/NewIncident">
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
        </NavLink> */}
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
      <h2 className="text-lg font-semibold mb-6 text-start">Task Assigned</h2>
      <MaterialReactTable table={table} />
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in transition-all duration-300">
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
    </div>
  );
};

export default TaskAssigned;
