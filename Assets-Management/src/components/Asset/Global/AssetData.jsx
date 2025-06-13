import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllAssets, deleteAsset } from "../../../api/AssetsRequest";

import QrCodeIcon from "@mui/icons-material/QrCode";
import { QRCodeSVG as QRCode } from "qrcode.react";
import { RxCross2 } from "react-icons/rx";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Assets",
});

const AssetData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteComponentsId, setDeleteComponentsId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [qrCodesModalOpen, setQrCodesModalOpen] = useState(false);
  const [selectedRowsForQrCodes, setSelectedRowsForQrCodes] = useState([]);

  const fetchAsset = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAsset();
  }, []);

  // Extract unique categories from data
  const categories = useMemo(() => {
    const cats = data.map(
      (item) => item.assetInformation?.category || "Uncategorized"
    );
    return ["All", ...Array.from(new Set(cats))];
  }, [data]);

  // Filter data when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (item) => item.assetInformation?.category === selectedCategory
        )
      );
    }
  }, [selectedCategory, data]);

  // Calculate counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {};
    data.forEach((item) => {
      const cat = item.assetInformation?.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    counts["All"] = data.length;
    return counts;
  }, [data]);

  // console.log(data);
  console.log(selectedRowsForQrCodes);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Asset Id",
      },
      {
        accessorKey: "assetInformation.assetTag",
        header: "Asset Tag",
      },
      {
        accessorKey: "N/A",
        header: "User Info",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Model",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Serial Number",
      },
      {
        accessorKey: "locationInformation.location",
        header: "Location",
      },
      {
        accessorKey: "locationInformation.subLocation",
        header: "Sub Location",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "mappingStatus",
        header: "Mapping Status",
      },
      {
        accessorKey: "ackStatus",
        header: "ACK Status",
      },
      // Uncomment and fix if you want edit functionality
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/asset/${row.original._id}`}>
              <MdModeEdit />
            </NavLink>
          </IconButton>
        ),
      },
      {
        id: "delete",
        header: "Delete",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleDeleteComponents(row.original._id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
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
          col.id !== "delete" &&
          col.id !== "file"
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
          col.id !== "delete" &&
          col.id !== "file"
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
    const excludedColumns = ["mrt-row-select", "edit", "delete", "file"];
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    const exportData = data.map((item) =>
      visibleColumns.map((col) => {
        const key = col.id || col.accessorKey;
        let value = item[key];
        // Format date fields if needed
        return value ?? "";
      })
    );

    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });

    doc.save("Assets-Management-Assets.pdf");
  };

  //Generate qrCodes function
  const handleGenerateQrCodes = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    setSelectedRowsForQrCodes(selectedRows.map((row) => row.original));
    setQrCodesModalOpen(true);
  };

  const handleDeleteComponents = (id) => {
    if (id) {
      setDeleteComponentsId(id);
      setDeleteConfirmationModal(true);
    }
  };

  const deleteAssetConfirmationHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteAsset(deleteComponentsId);
      if (response?.data?.success) {
        toast.success("Asset deleted successfully");
        setData((prevData) =>
          prevData.filter((component) => component._id !== deleteComponentsId)
        );
        setDeleteConfirmationModal(false);
      }
    } catch (error) {
      console.error(
        "Error deleting asset:",
        error.response?.data?.message || error.message
      );
    }
  };

  const table = useMaterialReactTable({
    data: filteredData, // Use filteredData here
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        {/* Uncomment if you want to add new asset functionality */}
        <NavLink to="/main/Asset/AddFixedAssets">
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
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={handleGenerateQrCodes}
          startIcon={<QrCodeIcon />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
        >
          Generate QR Codes
        </Button>
      </Box>
    ),
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

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">ALL ASSETS</h2>
        {/* Category Filter Buttons */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1 rounded ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span className="ml-1 text-base font-semibold">
                  ({categoryCounts[cat] || 0})
                </span>
              </button>
            ))}
          </div>
          <MaterialReactTable table={table} />
        </div>

        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the component.
              </p>
              <form
                onSubmit={deleteAssetConfirmationHandler}
                className="flex justify-end gap-3"
              >
                <button
                  type="button"
                  onClick={() => setDeleteConfirmationModal(false)}
                  className="shadow-md px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        )}
        {qrCodesModalOpen && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-white w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative">
                <button
                  onClick={() => setQrCodesModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
                >
                  <RxCross2 size={24} />
                </button>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                  Generated QR Codes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                  {selectedRowsForQrCodes.map((row) => (
                    <div
                      key={row?._id}
                      className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow"
                    >
                      <QRCode
                        size={128}
                        value={`
                        Asset ID: ${row?.assetId}
                        Asset Tag: ${row?.assetInformation?.assetTag}
                        Model: ${row?.assetInformation?.model}
                        Serial Number: ${row?.assetInformation?.serialNumber}
                        Operating System: ${row?.assetInformation?.operatingSystem}
                        CPU: ${row?.assetInformation?.cpu}
                        RAM: ${row?.assetInformation?.ram}
                        Hard Disk: ${row?.assetInformation?.hardDisk}
                        Location: ${row?.locationInformation?.location}`}
                        level="H"
                        includeMargin={true}
                      />
                      <span className="mt-2 text-xs text-gray-600 font-medium">
                        Asset ID: {row?.assetId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AssetData;
