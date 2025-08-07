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
import { TextField } from "@mui/material";
import {
  getAllLocation,
  getAllSubLocation,
  addSubLOcation,
  updateSubLocation,
  deleteSubLocation,
} from "../../../api/LocationRequest";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SubLocation",
});

function SubLocation() {
  const [data, setData] = useState([]);
  const [rawSubLocations, setRawSubLocations] = useState([]); // for mapping
  const [isLoading, setIsLoading] = useState(true);
  const [openAddSubLocationModal, setOpenAddSubLocationModal] = useState(false);
  const [addNewSubLocation, setAddNewSubLocation] = useState({
    subLocationName: "",
    locationId: "",
  });
  const [locations, setLocations] = useState([]);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSubLocationInfo, setDeleteSubLocationInfo] = useState(null);
  const [updateSubLocationModal, setUpdateSubLocationModal] = useState(false);
  const [editSubLocation, setEditSubLocation] = useState(null);

  const fetchSubLocations = async () => {
    try {
      setIsLoading(true);
      const response = await getAllLocation();
      setLocations(response?.data?.data || []);
      const allSubLocations = response?.data?.data?.reduce(
        (acc, location) => {
          if (location.subLocations && location.subLocations.length > 0) {
            return [
              ...acc,
              ...location.subLocations.map((sub) => ({
                ...sub,
                locationName: location.locationName,
                locationId: location._id,
              })),
            ];
          }
          // console.log(acc);
          return acc;
        },

        []
      );
      setData(allSubLocations || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubLocations();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "subLocationId",
        header: "Sub Location Id",
      },
      {
        accessorKey: "locationName",
        header: "Location",
      },
      {
        accessorKey: "subLocationName",
        header: "Sub-Location Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateSubLocation(row.original)}
            color="primary"
            aria-label="edit"
          >
            <MdModeEdit />
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
            onClick={() => handleDeleteSubLocation(row.original)}
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

  // Add
  const addNewSubLocationChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSubLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSubLocationHandler = async (e) => {
    e.preventDefault();
    if (!addNewSubLocation.locationId || !addNewSubLocation.subLocationName) {
      toast.error("Please select location and enter sub-location name");
      return;
    }
    try {
      await addSubLOcation(addNewSubLocation.locationId, {
        subLocationName: addNewSubLocation.subLocationName,
      });
      toast.success("Sub Location Added successfully");
      setAddNewSubLocation({ subLocationName: "", locationId: "" });
      setOpenAddSubLocationModal(false);
      fetchSubLocations();
    } catch (error) {
      toast.error("Failed to add sub location");
    }
  };

  // Update
  const handleUpdateSubLocation = (row) => {
    setEditSubLocation({
      ...row,
    });
    setUpdateSubLocationModal(true);
  };

  const subLocationInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditSubLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSubLocationHandler = async (e) => {
    e.preventDefault();
    if (!editSubLocation?.locationId || !editSubLocation?.subLocationName) {
      toast.error("Please select location and enter sub-location name");
      return;
    }
    try {
      await updateSubLocation(editSubLocation._id, {
        subLocationName: editSubLocation.subLocationName,
        locationId: editSubLocation.locationId,
      });
      toast.success("Sub Location Updated successfully");
      setUpdateSubLocationModal(false);
      setEditSubLocation(null);
      fetchSubLocations();
    } catch (error) {
      toast.error("Failed to update sub location");
    }
  };

  // Delete
  const handleDeleteSubLocation = (row) => {
    setDeleteSubLocationInfo(row);
    setDeleteConfirmationModal(true);
  };

  const deleteSubLocationConfirmationHandler = async (e) => {
    e.preventDefault();
    if (!deleteSubLocationInfo?.locationId || !deleteSubLocationInfo?._id) {
      toast.error("Invalid sub location info");
      return;
    }
    try {
      await deleteSubLocation(
        deleteSubLocationInfo.locationId,
        deleteSubLocationInfo._id
      );
      toast.success("Sub Location Deleted successfully");
      setDeleteConfirmationModal(false);
      setDeleteSubLocationInfo(null);
      fetchSubLocations();
    } catch (error) {
      toast.error("Failed to delete sub location");
    }
  };

  // Exports
  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString() || row?.subLocationId?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box>
          <Button
            onClick={() => setOpenAddSubLocationModal(true)}
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

  // Export handlers
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
    doc.save("Assets-Management-SubLocation.pdf");
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">SUB LOCATION</h2>
        <MaterialReactTable table={table} />
      </div>
      {deleteConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action will permanently delete the sub location.
            </p>
            <form
              onSubmit={deleteSubLocationConfirmationHandler}
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
      {updateSubLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Edit Sub Location
            </h2>
            <form onSubmit={updateSubLocationHandler} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Location*
                </label>
                <span className="w-60 text-lg border-b border-gray-400 text-black">
                  {editSubLocation?.locationName || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Sub Location*
                </label>
                <TextField
                  name="subLocationName"
                  required
                  fullWidth
                  value={editSubLocation?.subLocationName || ""}
                  onChange={subLocationInputChangeHandler}
                  placeholder="Enter Sub Location Name"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateSubLocationModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {openAddSubLocationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add Sub Location
            </h2>
            <form onSubmit={addNewSubLocationHandler} className="space-y-4">
              <div className="flex items-center gap-2 mt-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Location*
                </label>
                <select
                  name="locationId"
                  required
                  value={addNewSubLocation.locationId}
                  onChange={addNewSubLocationChangeHandler}
                  className="w-[250px] border-b-2 border-gray-300 p-2 outline-none cursor-pointer"
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>
                      {loc.locationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Sub Location*
                </label>
                <TextField
                  name="subLocationName"
                  required
                  fullWidth
                  value={addNewSubLocation.subLocationName}
                  onChange={addNewSubLocationChangeHandler}
                  placeholder="Enter Sub Location Name"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setOpenAddSubLocationModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default SubLocation;
