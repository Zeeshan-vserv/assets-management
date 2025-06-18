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
import { getAllAssets } from "../../../api/AssetsRequest";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const assetStates = [
  "In Store",
  "Allocated",
  "In Repair",
  "Lost",
  "Discard",
  "Disposed",
  "Sold",
];

function AssetsSummary() {
  const [data, setData] = useState([]);
  const [stateData, setStateData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const categorySummary = useMemo(() => {
    // Get all unique categories
    const allCategories = Array.from(
      new Set(
        data.map((item) => item.assetInformation?.category || "Uncategorized")
      )
    );

    return allCategories.map((category, idx) => {
      const assetsInCategory = data.filter(
        (item) =>
          (item.assetInformation?.category || "Uncategorized") === category
      );
      // Count for each state
      const stateCounts = assetStates.reduce((acc, state) => {
        acc[state] = assetsInCategory.filter(
          (item) => item.assetState?.assetIsCurrently === state
        ).length;
        return acc;
      }, {});
      return {
        id: idx + 1,
        category,
        total: assetsInCategory.length,
        inStore: stateCounts["In Store"] || 0,
        allocated: stateCounts["Allocated"] || 0,
        inRepair: stateCounts["In Repair"] || 0,
        lost: stateCounts["Lost"] || 0,
        discard: stateCounts["Discard"] || 0,
        disposed: stateCounts["Disposed"] || 0,
        sold: stateCounts["Sold"] || 0,
      };
    });
  }, [data]);

  useEffect(() => {
    const groupedData = assetStates.reduce((acc, state) => {
      acc[state] = data.filter(
        (item) => item.assetState?.assetIsCurrently === state
      );
      return acc;
    }, {});
    setStateData(groupedData);
  }, [data]);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "Id" },
      { accessorKey: "category", header: "Asset Category" },
      { accessorKey: "total", header: "Total" },
      { accessorKey: "inStore", header: "In-Store" },
      { accessorKey: "allocated", header: "Allocated" },
      { accessorKey: "inRepair", header: "In-Repair" },
      { accessorKey: "lost", header: "Theft/Lost" },
      { accessorKey: "discard", header: "Discard/Replaced" },
      { accessorKey: "disposed", header: "Disposed/Scrapped" },
      { accessorKey: "sold", header: "Sold" },
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
    data: categorySummary,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box>
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
      totalCount: data.length,
      description: "Total",
    },
    {
      id: "2",
      storeCount: stateData["In Store"]?.length || 0,
      description: "In-Store",
    },
    {
      id: "3",
      allocatedCount: stateData["Allocated"]?.length || 0,
      description: "Allocated",
    },
    {
      id: "4",
      inRepairCount: stateData["In Repair"]?.length || 0,
      description: "In-Repair",
    },
    {
      id: "5",
      inTransitCount: stateData["Lost"]?.length || 0,
      description: "Theft/Lost",
    },
    {
      id: "6",
      handOverCount: stateData["Discard"]?.length || 0,
      description: "Discard/Replaced",
    },
    {
      id: "7",
      underRecoveryCount: stateData["Disposed"]?.length || 0,
      description: "Disposed/Scrapped",
    },
    {
      id: "8",
      discardReplacedCount: stateData["Sold"]?.length || 0,
      description: "Sold",
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
}

export default AssetsSummary;
