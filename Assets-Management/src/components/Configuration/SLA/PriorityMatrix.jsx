import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextField } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import {
  createPriorityMatrix,
  deletePriorityMatrix,
  getAllPriorityMatrices,
  updatePriorityMatrix,
} from "../../../api/slaRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PriorityMatrix = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addPriorityMatrixModal, setAddPriorityMatrixModal] = useState(false);
  const [addNewPriorityMatrix, setAddNewPriorityMatrix] = useState({
    urgency: "",
    impact: "",
    priority: "",
  });
  const [editPriorityMatrix, setEditPriorityMatrix] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deletePriorityMatrixId, setDeletePriorityMatrixId] = useState(null);

  const fetchPriorityMatrix = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPriorityMatrices();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching priority matrix:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityMatrix();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "urgency",
        header: "Urgency",
      },
      {
        accessorKey: "impact",
        header: "Impact",
      },
      {
        accessorKey: "priority",
        header: "	Priority",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdatePriorityMatrix(row.original._id)}
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
            onClick={() => handleDeletePriorityMatrix(row.original._id)}
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

  //Add priority matrix
  const addNewPriorityMatrixChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewPriorityMatrix((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const addNewPriorityMatrixHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user.userId,
        urgency: addNewPriorityMatrix.urgency,
        impact: addNewPriorityMatrix.impact,
        priority: addNewPriorityMatrix.priority,
      };
      const response = await createPriorityMatrix(formData);
      if (response?.data.success) {
        toast.success("Priority matrix created successfully");
        await fetchPriorityMatrix();
        setAddPriorityMatrixModal(false);
      }
      setAddNewPriorityMatrix({
        urgency: "",
        impact: "",
        priority: "",
      });
    } catch (error) {
      console.log("Error creating priority matrix", error);
    }
  };

  //Update
  const handleUpdatePriorityMatrix = (id) => {
    const priorityMatrixToEdit = data?.find((d) => d._id === id);
    if (priorityMatrixToEdit) {
      setEditPriorityMatrix({
        _id: priorityMatrixToEdit._id,
        urgency: priorityMatrixToEdit.urgency,
        impact: priorityMatrixToEdit.impact,
        priority: priorityMatrixToEdit.priority,
      });
      setOpenUpdateModal(true);
    }
  };

  const updatePriorityMatrixChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditPriorityMatrix((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePriorityMatrixHandler = async (e) => {
    e.preventDefault();
    if (!editPriorityMatrix?._id) return;
    const updatedData = {
      urgency: editPriorityMatrix.urgency,
      impact: editPriorityMatrix.impact,
      priority: editPriorityMatrix.priority,
    };
    try {
      const response = await updatePriorityMatrix(
        editPriorityMatrix?._id,
        updatedData
      );
      if (response?.data?.success) {
        toast.success("Priority matrix updated successfully");
        await fetchPriorityMatrix();
        setOpenUpdateModal(false);
        setEditPriorityMatrix(null);
      }
    } catch (error) {
      console.error("Error updating priority matrix:", error);
    }
  };

  //Delete
  const handleDeletePriorityMatrix = (id) => {
    setDeletePriorityMatrixId(id);
    setDeleteConfirmationModal(true);
  };
  const deletePriorityMatrixHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deletePriorityMatrix(deletePriorityMatrixId);
      if (response?.data.success) {
        toast.success("Priority matrix deleted successfully");
        await fetchPriorityMatrix();
      }
    } catch (error) {
      console.error("Error deleting priority matrix:", error);
    }
    setDeleteConfirmationModal(false);
    setDeletePriorityMatrixId(null);
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box>
          <Button
            onClick={() => setAddPriorityMatrixModal(true)}
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
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          PRIORITY MATRIX
        </h2>
        <div>
          <MaterialReactTable table={table} />
        </div>
        {addPriorityMatrixModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium mb-4 text-start">
                Add Priority Matrix
              </h2>
              <form
                onSubmit={addNewPriorityMatrixHandler}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Urgency
                  </label>
                  <select
                    name="urgency"
                    value={addNewPriorityMatrix?.urgency || ""}
                    onChange={addNewPriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Critical">Critical</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Impact
                  </label>
                  <select
                    name="impact"
                    value={addNewPriorityMatrix?.impact || ""}
                    onChange={addNewPriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Critical">Critical</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={addNewPriorityMatrix?.priority || ""}
                    onChange={addNewPriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Severity - 1">Severity - 1</option>
                    <option value="Severity - 2">Severity - 2</option>
                    <option value="Severity - 3">Severity - 3</option>
                    <option value="Severity - 4">Severity - 4</option>
                  </select>
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
                    onClick={() => setAddPriorityMatrixModal(false)}
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
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium mb-4 text-start">
                Edit Priority Matrix
              </h2>
              <form
                onSubmit={updatePriorityMatrixHandler}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Urgency
                  </label>
                  <select
                    name="urgency"
                    value={editPriorityMatrix?.urgency || ""}
                    onChange={updatePriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Critical">Critical</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Impact
                  </label>
                  <select
                    name="impact"
                    value={editPriorityMatrix?.impact || ""}
                    onChange={updatePriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Critical">Critical</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={editPriorityMatrix?.priority || ""}
                    onChange={updatePriorityMatrixChangeHandler}
                    placeholder="Enter Urgency"
                    className="border border-gray-400 px-2 py-1 rounded w-[65%] cursor-pointer outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Severity - 1">Severity - 1</option>
                    <option value="Severity - 2">Severity - 2</option>
                    <option value="Severity - 3">Severity - 3</option>
                    <option value="Severity - 4">Severity - 4</option>
                  </select>
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
                    onClick={() => setOpenUpdateModal(false)}
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
                This action will permanently delete the department.
              </p>
              <form
                onSubmit={deletePriorityMatrixHandler}
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
};

export default PriorityMatrix;
