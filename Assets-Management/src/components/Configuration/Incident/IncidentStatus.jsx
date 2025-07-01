// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import {
//   Box,
//   Button,
//   IconButton,
//   TextareaAutosize,
//   TextField,
// } from "@mui/material";
// import { MdModeEdit } from "react-icons/md";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import {
//   createPredefinedResponse,
//   deletePredefinedResponse,
//   getAllPredefinedResponses,
//   updatePredefinedResponse,
// } from "../../../api/ConfigurationIncidentRequest";
// const IncidentStatus = () => {
//   const user = useSelector((state) => state.authReducer.authData);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Add Modal State
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [addForm, setAddForm] = useState({
//     statusName: "",
//     description: "",
//     description: "",
//     clockHold: "",
//     reason: "",
//   });

//   // Edit Modal State
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [editForm, setEditForm] = useState(null);

//   // Delete Modal State
//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   // Fetch predefined replies
//   const fetchReplies = async () => {
//     setIsLoading(true);
//     try {
//       const res = await getAllPredefinedResponses();
//       setData(res?.data?.data || []);
//     } catch (err) {
//       toast.error("Failed to fetch predefined replies");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReplies();
//   }, []);

//   // Table columns
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "statusName",
//         header: "Status Name",
//       },
//       {
//         accessorKey: "description",
//         header: "Description",
//       },
//       {
//         accessorKey: "clockHold",
//         header: "Clock Hold",
//       },
//       {
//         accessorKey: "reason",
//         header: "Reason",
//       },
//       {
//         id: "edit",
//         header: "Edit",
//         size: 80,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() => handleEditComponents(row.original.id)}
//             color="primary"
//             aria-label="edit"
//           >
//             <MdModeEdit />
//           </IconButton>
//         ),
//       },
//       {
//         id: "delete",
//         header: "Delete",
//         size: 80,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() => handleDeleteComponents(row.original.id)}
//             color="error"
//             aria-label="delete"
//           >
//             <DeleteIcon />
//           </IconButton>
//         ),
//       },
//     ],
//     [isLoading]
//   );

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     getRowId: (row) => row?._id?.toString(),
//     enableRowSelection: true,
//     initialState: { density: "compact", pagination: { pageSize: 5 } },
//     renderTopToolbarCustomActions: () => (
//       <Box>
//         <Button
//           onClick={() => setOpenAddModal(true)}
//           variant="contained"
//           size="small"
//           startIcon={<AddCircleOutlineIcon />}
//           sx={{
//             backgroundColor: "#2563eb",
//             color: "#fff",
//             textTransform: "none",
//             mt: 1,
//             mb: 1,
//           }}
//         >
//           New
//         </Button>
//       </Box>
//     ),
//     muiTableProps: {
//       sx: {
//         border: "1px solid rgba(81, 81, 81, .5)",
//         caption: { captionSide: "top" },
//       },
//     },
//     paginationDisplayMode: "pages",
//     positionToolbarAlertBanner: "bottom",
//     muiPaginationProps: {
//       color: "secondary",
//       rowsPerPageOptions: [10, 15, 20],
//       shape: "rounded",
//       variant: "outlined",
//     },
//     enablePagination: true,
//     muiTableHeadCellProps: {
//       sx: {
//         backgroundColor: "#f1f5fa",
//         color: "#303E67",
//         fontSize: "14px",
//         fontWeight: "500",
//       },
//     },
//     muiTableBodyRowProps: ({ row }) => ({
//       sx: {
//         backgroundColor: row.index % 2 === 1 ? "#f1f5fa" : "inherit",
//       },
//     }),
//   });

//   // Add Handler
//   const handleAddCategory = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = {
//         userId: user?.userId,
//         predefinedTitle: addForm.predefinedTitle,
//         predefinedContent: addForm.predefinedContent,
//       };
//       const res = await createPredefinedResponse(formData);
//       if (res?.data?.success) {
//         toast.success("Predefined reply created successfully");
//         setOpenAddModal(false);
//         setAddForm({ predefinedTitle: "", predefinedContent: "" });
//         fetchReplies();
//       }
//     } catch (err) {
//       toast.error("Failed to create predefined reply");
//     }
//   };

//   // Edit Handler
//   const handleEditCategory = async (e) => {
//     e.preventDefault();
//     try {
//       const updateData = {
//         predefinedTitle: editForm.predefinedTitle,
//         predefinedContent: editForm.predefinedContent,
//       };
//       const res = await updatePredefinedResponse(editForm._id, updateData);
//       if (res?.data?.success) {
//         toast.success("Predefined reply updated successfully");
//         setOpenEditModal(false);
//         setEditForm(null);
//         fetchReplies();
//       }
//     } catch (err) {
//       toast.error("Failed to update predefined reply");
//     }
//   };

//   // Delete Handler
//   const handleDeleteCategory = async () => {
//     try {
//       await deletePredefinedResponse(deleteId);
//       toast.success("Predefined reply deleted successfully");
//       setDeleteModal(false);
//       setDeleteId(null);
//       fetchReplies();
//     } catch (err) {
//       toast.error("Failed to delete predefined reply");
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
//         <h2 className="text-lg font-semibold mb-6 text-start">
//           PREDEFINED REPLIES
//         </h2>
//         <MaterialReactTable table={table} />
//       </div>

//       {/* Add Modal */}
//       {openAddModal && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Add Predefined Reply
//             </h2>
//             <form onSubmit={handleAddCategory} className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Status Name*
//                 </label>
//                 <TextField
//                   name="statusName"
//                   required
//                   fullWidth
//                   value={addForm.statusName}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       statusName: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Description*
//                 </label>
//                 <TextField
//                   name="description"
//                   required
//                   fullWidth
//                   value={addForm.description}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Reason*
//                 </label>
//                 <TextField
//                   name="reason"
//                   required
//                   fullWidth
//                   value={addForm.reason}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       reason: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Description*
//                 </label>
//                 <input
//                   type="checkbox"
//                   name="description"
//                   value={addForm.description}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpenAddModal(false)}
//                   className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
//                 >
//                   Add
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {openEditModal && editForm && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Edit Predefined Reply
//             </h2>
//             <form onSubmit={handleEditCategory} className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Status Name*
//                 </label>
//                 <TextField
//                   name="statusName"
//                   required
//                   fullWidth
//                   value={addForm.statusName}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       statusName: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Description*
//                 </label>
//                 <TextField
//                   name="description"
//                   required
//                   fullWidth
//                   value={addForm.description}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Reason*
//                 </label>
//                 <TextField
//                   name="reason"
//                   required
//                   fullWidth
//                   value={addForm.reason}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       reason: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Status"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Description*
//                 </label>
//                 <input
//                   type="checkbox"
//                   name="description"
//                   value={addForm.description}
//                   onChange={(e) =>
//                     setAddForm((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpenEditModal(false)}
//                   className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
//                 >
//                   Update
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {deleteModal && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
//             <h2 className="text-xl font-semibold text-red-600 mb-3">
//               Are you sure?
//             </h2>
//             <p className="text-gray-700 mb-6">
//               This action will permanently delete the predefined reply.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setDeleteModal(false)}
//                 className="shadow-md px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-500 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteCategory}
//                 className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default IncidentStatus;

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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createIncidentStatus,
  deleteIncidentStatus,
  getAllIncidentStatus,
  updateIncidentStatus,
} from "../../../api/IncidentStatusRequest";

const IncidentStatus = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    statusName: "",
    description: "",
    clockHold: false,
    reason: "",
  });

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all incident statuses
  const fetchStatuses = async () => {
    setIsLoading(true);
    try {
      const res = await getAllIncidentStatus();
      // Flatten the statusTimeline for table display
      const flatData = (res?.data?.data || []).map((item) => ({
        ...item,
        ...(item.statusTimeline && item.statusTimeline.length > 0
          ? item.statusTimeline[item.statusTimeline.length - 1]
          : {}),
      }));
      setData(flatData);
    } catch (err) {
      toast.error("Failed to fetch incident statuses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "statusName",
        header: "Status Name",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "clockHold",
        header: "Clock Hold",
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
      {
        accessorKey: "reason",
        header: "Reason",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleEditComponents(row.original)}
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
            onClick={() => handleDeleteComponents(row.original._id)}
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
        ...addForm,
        changedBy: user?.userId || "admin",
      };
      const res = await createIncidentStatus(formData);
      if (res?.data?.success) {
        toast.success("Incident status created successfully");
        setOpenAddModal(false);
        setAddForm({
          statusName: "",
          description: "",
          clockHold: false,
          reason: "",
        });
        fetchStatuses();
      }
    } catch (err) {
      toast.error("Failed to create incident status");
    }
  };

  // Edit Handler
  const handleEditCategory = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        statusName: editForm.statusName,
        description: editForm.description,
        clockHold: editForm.clockHold,
        reason: editForm.reason,
        changedBy: user?.userId || "admin",
      };
      const res = await updateIncidentStatus(editForm._id, updateData);
      if (res?.data?.success) {
        toast.success("Incident status updated successfully");
        setOpenEditModal(false);
        setEditForm(null);
        fetchStatuses();
      }
    } catch (err) {
      toast.error("Failed to update incident status");
    }
  };

  // Delete Handler
  const handleDeleteCategory = async () => {
    try {
      await deleteIncidentStatus(deleteId);
      toast.success("Incident status deleted successfully");
      setDeleteModal(false);
      setDeleteId(null);
      fetchStatuses();
    } catch (err) {
      toast.error("Failed to delete incident status");
    }
  };

  // Open Edit Modal
  const handleEditComponents = (row) => {
    setEditForm({
      _id: row._id,
      statusName: row.statusName,
      description: row.description,
      clockHold: row.clockHold,
      reason: row.reason,
    });
    setOpenEditModal(true);
  };

  // Open Delete Modal
  const handleDeleteComponents = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          INCIDENT STATUS
        </h2>
        <MaterialReactTable table={table} />
      </div>

      {/* Add Modal */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Add Incident Status
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Status Name*
                </label>
                <TextField
                  name="statusName"
                  required
                  fullWidth
                  value={addForm.statusName}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      statusName: e.target.value,
                    }))
                  }
                  placeholder="Enter Status"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Description
                </label>
                <TextField
                  name="description"
                  fullWidth
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter Description"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Clock Hold
                </label>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={addForm.clockHold}
                      onChange={(e) =>
                        setAddForm((prev) => ({
                          ...prev,
                          clockHold: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Yes"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Reason
                </label>
                <TextField
                  name="reason"
                  fullWidth
                  value={addForm.reason}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter Reason"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
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
      )}

      {/* Edit Modal */}
      {openEditModal && editForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Edit Incident Status
            </h2>
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Status Name*
                </label>
                <TextField
                  name="statusName"
                  required
                  fullWidth
                  value={editForm.statusName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      statusName: e.target.value,
                    }))
                  }
                  placeholder="Enter Status"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Description
                </label>
                <TextField
                  name="description"
                  fullWidth
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter Description"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Clock Hold
                </label>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editForm.clockHold}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          clockHold: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="Yes"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Reason
                </label>
                <TextField
                  name="reason"
                  fullWidth
                  value={editForm.reason}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Enter Reason"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenEditModal(false)}
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
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action will permanently delete the incident status.
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

export default IncidentStatus;
