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
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Components",
});

function SubLocation() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddSubLocationModal, setOpenAddSubLocationModal] = useState(false);
  const [addNewSubLocation, setAddNewSubLocation] = useState({
    subLocationName: "",
  });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSubLocationId, setDeleteSubLocationId] = useState(null);
  const [updateSubLocationModal, setUpdateSubLocationModal] = useState(false);
  const [editSubLocations, setEditSubLocations] = useState(null);

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://dummyjson.com/products");
      const subLocationData = response?.data?.products?.map((value) => ({
        id: value.id,
        location: value.title,
        subLocationName: value.title,
      }));
      setData(subLocationData);
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
        accessorKey: "id",
        header: "Sub Location Id",
      },
      {
        accessorKey: "location",
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
            onClick={() => handleUpdateSubLocation(row.original.id)}
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
            onClick={() => handleDeleteSubLocation(row.original.id)}
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
  const addNewSubLocationChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSubLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSubLocationHandler = (e) => {
    e.preventDefault();
    console.log("added");
    //call api
    // console.log(addNewSubLocation);
    setAddNewSubLocation({ location: "" });
    setOpenAddSubLocationModal(false);
  };

  //update
  const handleUpdateSubLocation = (id) => {
    setEditSubLocations();
    setUpdateSubLocationModal(true);
  };

  const subLocationInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditSubLocations((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSubLocationHandler = (e) => {
    e.preventDefault();
    // editSubLocations
    //call api
    setUpdateSubLocationModal(false);
  };

  //delete
  const handleDeleteSubLocation = (id) => {
    setDeleteSubLocationId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteSubLocationConfirmationHandler = (e) => {
    e.preventDefault();
    console.log("deleted");
    // deleteSubLocationId
    //call api
    setDeleteConfirmationModal(false);
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
    getRowId: (row) => row?.id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6 text-start">SUB LOCATION</h2>
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
                onSubmit={deleteSubLocationConfirmationHandler}
                className="flex justify-end gap-3"
              >
                <button
                  type="button"
                  onClick={() => setDeleteConfirmationModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </>
      )}
      {updateSubLocationModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Sub Location
              </h2>
              <form onSubmit={updateSubLocationHandler}>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Sub Location*
                  </label>
                  <TextField
                    name="subLocationName"
                    required
                    fullWidth
                    value={editSubLocations?.subLocationName || ""}
                    onChange={subLocationInputChangeHandler}
                    placeholder="Enter Sub Location Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setUpdateSubLocationModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {openAddSubLocationModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Add Sub Location
              </h2>
              <form onSubmit={addNewSubLocationHandler}>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Sub Location*
                  </label>
                  <TextField
                    name="subLocationName"
                    required
                    fullWidth
                    value={addNewSubLocation?.subLocationName || ""}
                    onChange={addNewSubLocationChangeHandler}
                    placeholder="Enter Sub Location Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenAddSubLocationModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Add
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

export default SubLocation;
