import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createPredefinedResponse,
  deletePredefinedResponse,
  getAllPredefinedResponses,
  updatePredefinedResponse,
} from "../../../api/ConfigurationIncidentRequest";

const PredefinedReplies = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    predefinedTitle: "",
    predefinedContent: "",
  });

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch predefined replies
  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      const res = await getAllPredefinedResponses();
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch predefined replies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "predefinedResponseId", header: "Id" },
      { accessorKey: "predefinedTitle", header: "Title" },
      { accessorKey: "predefinedContent", header: "Content" },
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
                predefinedTitle: row.original.predefinedTitle,
                predefinedContent: row.original.predefinedContent,
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

  // Add Handler
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user?.userId,
        predefinedTitle: addForm.predefinedTitle,
        predefinedContent: addForm.predefinedContent,
      };
      const res = await createPredefinedResponse(formData);
      if (res?.data?.success) {
        toast.success("Predefined reply created successfully");
        setOpenAddModal(false);
        setAddForm({ predefinedTitle: "", predefinedContent: "" });
        fetchReplies();
      }
    } catch (err) {
      toast.error("Failed to create predefined reply");
    }
  };

  // Edit Handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        predefinedTitle: editForm.predefinedTitle,
        predefinedContent: editForm.predefinedContent,
      };
      const res = await updatePredefinedResponse(editForm._id, updateData);
      if (res?.data?.success) {
        toast.success("Predefined reply updated successfully");
        setOpenEditModal(false);
        setEditForm(null);
        fetchReplies();
      }
    } catch (err) {
      toast.error("Failed to update predefined reply");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deletePredefinedResponse(deleteId);
      toast.success("Predefined reply deleted successfully");
      setDeleteModal(false);
      setDeleteId(null);
      fetchReplies();
    } catch (err) {
      toast.error("Failed to delete predefined reply");
    }
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          PREDEFINED REPLIES
        </h2>
        <MaterialReactTable table={table} />
      </div>

      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Add Predefined Reply
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Title <span className="text-red-500">*</span>
                </label>
                <TextField
                  name="predefinedTitle"
                  required
                  fullWidth
                  value={addForm.predefinedTitle}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      predefinedTitle: e.target.value,
                    }))
                  }
                  placeholder="Enter Title"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Content <span className="text-red-500">*</span>
                </label>
                <TextareaAutosize
                  name="predefinedContent"
                  className="border-[1px] border-black rounded-md p-1 focus:border-blue-500 focus:border-2 outline-none"
                  required
                  minRows={3}
                  style={{
                    width: 250,
                    fontFamily: "inherit",
                    fontSize: "1rem",
                  }}
                  value={addForm.predefinedContent}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      predefinedContent: e.target.value,
                    }))
                  }
                  placeholder="Enter Content"
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
              Edit Predefined Reply
            </h2>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Title <span className="text-red-500">*</span>
                </label>
                <TextField
                  name="predefinedTitle"
                  required
                  fullWidth
                  value={editForm.predefinedTitle}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      predefinedTitle: e.target.value,
                    }))
                  }
                  placeholder="Enter Title"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Content <span className="text-red-500">*</span>
                </label>
                <TextareaAutosize
                  name="predefinedContent"
                  required
                  className="border-[1px] border-black rounded-md p-1 focus:border-blue-500 focus:border-2 outline-none"
                  minRows={3}
                  style={{
                    width: 250,
                    fontFamily: "inherit",
                    fontSize: "1rem",
                  }}
                  value={editForm.predefinedContent}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      predefinedContent: e.target.value,
                    }))
                  }
                  placeholder="Enter Content"
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
              This action will permanently delete the predefined reply.
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

export default PredefinedReplies;
