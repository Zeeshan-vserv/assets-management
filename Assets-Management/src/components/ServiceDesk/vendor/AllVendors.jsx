import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { NavLink, useNavigate } from "react-router-dom";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FaDesktop } from "react-icons/fa";
import { getAllAssets } from "../../../api/AssetsRequest"; //Later change this api

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Assets",
});

function AllVendors() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openVendorDeleteModal, setOpenVendorsDeleteModal] = useState(false);
  const [deleteAllVendorsId, setDeleteAllVendorsId] = useState(null);
  // const [showVendorFilterModal, setShowVendorFilterModal] = useState(false);

  const fetchAllVendors = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching all vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVendors();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Vendor Id",
      },
      {
        accessorKey: "assetInformation.assetTag",
        header: "Vendor Code",
      },
      {
        accessorKey: "assetState.user",
        header: "Vendor Name",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Vendor Category",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Services Status",
      },
      {
        id: "delete",
        header: "Delete",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleDeleteAllVendors(row.original._id)}
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

  const handleDeleteAllVendors = (id) => {
    setDeleteAllVendorsId(id);
    setOpenVendorsDeleteModal(true);
  };

  const deleteAllVendorsHandler = async () => {
    try {
      console.log("Deleted", deleteAllVendorsId);
      //call api
      setOpenVendorsDeleteModal(false);
    } catch (error) {
      console.log("Delete Get pass error", error);
    }
  };

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
    const excludedColumns = ["mrt-row-select", "delete", "file"];
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

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <NavLink to="/main/ServiceDesk/NewVendor">
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
            New
          </Button>
        </NavLink>
        {/* <Button
          variant="contained"
          size="small"
          startIcon={<FilterAltIcon />}
          sx={{
            backgroundColor: "#2563eb",
            color: "#fff",
            textTransform: "none",
            mt: 1,
            mb: 1,
            ml: 2,
          }}
          onClick={() => setShowVendorFilterModal(true)}
        >
          Filter
        </Button> */}
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold mb-6 text-start">ALL VENDORS</h2>
          <button
            onClick={() => navigate("/main/dashboard/vendor")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span> View Dashboard</span>
            </div>
          </button>
        </div>
        <MaterialReactTable table={table} />
        {openVendorDeleteModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
                <h2 className="text-xl font-semibold text-red-600 mb-3">
                  Are you sure?
                </h2>
                <p className="text-gray-700 mb-6">
                  This action will permanently delete the component.
                </p>
                <form
                  onSubmit={deleteAllVendorsHandler}
                  className="flex justify-end gap-3"
                >
                  <button
                    type="button"
                    onClick={() => setOpenVendorsDeleteModal(false)}
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
          </>
        )}
        {/* {showVendorFilterModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
                <h2 className="text-lg font-medium text-gray-800 mb-6">
                  Vendor Filter
                </h2>
                <form>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-4">
                      <label className="w-[25%] text-sm font-semibold text-slate-600">
                        Category
                      </label>
                      <Autocomplete
                        className="w-[75%]"
                        options={["bittu", "Zeeshan", "Danish"]}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-sm text-slate-600"
                            placeholder="Select Category"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-[25%] text-xs font-semibold text-slate-600">
                        Status
                      </label>
                      <Autocomplete
                        className="w-[75%]"
                        options={[]}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-sm text-slate-600"
                            placeholder="Select Status"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-[25%] text-xs font-semibold text-slate-600">
                        Location
                      </label>
                      <Autocomplete
                        className="w-[75%]"
                        options={[]}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-xs text-slate-600"
                            placeholder="Select Location"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowVendorFilterModal(false)}
                      className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )} */}
      </div>
    </>
  );
}

export default AllVendors;
