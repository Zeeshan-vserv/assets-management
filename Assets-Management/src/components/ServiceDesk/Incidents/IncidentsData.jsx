import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Autocomplete, TextField } from "@mui/material";
import { getAllDepartment } from "../../../api/DepartmentRequest";
import { getAllIncident } from "../../../api/IncidentRequest";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const IncidentsData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  console.log(data);
  

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
        accessorKey: "departmentName",
        header: "Severity",
      },
      {
        accessorKey: "departmentName",
        header: "Assigned To",
      },
      {
        accessorKey: "departmentName",
        header: "SLA",
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
    ],
    [isLoading]
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
      rowsPerPageOptions: [10, 15, 20],
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
        <h2 className="text-lg font-semibold mb-6 text-start">
          IT ASSETS SUMMARY
        </h2>

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
