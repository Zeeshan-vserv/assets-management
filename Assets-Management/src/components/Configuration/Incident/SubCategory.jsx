import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getAllCategory,
  getAllSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../../../api/IncidentCategoryRequest";

const SubCategory = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    categoryId: "",
    subCategoryName: "",
  });

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({});

  // Fetch categories and subcategories
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        getAllCategory(),
        getAllSubCategory(),
      ]);
      setCategories(catRes?.data?.data || []);
      setData(
        (subRes?.data?.data || []).map((sub) => {
          const parent = (catRes?.data?.data || []).find((c) =>
            c.subCategories.some((s) => s.subCategoryId === sub.subCategoryId)
          );
          return {
            ...sub,
            categoryId: parent?.categoryId,
            categoryName: parent?.categoryName,
            parentId: parent?._id,
          };
        })
      );
    } catch (err) {
      toast.error("Failed to fetch subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "subCategoryId", header: "SubCategory Id" },
      { accessorKey: "subCategoryName", header: "SubCategory Name" },
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
                ...row.original,
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
              setDeleteInfo({
                categoryId: row.original.parentId,
                subCategoryId: row.original.subCategoryId,
              });
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
    getRowId: (row) => `${row.categoryId}-${row.subCategoryId}`,
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

  // Add SubCategory Handler
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    try {
      const parent = categories.find(
        (c) => c.categoryId === Number(addForm.categoryId)
      );
      if (!parent) {
        toast.error("Invalid category");
        return;
      }
      const res = await addSubCategory(parent._id, {
        subCategoryName: addForm.subCategoryName,
      });
      if (res?.data?.success) {
        toast.success("SubCategory created successfully");
        setOpenAddModal(false);
        setAddForm({ categoryId: "", subCategoryName: "" });
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to create subcategory");
    }
  };

  // Edit SubCategory Handler
  const handleEditSubCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await updateSubCategory(editForm._id, {
        subCategoryName: editForm.subCategoryName,
      });
      if (res?.data?.success) {
        toast.success("SubCategory updated successfully");
        setOpenEditModal(false);
        setEditForm(null);
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to update subcategory");
    }
  };

  const handleDeleteSubCategory = async () => {
    try {
      await deleteSubCategory(deleteInfo.categoryId, deleteInfo.subCategoryId);
      toast.success("SubCategory deleted successfully");
      setDeleteModal(false);
      setDeleteInfo({});
      fetchData();
    } catch (err) {
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          INCIDENT SUBCATEGORY
        </h2>
        <MaterialReactTable table={table} />
      </div>

      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add SubCategory
            </h2>
            <form onSubmit={handleAddSubCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Category*
                </label>
                <Select
                  required
                  value={addForm.categoryId}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  displayEmpty
                  variant="standard"
                  sx={{ width: 250 }}
                >
                  <MenuItem value="" disabled>
                    Select Category
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  SubCategory Name*
                </label>
                <TextField
                  name="subCategoryName"
                  required
                  fullWidth
                  value={addForm.subCategoryName}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      subCategoryName: e.target.value,
                    }))
                  }
                  placeholder="Enter SubCategory Name"
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

      {openEditModal && editForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Edit SubCategory
            </h2>
            <form onSubmit={handleEditSubCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  SubCategory Name*
                </label>
                <TextField
                  name="subCategoryName"
                  required
                  fullWidth
                  value={editForm.subCategoryName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      subCategoryName: e.target.value,
                    }))
                  }
                  placeholder="Enter SubCategory Name"
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
              This action will permanently delete the subcategory.
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
                onClick={handleDeleteSubCategory}
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

export default SubCategory;
