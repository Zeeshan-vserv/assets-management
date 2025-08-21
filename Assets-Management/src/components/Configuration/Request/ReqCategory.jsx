import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createServiceCategory,
  deleteServiceCategory,
  getAllServiceCategory,
  updateServiceCategory,
} from "../../../api/globalServiceRequest";

const ReqCategory = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ categoryName: "" });

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAllServiceCategory();
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "categoryId", header: "Category Id" },
      { accessorKey: "categoryName", header: "Category Name" },
      {
        id: "edit",
        header: "Edit",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setEditForm({
                _id: row.original._id,
                categoryName: row.original.categoryName,
              });
              setOpenEditModal(true);
            }}
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
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => {
              setDeleteId(row.original._id);
              setDeleteModal(true);
            }}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: { density: "compact", pagination: { pageSize: 5 } },
    renderTopToolbarCustomActions: () => (
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
      </Box>
    ),
    muiTableProps: {
      sx: {
        border: "1px solid rgba(81, 81, 81, .5)",
        caption: { captionSide: "top" },
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

  // Add Category Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user?.userId,
        categoryName: addForm.categoryName,
      };
      const res = await createServiceCategory(formData);
      if (res?.data?.success) {
        toast.success("Category created successfully");
        setOpenAddModal(false);
        setAddForm({ categoryName: "" });
        fetchCategories();
      }
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  // Edit Category Handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        categoryName: editForm.categoryName,
      };
      const res = await updateServiceCategory(editForm._id, updateData);
      if (res?.data?.success) {
        toast.success("Category updated successfully");
        setOpenEditModal(false);
        setEditForm(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error("Failed to update category");
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async () => {
    try {
      await deleteServiceCategory(deleteId);
      toast.success("Category deleted successfully");
      setDeleteModal(false);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          SERVICE CATEGORY
        </h2>
        <MaterialReactTable table={table} />
      </div>
      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Category Name <span className="text-red-500 text-base">*</span>
                </label>
                <TextField
                  name="categoryName"
                  required
                  fullWidth
                  value={addForm.categoryName}
                  onChange={(e) => setAddForm({ categoryName: e.target.value })}
                  placeholder="Enter Category Name"
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

      {/* Edit Modal */}
      {openEditModal && editForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Edit Category
            </h2>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Category Name <span className="text-red-500 text-base">*</span>
                </label>
                <TextField
                  name="categoryName"
                  required
                  fullWidth
                  value={editForm.categoryName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      categoryName: e.target.value,
                    }))
                  }
                  placeholder="Enter Category Name"
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
                  onClick={() => setOpenEditModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action will permanently delete the category.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="shadow-md px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReqCategory;
