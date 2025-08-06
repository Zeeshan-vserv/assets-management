import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Select } from "@mui/material";
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
  createLocation,
  deleteLocation,
  getAllLocation,
  updateLocation,
} from "../../../api/LocationRequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Components",
});

function Location() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddLocationModal, setOpenAddLocationModal] = useState(false);
  const [addNewLocation, setAddNewLocation] = useState({ locationName: "" });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteLocationId, setDeleteLocationId] = useState(null);
  const [updateLocationModal, setUpdateLocationModal] = useState(false);
  const [editLocations, setEditLocations] = useState(null);

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      const response = await getAllLocation();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "locationId",
        header: "Location Id",
      },
      {
        accessorKey: "locationName",
        header: "Location Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateLocation(row.original._id)}
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
            onClick={() => handleDeleteLocation(row.original._id)}
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
  //add
  const addNewLocationChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewLocationHandler = async (e) => {
    e.preventDefault();
    const formData = {
      userId: user?.userId,
      locationName: addNewLocation?.locationName,
    };
    const response = await createLocation(formData);
    if (response?.data?.success) {
      toast.success("Location created successfully");
      await fetchLocation();
      setAddNewLocation({ locationName: "" });
      setOpenAddLocationModal(false);
    }
  };

  //update
  const handleUpdateLocation = (id) => {
    const locationToEdit = data?.find((d) => d._id === id);
    if (locationToEdit) {
      setEditLocations({
        _id: locationToEdit._id,
        locationName: locationToEdit?.locationName,
      });
    }
    setUpdateLocationModal(true);
  };

  const locationInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditLocations((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateLocationHandler = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        locationName: editLocations?.locationName,
      };
      await updateLocation(editLocations?._id, updateData);
      toast.success("Location updated successfully");
      await fetchLocation();
      setEditLocations(null);
      setUpdateLocationModal(false);
    } catch (error) {
      console.error("Error updating locaction:", error);
    }
  };

  //delete
  const handleDeleteLocation = (id) => {
    setDeleteLocationId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteLocationConfirmationHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteLocation(deleteLocationId);
      toast.success("Location deleted successfully");
      await fetchLocation();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteLocationId(null);
  };

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

        // Format date fields
        // if (
        //   [
        //     "entryDate",
        //     "bgIssueDate",
        //     "expireDate",
        //     "amendDate",
        //     "claimDate",
        //   ].includes(key)
        // ) {
        //   value = value ? new Date(value).toLocaleDateString() : "";
        // }

        return value ?? "";
      })
    );

    const doc = new jsPDF({
      // format: "a3",
      // orientation: "landscape",
    });

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
    getRowId: (row) => row?.locationId?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box>
          <Button
            onClick={() => setOpenAddLocationModal(true)}
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
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },

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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">LOCATION</h2>
        <MaterialReactTable table={table} />
      </div>
      {deleteConfirmationModal && (
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
                onSubmit={deleteLocationConfirmationHandler}
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
        </>
      )}
      {updateLocationModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Edit Location
              </h2>
              <form onSubmit={updateLocationHandler} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Location*
                  </label>
                  <TextField
                    name="locationName"
                    required
                    fullWidth
                    value={editLocations?.locationName || ""}
                    onChange={locationInputChangeHandler}
                    placeholder="Enter Loaction Name"
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
                    onClick={() => setUpdateLocationModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {openAddLocationModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Add Location
              </h2>
              <form onSubmit={addNewLocationHandler} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Location*
                  </label>
                  <TextField
                    name="locationName"
                    required
                    fullWidth
                    value={addNewLocation?.locationName || ""}
                    onChange={addNewLocationChangeHandler}
                    placeholder="Enter Location Name"
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
                    onClick={() => setOpenAddLocationModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Location;
