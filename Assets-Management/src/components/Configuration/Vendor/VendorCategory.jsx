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
  createVendorCategory,
  deleteVendorCategory,
  getAllVendorCategory,
  updateVendorCategory,
} from "../../../api/VendorStatusCategoryRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-VendorCategory.csv",
});

function VendorCategory() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addVendorCategoryModal, setAddVendorCategoryModal] = useState(false);
  const [addNewVendorCategory, setAddNewVendorCategory] = useState({
    categoryName: "",
  });

  const [editVendorCategory, setEditVendorCategory] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteVendorCategoryId, setDeleteVendorCategoryId] = useState(null);

  const fetchVendorCategory = async () => {
    try {
      setIsLoading(true);
      const response = await getAllVendorCategory();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching vendor category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorCategory();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "categoryId",
        header: "Vendor Category Id",
      },
      {
        accessorKey: "categoryName",
        header: "Category Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateVendorCategory(row.original._id)}
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
            onClick={() => handleDeleteVendorCategory(row.original._id)}
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

  //Add
  const addNewVendorCategoryChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewVendorCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewVendorCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user?.userId,
        categoryName: addNewVendorCategory.categoryName,
      };
      const createVendorCategoryResponse = await createVendorCategory(formData);
      if (createVendorCategoryResponse?.data?.success) {
        toast.success("Vendor Category created successfully");
        setAddNewVendorCategory({ categoryName: "" });
        fetchVendorCategory();
      }
    } catch (error) {
      console.error("Error adding new vendor category:", error);
    }
    setAddVendorCategoryModal(false);
  };

  //update
  const handleUpdateVendorCategory = (id) => {
    const vendorCategoryToEdit = data?.find((d) => d._id === id);
    if (vendorCategoryToEdit) {
      setEditVendorCategory({
        _id: vendorCategoryToEdit._id,
        categoryName: vendorCategoryToEdit.categoryName,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateVendorCategoryChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditVendorCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateVendorCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        categoryName: editVendorCategory.categoryName,
      };
      const updateVendorCategoryResponse = await updateVendorCategory(
        editVendorCategory._id,
        updatedData
      );
      if (updateVendorCategoryResponse?.data?.success) {
        toast.success("Vendor category updated successfully");
        fetchVendorCategory();
      }
      setEditVendorCategory(null);
    } catch (error) {
      console.error("Error updating vendor category:", error);
    }
    setOpenUpdateModal(false);
  };

  //delete
  const handleDeleteVendorCategory = (id) => {
    setDeleteVendorCategoryId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteVendorCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const deleteVendorCategoryResponse = await deleteVendorCategory(
        deleteVendorCategoryId
      );
      if (deleteVendorCategoryResponse?.data?.success) {
        toast.success("Vendor category deleted successfully");
        fetchVendorCategory();
      }
    } catch (error) {
      console.error("Error deleting vendor category:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteVendorCategoryId(null);
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
    doc.save("Assets-Management-VendorCategory.pdf");
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
            onClick={() => setAddVendorCategoryModal(true)}
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

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          VENDOR CATEGORY
        </h2>
        <MaterialReactTable table={table} />
        {addVendorCategoryModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-start">
                Add Vendor Category
              </h2>
              <form
                onSubmit={addNewVendorCategoryHandler}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Category
                  </label>
                  <TextField
                    name="categoryName"
                    required
                    fullWidth
                    value={addNewVendorCategory?.categoryName || ""}
                    onChange={addNewVendorCategoryChangeHandler}
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
                    onClick={() => setAddVendorCategoryModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {openUpdateModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
                <h2 className="text-lg font-semibold mb-4 text-start">
                  Edit Vendor Category
                </h2>
                <form
                  onSubmit={updateVendorCategoryHandler}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Vendor Category *
                    </label>
                    <TextField
                      name="categoryName"
                      required
                      fullWidth
                      value={editVendorCategory?.categoryName || ""}
                      onChange={updateVendorCategoryChangeHandler}
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
                      onClick={() => setOpenUpdateModal(false)}
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
        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the department.
              </p>
              <form
                onSubmit={deleteVendorCategoryHandler}
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

export default VendorCategory;
