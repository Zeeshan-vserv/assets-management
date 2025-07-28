import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router";
import { getAllServiceRequests } from "../../api/ServiceRequest";
import { useSelector } from "react-redux";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const ticketOptions = ["All Tickets", "My Tickets", "Other User Tickets"];

function ServiceRequest() {
  const user = useSelector((state) => state.authReducer.authData);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketType, setTicketType] = useState(ticketOptions[0]);

  const fetchServiceRequest = async () => {
    try {
      setIsLoading(true);
      const response = await getAllServiceRequests();
      if (response?.data?.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching service request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequest();
  }, []);

  // console.log("data", data);

  // Filter data based on ticketType
  const filteredData = useMemo(() => {
    if (ticketType === "All Ticket") {
      return data.filter((item) => item.userId === user?.userId);
    } else if (ticketType === "My Tickets") {
      return data.filter(
        (item) =>
          item.userId === user?.userId && user?.userId === item.submitter.userId
      );
    } else if (ticketType === "Other User Tickets") {
      return data.filter(
        (item) =>
          item.userId === user?.userId &&
          item.submitter &&
          item.submitter.userId !== user?.userId
      );
    }
    return data;
  }, [data, ticketType, user]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "serviceId",
        header: "Service Req Id",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        header: "",
        header: "Assigned To",
      },
      {
        header: "Logged Time",
        Cell: ({ row }) => {
          const value = row.original?.submitter?.loggedInTime;
          if (!value) return "N/A";
          const date = new Date(value);
          return isNaN(date)
            ? "Invalid Date"
            : date.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              });
        },
      },
      {
        accessorKey: "statusTimeline",
        header: "Status",
        Cell: ({ cell }) => {
          const timeline = cell.getValue();
          return timeline?.length > 0
            ? timeline[timeline.length - 1]?.status
            : "N/A";
        },
      },
    ],
    [isLoading]
  );

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
            onClick={() => navigate("/new-service-request")}
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
            className="w-[17%]"
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
                  style: { fontSize: "0.85rem", padding: "5px" },
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

  return (
    <>
      <div className="w-[100%] min-h-screen p-6 flex flex-col gap-5 bg-slate-200">
        <h2 className="text-md font-semibold mb-4 text-start">
          SERVICE REQUESTS
        </h2>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

export default ServiceRequest;
