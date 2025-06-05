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
import axios from "axios";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

function Components() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editComponents, setEditComponents] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newComponent, setNewComponent] = useState({ name: "" });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteComponentsId, setDeleteComponentsId] = useState(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = response.data.map((user) => ({
        id: user.id,
        name: user.name,
      }));
      setData(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Components Id",
      },
      {
        accessorKey: "name",
        header: "Components Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleEditComponents(row.original.id)}
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
            onClick={() => handleDeleteComponents(row.original.id)}
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

  const handleEditComponents = (id) => {
    const newComponents = data.find((val) => String(val?.id) === String(id));
    setEditComponents(newComponents);
    setOpenModal(true);
  };

  const handleDeleteComponents = (id) => {
    setDeleteComponentsId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteComponentConfirmationHandler = () => {
    const filterData = data.filter((val) => val.id !== deleteComponentsId);
    setData(filterData);
    setDeleteConfirmationModal(false);
  };

  const componentsInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditComponents((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateComponentsHandler = (e) => {
    e.preventDefault();
    const updatedComponentsData = data.map((user) =>
      user.id === editComponents?.id ? editComponents : user
    );
    setData(updatedComponentsData);
    //call api
    setOpenModal(false);
  };

  //Add New components
  const newComponentChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewComponent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewComponentHandler = (e) => {
    e.preventDefault();
    console.log("add new components");
    //call api
    setNewComponent({ name: "" });
    setOpenAddModal(false);
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?.id?.toString(),
    enableRowSelection: true,
    renderTopToolbarCustomActions: ({ table }) => {
      const handleExportRows = (rows) => {
        const excludedColumns = ["mrt-row-select", "edit", "delete"];
        const visibleCols = table
          .getVisibleLeafColumns()
          .filter((col) => !excludedColumns.includes(col.id));

        const rowData = rows.map((row) => {
          const exportRow = {};
          visibleCols.forEach((col) => {
            const header = col.columnDef.header || col.id;
            exportRow[header] = row.original[col.id];
          });
          return exportRow;
        });
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
      };

      const handleExportData = () => {
        const excludedColumns = ["mrt-row-select", "edit", "delete"];
        const visibleCols = table
          .getVisibleLeafColumns()
          .filter((col) => !excludedColumns.includes(col.id));

        const exportData = data.map((item) => {
          const exportRow = {};
          visibleCols.forEach((col) => {
            const header = col.columnDef.header || col.id;
            exportRow[header] = item[col.id];
          });
          return exportRow;
        });

        const csv = generateCsv(csvConfig)(exportData);
        download(csvConfig)(csv);
      };

      const handleExportPDF = () => {
        const excludedColumns = ["mrt-row-select", "edit", "delete"];
        const visibleColumns = table
          .getAllLeafColumns()
          .filter(
            (col) => col.getIsVisible() && !excludedColumns.includes(col.id)
          );

        const headers = visibleColumns.map(
          (col) => col.columnDef.header || col.id
        );
        const exportData = data.map((item) => [item.id, item.name]);

        const doc = new jsPDF({ orientation: "landscape", format: "a3" });
        autoTable(doc, {
          head: [headers],
          body: exportData,
          styles: { fontSize: 12 },
          headStyles: { fillColor: [66, 139, 202] },
          margin: { top: 20 },
        });

        doc.save("exported_data.pdf");
      };

      return (
        <Box>
          <Button
            onClick={() => setOpenAddModal(true)}
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
            onClick={handleExportPDF}
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
      rowsPerPageOptions: [5, 10],
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
        border: "1px solid rgba(81, 81, 81, .5)",
        fontWeight: "normal",
        backgroundColor: "#f0f9ff",
        color: "#1e3a8a",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
      },
    },
  });
  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 py-4 bg-gray-50 w-full">
        <div className="w-full max-w-7xl">
          <h2 className="text-lg font-semibold mb-6 text-start">
            ALL COMPONENTS
          </h2>
          <MaterialReactTable table={table} />
        </div>
     
        {openModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Component
              </h2>
              <form onSubmit={updateComponentsHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={editComponents?.name || ""}
                    onChange={componentsInputChangeHandler}
                    placeholder="Enter component name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {openAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Add Component
              </h2>
              <form onSubmit={addNewComponentHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newComponent?.name || ""}
                    onChange={newComponentChangeHandler}
                    required
                    placeholder="Enter component name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the component.
              </p>
              <form
                onSubmit={deleteComponentConfirmationHandler}
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
        )}
      </div>
    </>
  );
}

export default Components;
