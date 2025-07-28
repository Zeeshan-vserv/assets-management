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
import { MdDownload } from "react-icons/md";

import QrCodeIcon from "@mui/icons-material/QrCode";
import { RxCross2 } from "react-icons/rx";
import { QRCodeSVG as QRCodeComponent } from "qrcode.react";
import QRCodeGenerator from "qrcode";
import { ImEye } from "react-icons/im";
import { getUserById, getAllUsers } from "../../../api/AuthRequest"; 

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
  const [userMap, setUserMap] = useState({});
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // console.log(filteredData);

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

  // console.log("data",data)

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

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Asset Id",
      },
      {
        accessorKey: "assetInformation.assetTag",
        header: "Asset Tag",
        Cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <NavLink
              to={`/main/asset/asset-details/${row.original._id}`}
              className="flex items-center gap-2"
            >
              <ImEye
                className="ml-1 text-slate-500 hover:text-slate-700"
                size={14}
              />
              {row.original.assetInformation?.assetTag || ""}
            </NavLink>
          </div>
        ),
      },
      {
        accessorKey: "assetState.user",
        header: "Assigned To",
        Cell: ({ row }) => {
          const userId = row.original.assetState?.user;
          const email = userMap[userId];
          return email ? (
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={() => handleUserEmailClick(userId)}
            >
              {email}
            </span>
          ) : (
            userId || ""
          );
        },
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
        accessorKey: "assetState.assetIsCurrently",
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
    [isLoading, userMap]
  );

  // const handleAssignedUserClick = (user) => {
  //   setAssignedUserDetails(user);
  //   setAssignedUserModalOpen(true);
  // };

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

  //Download qrCodes in pdf
  const qrCodesDownloadHandler = async () => {
    if (selectedRowsForQrCodes.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Asset QR Codes", 105, 15, { align: "center" });

    const qrSize = 60;
    const margin = 15;
    const startX = 15;
    let xPosition = startX;
    let yPosition = 30;
    const maxPerRow = 3;
    let currentRowCount = 0;

    for (const row of selectedRowsForQrCodes) {
      const qrData = `Asset ID: ${row?.assetId ?? ""}
Asset Tag: ${row?.assetInformation?.assetTag ?? ""}
Model: ${row?.assetInformation?.model ?? ""}
Serial Number: ${row?.assetInformation?.serialNumber ?? ""}
Operating System: ${row?.assetInformation?.operatingSystem ?? ""}
CPU: ${row?.assetInformation?.cpu ?? ""}
RAM: ${row?.assetInformation?.ram ?? ""}
Hard Disk: ${row?.assetInformation?.hardDisk ?? ""}
Location: ${row?.locationInformation?.location ?? ""}`;

      try {
        const qrImageData = await QRCodeGenerator.toDataURL(qrData, {
          width: qrSize * 4,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        doc.addImage(qrImageData, "PNG", xPosition, yPosition, qrSize, qrSize);
        doc.setFontSize(8);
        doc.text(
          `Asset ID: ${row?.assetId ?? ""}`,
          xPosition,
          yPosition + qrSize + 5
        );

        xPosition += qrSize + margin;
        currentRowCount++;
        if (currentRowCount >= maxPerRow) {
          xPosition = startX;
          yPosition += qrSize + margin + 15;
          currentRowCount = 0;

          if (yPosition > doc.internal.pageSize.height - 30) {
            doc.addPage();
            yPosition = 30;
          }
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }
    doc.save("Asset_QR_Codes.pdf");
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

  useEffect(() => {
    // Fetch all users and create a map of userId to email
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        const users = res?.data || [];
        const map = {};
        users.forEach((u) => {
          map[u._id] = u.emailAddress;
        });
        setUserMap(map);
      } catch (err) {
        setUserMap({});
      }
    };
    fetchUsers();
  }, []);

  // Handler to open modal and fetch user details
  const handleUserEmailClick = async (userId) => {
    try {
      const res = await getUserById(userId);
      console.log("User API response:", res); // <-- Add this line
      // Try both options below, depending on your API response:
      setUserDetails(res?.data?.data || res?.data || null);
      setUserModalOpen(true);
    } catch (err) {
      setUserDetails(null);
      setUserModalOpen(true);
    }
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
    setUserDetails(null);
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
              <div className="bg-white w-[90%] max-w-[650px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-2xl relative">
                <button
                  onClick={qrCodesDownloadHandler}
                  className="p-1 text-blue-800"
                >
                  <div className="flex flex-row items-center border border-gray-400 rounded-md p-1 text-sm hover:transition-all">
                    <span>Download</span>
                    <MdDownload size={18} />
                  </div>
                </button>
                <button
                  onClick={() => setQrCodesModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
                >
                  <RxCross2 size={24} />
                </button>
                <h2 className="text-xl font-bold mb-6 text-center text-gray-800">
                  Generated QR Codes
                </h2>
                <div
                  className={`${
                    selectedRowsForQrCodes.length === 1
                      ? "flex justify-center"
                      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
                  }`}
                >
                  {selectedRowsForQrCodes.map((row) => (
                    <div
                      key={row?._id}
                      className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow"
                    >
                      <QRCodeComponent
                        size={200}
                        value={[
                          ` Asset ID:        ${row?.assetId ?? ""}`,
                          ` RAM:             ${
                            row?.assetInformation?.ram ?? ""
                          }`,
                          ` CPU:             ${
                            row?.assetInformation?.cpu ?? ""
                          }`,
                          ` Hard Disk:       ${
                            row?.assetInformation?.hardDisk ?? ""
                          }`,
                          ` Location:        ${
                            row?.locationInformation?.location ?? ""
                          }`,
                          ` Asset Tag:       ${
                            row?.assetInformation?.assetTag ?? ""
                          }`,
                          ` Model:           ${
                            row?.assetInformation?.model ?? ""
                          }`,
                          ` Assigned To:     ${row?.assetState?.user ?? ""}`,
                          ` Operating System:${
                            row?.assetInformation?.operatingSystem ?? ""
                          }`,
                          ` Serial Number:   ${
                            row?.assetInformation?.serialNumber ?? ""
                          }`,
                          ` Sub Location:    ${
                            row?.locationInformation?.subLocation ?? ""
                          }`,
                          // ` Status:          ${row?.status ?? ""}`,
                        ].join("\n")}
                        level="M"
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
        {/* User Details Modal */}
        {userModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
                onClick={handleCloseUserModal}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4 text-blue-700">
                User Details
              </h2>
              {userDetails ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {userDetails.employeeName || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Employee Code:</span>{" "}
                    {userDetails.employeeCode || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {userDetails.emailAddress || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Mobile:</span>{" "}
                    {userDetails.mobileNumber || "-"}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No user details found.</div>
              )}
              <button
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                onClick={handleCloseUserModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AssetData;
