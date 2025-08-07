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
import {
  createComponent,
  getAllComponent,
  updateComponent,
  deleteComponent,
} from "../../../api/ComponentsRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Components",
});

function Components() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editComponents, setEditComponents] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteComponentsId, setDeleteComponentsId] = useState(null);
  const [newComponent, setNewComponent] = useState({ componentName: "" });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getAllComponent();
      const component = response?.data?.data?.map((value) => ({
        id: value.componentId,
        name: value.componentName,
        _id: value._id,
      }));
      setData(component);
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
    const componentToEdit = data?.find((component) => component?.id === id);
    if (componentToEdit) {
      setEditComponents({
        _id: componentToEdit._id,
        id: componentToEdit._id,
        name: componentToEdit.name,
      });
      setOpenModal(true);
    }
  };

  const componentsInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditComponents((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateComponentsHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        componentName: editComponents.name,
      };
      const response = await updateComponent(editComponents._id, formData);
      if (response?.data?.success) {
        toast.success("Component updated successfully");
        setData((prevData) =>
          prevData.map((item) =>
            item._id === editComponents._id
              ? { ...item, name: editComponents.name }
              : item
          )
        );
        await fetchUser();
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error updating component:", error);
    }
  };

  //Add New components
  const newComponentChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewComponent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewComponentHandler = async (e) => {
    e.preventDefault();
    const formData = {
      userId: user?.userId,
      componentName: newComponent.componentName,
    };
    const response = await createComponent(formData);
    if (response?.data?.success) {
      toast.success("Component Added successfully");
      fetchUser();
      setNewComponent({ componentName: "" });
      setOpenAddModal(false);
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

  const handleDeleteComponents = (id) => {
    const componentToDelete = data?.find((component) => component?.id === id);
    if (componentToDelete) {
      setDeleteComponentsId(componentToDelete?._id);
      setDeleteConfirmationModal(true);
    }
  };

  const deleteComponentConfirmationHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteComponent(deleteComponentsId);
      if (response?.data?.success) {
        toast.success("Component deleted successfully");
        setData((prevData) =>
          prevData.filter((component) => component._id !== deleteComponentsId)
        );
        setDeleteConfirmationModal(false);
      }
    } catch (error) {
      console.error(
        "Error deleting component:",
        error.response?.data?.message || error.message
      );
    }
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
        // border: "1px solid #dddddd",
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
        <h2 className="text-lg font-semibold mb-6 text-start">
          ALL COMPONENTS
        </h2>
        <MaterialReactTable table={table} />
        {openModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Edit Component
              </h2>
              <form onSubmit={updateComponentsHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-2"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {openAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Add Component
              </h2>
              <form onSubmit={addNewComponentHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="componentName"
                    className="text-sm font-medium text-gray-600 mb-2"
                  >
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="componentName"
                    type="text"
                    name="componentName"
                    value={newComponent?.componentName || ""}
                    onChange={newComponentChangeHandler}
                    required
                    placeholder="Enter component name"
                    className="px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenAddModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                onSubmit={deleteComponentConfirmationHandler}
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
      </div>
    </>
  );
}

export default Components;
