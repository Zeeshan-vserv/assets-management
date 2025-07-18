import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Autocomplete, TextField } from "@mui/material";
import { getAllDepartment } from "../../../api/DepartmentRequest";
import { getAllIncident } from "../../../api/IncidentRequest";
import { NavLink } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import { getAllSLAs, getAllSLATimelines } from "../../../api/slaRequest";
import SLAClock from "../../Configuration/SLA/SLAClock";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const IncidentsData = () => {
  const [data, setData] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [slaTimelineData, setSlaTimelineData] = useState([]);

  const fetchSlaTimelineData = async () => {
  try {
    const response = await getAllSLATimelines();
    setSlaTimelineData(response?.data?.data || []);
  } catch (error) {
    console.error("Error fetching SLA timelines:", error);
  }
};

useEffect(() => {
  fetchSlaTimelineData();
}, []);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      // const response = await getAllDepartment();
      const response = await getAllIncident();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchSlaCreation = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAs();
      setSlaData(response?.data?.data[0] || []);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaCreation();
  }, []);

  // console.log("sladata",slaData , "data", data[0].createdAt);

  function addBusinessTime(startDate, hoursToAdd, slaTimeline) {
  let remainingMinutes = Math.round(hoursToAdd * 60);
  let current = new Date(startDate);

  // Helper: get business window for a given date
  function getBusinessWindow(date) {
    const weekDay = date.toLocaleString("en-US", { weekday: "long" });
    const slot = slaTimeline.find(s => s.weekDay === weekDay);
    if (!slot) return null;
    // slot.startTime and slot.endTime are Date objects (time part only)
    const start = new Date(date);
    start.setHours(new Date(slot.startTime).getUTCHours(), new Date(slot.startTime).getUTCMinutes(), 0, 0);
    const end = new Date(date);
    end.setHours(new Date(slot.endTime).getUTCHours(), new Date(slot.endTime).getUTCMinutes(), 0, 0);
    return { start, end };
  }

  while (remainingMinutes > 0) {
    const window = getBusinessWindow(current);
    if (!window) {
      // No business hours today, go to next day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    // If before business hours, jump to start
    if (current < window.start) current = new Date(window.start);
    // If after business hours, go to next day
    if (current >= window.end) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    // Minutes left in today's business window
    const minutesLeftToday = Math.floor((window.end - current) / 60000);
    const minutesToAdd = Math.min(remainingMinutes, minutesLeftToday);
    current = new Date(current.getTime() + minutesToAdd * 60000);
    remainingMinutes -= minutesToAdd;
    if (remainingMinutes > 0) {
      // Go to next business day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }
  }
  return current;
}

  const columns = useMemo(
    () => [
      {
        accessorKey: "incidentId",
        header: "Incident ID",
      },
      {
        accessorKey: "classificaton.",
        header: "Status",
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
      {
        accessorKey: "assetDetails.asset",
        header: "Asset Id",
      },
      {
        accessorKey: "locationDetails.location",
        header: "Location",
      },
      {
        accessorKey: "locationDetails.subLocation",
        header: "Sub Location",
      },
      {
        accessorKey: "departmentName",
        header: "Logged Time",
      },
      {
        accessorKey: "classificaton.severityLevel",
        header: "Severity",
      },
      {
        accessorKey: "classificaton.technician",
        header: "Assigned To",
      },
    {
  accessorKey: "sla",
  header: "SLA Remaining",
  Cell: ({ row }) => {
    const incident = row.original;
    const severity = incident?.classificaton?.severityLevel;
    const loggedIn = new Date(incident?.createdAt || incident?.submitter?.loggedInTime);

    // Use business hours from SLACreation
    const businessHours = slaData?.slaTimeline || [];

    // Find SLA duration for this severity from slaTimelineData
    const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
    const matchedTimeline = slaTimelineData.find(
      (item) => item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
    );
    const resolution = matchedTimeline?.resolutionSLA || "00:30";
    const [slaHours, slaMinutes] = resolution.split(":").map(Number);
    const totalHours = slaHours + slaMinutes / 60;

    // Calculate SLA deadline using business hours
    const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);

    // Helper: Calculate remaining business minutes from now to deadline
    function getBusinessMinutesBetween(now, end, slaTimeline) {
      let minutes = 0;
      let current = new Date(now);
      while (current < end) {
        // Get business window for current day
        const weekDay = current.toLocaleString("en-US", { weekday: "long" });
        const slot = slaTimeline.find(s => s.weekDay === weekDay);
        if (!slot) {
          // No business hours today, go to next day
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
          continue;
        }
        const start = new Date(current);
        start.setHours(new Date(slot.startTime).getUTCHours(), new Date(slot.startTime).getUTCMinutes(), 0, 0);
        const endWindow = new Date(current);
        endWindow.setHours(new Date(slot.endTime).getUTCHours(), new Date(slot.endTime).getUTCMinutes(), 0, 0);

        // If after business hours, go to next day
        if (current >= endWindow) {
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
          continue;
        }
        // If before business hours, jump to start
        if (current < start) current = new Date(start);

        // Calculate minutes to count for this day
        const until = end < endWindow ? end : endWindow;
        const diff = Math.max(0, (until - current) / 60000);
        minutes += diff;
        current = new Date(until);
        if (current < end) {
          // Go to next business day
          current.setDate(current.getDate() + 1);
          current.setHours(0, 0, 0, 0);
        }
      }
      return Math.round(minutes);
    }

    const now = new Date();
    let remainingMinutes;
    if (now < slaDeadline) {
      remainingMinutes = getBusinessMinutesBetween(now, slaDeadline, businessHours);
    } else {
      // SLA breached: show negative overdue time
      remainingMinutes = -getBusinessMinutesBetween(slaDeadline, now, businessHours);
    }

    const abs = Math.abs(remainingMinutes);
    const hr = Math.floor(abs / 60);
    const min = abs % 60;

    const color = remainingMinutes < 0 ? "red" : "green";
    const icon = remainingMinutes < 0 ? "❌" : "⏳";
    const prefix = remainingMinutes < 0 ? "-" : "";

    return (
      <span style={{ color, fontWeight: "bold" }}>
        {icon} {prefix}{hr} hr {min} min
      </span>
    );
  },
},
      {
        accessorKey: "departmentName",
        header: "TAT",
      },
      {
        accessorKey: "classificaton.supportDepartmentName",
        header: "Support Department",
      },
      {
        accessorKey: "classificaton.supportGroupName",
        header: "Support Group",
      },
      {
        accessorKey: "departmentName",
        header: "Feedback Available",
      },
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
    [isLoading, slaData]
  );

  //Exports
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
              New Asset
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
            options={[
              "My Tickets",
              "Group Tickets",
              "Department Tickets",
              "All Tickets",
            ]}
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
                  style: { fontSize: "0.85rem", padding: "8px" },
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

  const cardData = [
    {
      id: "1",
      totalCount: "100",
      description: "New",
    },
    {
      id: "2",
      storeCount: "70",
      description: "Assigned",
    },
    {
      id: "3",
      allocatedCount: "40",
      description: "In-Progress",
    },
    {
      id: "4",
      inRepairCount: "30",
      description: "Pause",
    },
    {
      id: "5",
      inTransitCount: "10",
      description: "Resolved",
    },
    {
      id: "6",
      handOverCount: "0",
      description: "Cancelled",
    },
    {
      id: "7",
      underRecoveryCount: "0",
      description: "Reopened",
    },
    {
      id: "8",
      discardReplacedCount: "0",
      description: "Closed",
    },
    {
      id: "9",
      theftLostCount: "0",
      description: "Converted to SR",
    },
    {
      id: "11",
      soldCount: "0",
      description: "Total",
    },
  ];

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">INCIDENT DATA</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {cardData.map((item) => {
            const countKey = Object.keys(item).find((key) =>
              key.endsWith("Count")
            );
            const count = item[countKey];

            return (
              <div
                key={item?.id}
                className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
              >
                <h2 className="font-semibold text-xl text-blue-600 mb-1">
                  {count}
                </h2>
                <span className="text-sm">{item.description}</span>
              </div>
            );
          })}
        </div>

        <MaterialReactTable table={table} />
      </div>
    </>
  );
};

export default IncidentsData;

// import React, { useEffect, useMemo, useState } from "react";
// import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
// import { Box, CircularProgress } from "@mui/material";
// import { getAllIncident } from "../../../api/IncidentRequest";
// import { getAllSLAs } from "../../../api/slaRequest";

// const getSLAWorkingMinutes = (createdAtStr, slaTimeline, now = new Date()) => {
//   const slaHoursByDay = {};

//   // Parse SLA timings into minutes in IST
//   slaTimeline.forEach(({ weekDay, startTime, endTime }) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     slaHoursByDay[weekDay] = {
//       startMinutes: start.getHours() * 60 + start.getMinutes(),
//       endMinutes: end.getHours() * 60 + end.getMinutes(),
//     };
//   });

//   let totalMinutes = 0;
//   let current = new Date(createdAtStr);

//   while (current < now) {
//     const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
//     const sla = slaHoursByDay[dayName];

//     if (sla) {
//       const { startMinutes, endMinutes } = sla;

//       const workStart = new Date(
//         current.getFullYear(),
//         current.getMonth(),
//         current.getDate(),
//         Math.floor(startMinutes / 60),
//         startMinutes % 60,
//         0
//       );

//       let workEnd = new Date(
//         current.getFullYear(),
//         current.getMonth(),
//         current.getDate(),
//         Math.floor(endMinutes / 60),
//         endMinutes % 60,
//         0
//       );

//       if (endMinutes <= startMinutes) {
//         workEnd.setDate(workEnd.getDate() + 1);
//       }

//       const effectiveStart = current > workStart ? current : workStart;
//       const effectiveEnd = now < workEnd ? now : workEnd;

//       if (effectiveStart < effectiveEnd) {
//         const diff = Math.floor((effectiveEnd - effectiveStart) / (1000 * 60));
//         totalMinutes += diff;
//       }
//     }

//     // Move to next day
//     current.setDate(current.getDate() + 1);
//     current.setHours(0, 0, 0, 0);
//   }

//   return totalMinutes;
// };

// const IncidentSLAView = () => {
//   const [data, setData] = useState([]);
//   const [slaData, setSlaData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const incidentsRes = await getAllIncident();
//         const slaRes = await getAllSLAs();

//         setData(incidentsRes?.data?.data || []);
//         setSlaData(slaRes?.data?.data?.[0] || null);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const columns = useMemo(() => [
//     {
//       accessorKey: "incidentId",
//       header: "Incident ID",
//     },
//     {
//       accessorKey: "subject",
//       header: "Subject",
//     },
//     {
//       accessorKey: "category",
//       header: "Category",
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created At",
//       Cell: ({ cell }) =>
//         new Date(cell.getValue()).toLocaleString("en-IN", {
//           timeZone: "Asia/Kolkata",
//         }),
//     },
//     {
//       id: "slaTime",
//       header: "SLA Time (IST)",
//       Cell: ({ row }) => {
//         const createdAt = row.original.createdAt;
//         if (!createdAt || !slaData?.slaTimeline) return "-";

//         const totalMinutes = getSLAWorkingMinutes(createdAt, slaData.slaTimeline, currentTime);
//         const hours = Math.floor(totalMinutes / 60);
//         const minutes = totalMinutes % 60;

//         return `${hours}h ${minutes}m`;
//       },
//     },
//   ], [slaData, currentTime]);

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     getRowId: (row) => row._id,
//     initialState: {
//       pagination: { pageSize: 5 },
//     },
//     enablePagination: true,
//   });

//   return (
//     <Box p={2}>
//       <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Incident SLA Tracker</h2>
//       {isLoading ? (
//         <CircularProgress />
//       ) : (
//         <MaterialReactTable table={table} />
//       )}
//     </Box>
//   );
// };

// export default IncidentSLAView;
