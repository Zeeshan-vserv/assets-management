import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Autocomplete, TextField } from "@mui/material";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router";
import { ImEye } from "react-icons/im";
import { getAllIncident } from "../../api/IncidentRequest";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Incident-Report",
});

const ticketOptions = ["My Tickets", "Other User Tickets"];

function Incident() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [assignedToViewModal, setAssignedToViewModal] = useState(false);
  const [ticketType, setTicketType] = useState(ticketOptions[0]); // Default: My Tickets

  const fetchIncident = async () => {
    try {
      setIsLoading(true);
      const response = await getAllIncident();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, []);

  // Filter data based on ticketType
  const filteredData = useMemo(() => {
    if (ticketType === "My Tickets") {
      return data.filter(
        (item) => item.userId === user?.userId
      );
    } else if (ticketType === "Other User Tickets") {
      return data.filter(
        (item) =>
          item.userId !== user?.userId &&
          item.submitter &&
          item.submitter.userId === user?.userId
      );
    }
    return data;
  }, [data, ticketType, user]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "incidentId",
        header: "Incident Id",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <NavLink
              to={`/incidents/${row.original._id}`}
              className="flex items-center gap-2"
            >
              <ImEye
                className="ml-1 text-slate-500 hover:text-slate-700"
                size={14}
              />
              {row.original.incidentId || ""}
            </NavLink>
          </div>
        ),
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "submitter.user",
        header: "User Name",
      },
      {
        accessorKey: "classificaton.technician",
        header: "Assigned To",
      },
      // {
      //   accessorKey: "createdAt",
      //   header: "Logged Time",
      // },
      {
        accessorKey: "createdAt",
        header: "Logged Time",
        Cell: ({ cell }) =>
          dayjs(cell.getValue()).format("DD MMM YYYY, hh:mm A"),
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    [isLoading]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChangeStatus = () => {
    console.log("Change Status Clicked"); //logic
    handleClose();
  };

  //Exports
  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && col.id !== "mrt-row-select");

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
      .filter((col) => col.getIsVisible() && col.id !== "mrt-row-select");

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
    const excludedColumns = ["mrt-row-select"];

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
    data: filteredData,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box className="flex flex-wrap items-center w-full">
          <Button
            onClick={() => navigate("/new-incident")}
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
            New
          </Button>
          <Autocomplete
            className="w-40"
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
            onChange={(_, newValue) => setTicketType(newValue || ticketOptions[0])}
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
            variant="contained"
            size="small"
            startIcon={<MdDashboard size={16} />}
            onClick={handleClick}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 1,
            }}
          >
            Action
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={handleChangeStatus}
              sx={{ fontSize: "0.875rem" }}
            >
              Change Status
            </MenuItem>
          </Menu>
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
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold text-start">MY INCIDENTS</h2>
        {/* <Box className="flex flex-wrap items-center w-full">
          <Button
            onClick={() => navigate("/new-incident")}
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
            New
          </Button>
          <Autocomplete
            className="w-40"
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
            onChange={(_, newValue) => setTicketType(newValue || ticketOptions[0])}
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
            variant="contained"
            size="small"
            startIcon={<MdDashboard size={16} />}
            onClick={handleClick}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 1,
            }}
          >
            Action
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={handleChangeStatus}
              sx={{ fontSize: "0.875rem" }}
            >
              Change Status
            </MenuItem>
          </Menu>
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
        </Box> */}
        <MaterialReactTable table={table} />
        {assignedToViewModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
              <div className="bg-white rounded-md shadow-2xl w-[90%] max-w-3xl p-5 animate-fade-in">
                <div className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-md">
                  <h2 className="text-sm font-semibold text-blue-900">
                    Technician Details
                  </h2>
                  <RxCrossCircled
                    onClick={() => setAssignedToViewModal(false)}
                    size={24}
                    className="text-blue-700 flex items-center justify-center cursor-pointer"
                  />
                </div>
                <div className="overflow-x-auto px-6 py-4">
                  <table className="w-full border border-collapse">
                    <thead>
                      <tr className="bg-blue-50 text-gray-700 text-left">
                        <th className="border px-4 py-2 text-sm font-medium">
                          Emp Id
                        </th>
                        <th className="border px-4 py-2 text-sm font-medium">
                          Email Id
                        </th>
                        <th className="border px-4 py-2 text-sm font-medium">
                          Name
                        </th>
                        <th className="border px-4 py-2 text-sm font-medium">
                          Mobile No
                        </th>
                        <th className="border px-4 py-2 text-sm font-medium">
                          Designation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white text-sm text-gray-900">
                        <td className="border px-4 py-2">133</td>
                        <td className="border px-4 py-2">
                          deydebabratahooghly@gmail.com
                        </td>
                        <td className="border px-4 py-2">Debabrata Dey</td>
                        <td className="border px-4 py-2">6291167601</td>
                        <td className="border px-4 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Incident;
