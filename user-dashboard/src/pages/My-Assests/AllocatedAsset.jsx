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
import { RxCrossCircled } from "react-icons/rx";
import { getAllAssets } from "../../api/AssetsRequest.js";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

function AllocatedAsset() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewImage, setViewImage] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const fetchAllocatedAsset = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching allocated asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocatedAsset();
  }, []);

  console.log("data", data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Asset Id",
      },
      {
        accessorKey: "assetInformation.assetTag",
        header: "Tag",
      },
      {
        accessorKey: "assetInformation.category",
        header: "Category",
      },
      {
        accessorKey: "assetInformation.make",
        header: "Make",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Model",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Serial No",
      },
      {
        accessorKey: "locationInformation.location",
        header: "Location",
      },
      {
        accessorKey: "reviewCount",
        header: "Status",
      },

      {
        accessorFn: (row) => new Date(row.holidayDate),
        id: "rating",
        header: "Allocated Date",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      // {
      //   id: "assetInformation.assetImage",
      //   header: "Image",
      //   size: 100,
      //   Cell: ({ row }) => (
      //     <Box
      //       sx={{
      //         display: "flex",
      //       }}
      //       onClick={() => {
      //         setSelectedImageUrl(row.original.image);
      //         setViewImage(true);
      //       }}
      //     >
      //       <img
      //         alt="avatar"
      //         src={row.original.image}
      //         loading="lazy"
      //         width={40}
      //         height={40}
      //         style={{
      //           borderRadius: "50%",
      //           objectFit: "cover",
      //           border: "2px solid #e2e8f0",
      //         }}
      //       />
      //     </Box>
      //   ),
      // },
      {
        id: "assetImage",
        header: "Image",
        size: 100,
        Cell: ({ row }) => {
          const imagePath = row.original.assetInformation?.assetImage;
          const imageUrl = imagePath
            ? `http://localhost:5001/${imagePath.replace(/\\/g, "/")}`
            : null;
            console.log("imageUrl",imageUrl)
          return (
            <Box
              sx={{ display: "flex", cursor: imageUrl ? "pointer" : "default" }}
              onClick={() => {
                if (imageUrl) {
                  setSelectedImageUrl(imageUrl);
                  setViewImage(true);
                }
              }}
            >
              {imageUrl ? (
                <img
                  alt="asset"
                  src={imageUrl}
                  loading="lazy"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e2e8f0",
                  }}
                />
              ) : (
                <span style={{ fontSize: "12px", color: "#999" }}>
                  No Image
                </span>
              )}
            </Box>
          );
        },
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
          col.id !== "image"
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
          col.id !== "image"
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
    const excludedColumns = ["mrt-row-select", "image"];

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
      <div className="flex flex-col">
        <h2 className="text-md font-semibold mb-4 text-start">
          ALLOCATED ASSET
        </h2>
        <MaterialReactTable table={table} />
        {viewImage && selectedImageUrl && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm p-4 flex flex-col items-center justify-center">
              <RxCrossCircled
                size={28}
                onClick={() => {
                  setViewImage(false);
                  setSelectedImageUrl(null);
                }}
                className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-red-500 transition-all"
              />
              <img
                src={selectedImageUrl}
                alt="Selected"
                className="w-64 h-auto rounded-xl object-cover shadow-lg mt-4"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AllocatedAsset;
