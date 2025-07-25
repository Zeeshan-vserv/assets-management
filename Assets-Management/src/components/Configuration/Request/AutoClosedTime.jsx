// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { Box, Button, IconButton, TextField } from "@mui/material";
// import { MdModeEdit } from "react-icons/md";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import {
//   createAutoCloseTime,
//   getAllAutoCloseTimes,
//   updateAutoCloseTime,
//   deleteClosureCode, // ✅ If API name is correct; else use deleteAutoCloseTime
// } from "../../../api/ConfigurationIncidentRequest";
// const AutoClosedTime = () =>{
//   const user = useSelector((state) => state.authReducer.authData);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [addForm, setAddForm] = useState({ autoCloseTime: "" });

//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [editForm, setEditForm] = useState(null);

//   const [deleteModal, setDeleteModal] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);

//   const fetchAutoCloseTimes = async () => {
//     setIsLoading(true);
//     try {
//       const res = await getAllAutoCloseTimes();
//       setData(res?.data?.data || []);
//     } catch (err) {
//       toast.error("Failed to fetch auto close times");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAutoCloseTimes();
//   }, []);

//   const columns = useMemo(
//     () => [
//       { accessorKey: "autoCloseTimeId", header: "Auto Close Time ID" },
//       { accessorKey: "autoCloseTime", header: "Auto Close Time" },
//       {
//         id: "edit",
//         header: "Edit",
//         size: 60,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() => {
//               setEditForm({
//                 _id: row.original._id,
//                 autoCloseTime: row.original.autoCloseTime,
//               });
//               setOpenEditModal(true);
//             }}
//             color="primary"
//             aria-label="edit"
//           >
//             <MdModeEdit />
//           </IconButton>
//         ),
//       },
//     ],
//     []
//   );

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     getRowId: (row) => row?._id?.toString(),
//     enableRowSelection: true,
//     initialState: { density: "compact", pagination: { pageSize: 5 } },
//     renderTopToolbarCustomActions: () => (
//       <Box>
//         {data.length === 0 && (
//           <Button
//             onClick={() => setOpenAddModal(true)}
//             variant="contained"
//             size="small"
//             startIcon={<AddCircleOutlineIcon />}
//             sx={{
//               backgroundColor: "#2563eb",
//               color: "#fff",
//               textTransform: "none",
//               mt: 1,
//               mb: 1,
//             }}
//           >
//             New
//           </Button>
//         )}
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

//   const handleAddAutoCloseTime = async (e) => {
//     e.preventDefault();
//     if (!addForm.autoCloseTime.trim()) {
//       toast.error("Auto Close Time cannot be empty");
//       return;
//     }

//     try {
//       const formData = {
//         userId: user?.userId,
//         autoCloseTime: addForm.autoCloseTime.trim(),
//       };
//       const res = await createAutoCloseTime(formData);
//       if (res?.data?.success) {
//         toast.success("Auto Close Time created successfully");
//         setOpenAddModal(false);
//         setAddForm({ autoCloseTime: "" });
//         fetchAutoCloseTimes();
//       }
//     } catch (err) {
//       toast.error("Failed to create auto close time");
//     }
//   };

//   const handleEditAutoCloseTime = async (e) => {
//     e.preventDefault();
//     if (!editForm.autoCloseTime.trim()) {
//       toast.error("Auto Close Time cannot be empty");
//       return;
//     }

//     try {
//       const updateData = {
//         autoCloseTime: editForm.autoCloseTime.trim(),
//       };
//       const res = await updateAutoCloseTime(editForm._id, updateData);
//       if (res?.data?.success) {
//         toast.success("Auto Close Time updated successfully");
//         setOpenEditModal(false);
//         setEditForm(null);
//         fetchAutoCloseTimes();
//       }
//     } catch (err) {
//       toast.error("Failed to update auto close time");
//     }
//   };

//   const handleDeleteAutoCloseTime = async () => {
//     try {
//       await deleteClosureCode(deleteId); // ✅ or `deleteAutoCloseTime`
//       toast.success("Auto Close Time deleted successfully");
//       setDeleteModal(false);
//       setDeleteId(null);
//       fetchAutoCloseTimes();
//     } catch (err) {
//       toast.error("Failed to delete auto close time");
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col w-full min-h-full p-4 bg-slate-100">
//         <h2 className="text-lg font-semibold mb-6 text-start">
//           INCIDENT AUTO CLOSE TIME
//         </h2>
//         <MaterialReactTable table={table} />
//       </div>

//       {/* Add Modal */}
//       {openAddModal && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Add Auto Close Time
//             </h2>
//             <form onSubmit={handleAddAutoCloseTime} className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Auto Close Time*
//                 </label>
//                 <TextField
//                   name="autoCloseTime"
//                   required
//                   fullWidth
//                   value={addForm.autoCloseTime}
//                   onChange={(e) =>
//                     setAddForm({ autoCloseTime: e.target.value })
//                   }
//                   placeholder="Enter time in minutes/hours"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpenAddModal(false)}
//                   className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#6f7fbc] text-white px-4 py-2 rounded-md text-sm"
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
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Edit Auto Close Time
//             </h2>
//             <form onSubmit={handleEditAutoCloseTime} className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <label className="w-40 text-sm font-medium text-gray-500">
//                   Auto Close Time*
//                 </label>
//                 <TextField
//                   name="autoCloseTime"
//                   required
//                   fullWidth
//                   value={editForm.autoCloseTime}
//                   onChange={(e) =>
//                     setEditForm((prev) => ({
//                       ...prev,
//                       autoCloseTime: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter time in minutes/hours"
//                   variant="standard"
//                   sx={{ width: 250 }}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setOpenEditModal(false)}
//                   className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#6f7fbc] text-white px-4 py-2 rounded-md text-sm"
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
//               This action will permanently delete the Auto Close Time.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 type="button"
//                 onClick={() => setDeleteModal(false)}
//                 className="border px-4 py-2 rounded-lg text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteAutoCloseTime}
//                 className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm"
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

// export default AutoClosedTime

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
  createAutoCloseTime,
  getAllAutoCloseTimes,
  updateAutoCloseTime,
  deleteAutoCloseTime, // <-- Correct function
} from "../../../api/globalServiceRequest";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const AutoClosedTime = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ autoCloseTime: "" });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all auto close times
  const fetchAutoCloseTimes = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAutoCloseTimes();
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch auto close times");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutoCloseTimes();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "autoCloseTimeId", header: "Auto Close Time ID" },
      { accessorKey: "autoCloseTime", header: "Auto Close Time" },
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
                autoCloseTime: row.original.autoCloseTime,
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

  // Add
  const handleAddAutoCloseTime = async (e) => {
    e.preventDefault();
    if (!addForm.autoCloseTime.trim()) {
      toast.error("Auto Close Time cannot be empty");
      return;
    }
    try {
      const formData = {
        userId: user?.userId,
        autoCloseTime: addForm.autoCloseTime.trim(),
      };
      const res = await createAutoCloseTime(formData);
      if (res?.data?.success) {
        toast.success("Auto Close Time created successfully");
        setOpenAddModal(false);
        setAddForm({ autoCloseTime: "" });
        fetchAutoCloseTimes();
      }
    } catch (err) {
      toast.error("Failed to create auto close time");
    }
  };

  // Edit
  const handleEditAutoCloseTime = async (e) => {
    e.preventDefault();
    if (!editForm.autoCloseTime.trim()) {
      toast.error("Auto Close Time cannot be empty");
      return;
    }
    try {
      const updateData = {
        autoCloseTime: editForm.autoCloseTime.trim(),
      };
      const res = await updateAutoCloseTime(editForm._id, updateData);
      if (res?.data?.success) {
        toast.success("Auto Close Time updated successfully");
        setOpenEditModal(false);
        setEditForm(null);
        fetchAutoCloseTimes();
        setShowConfirm(false);
      }
    } catch (err) {
      toast.error("Failed to update auto close time");
    }
  };

  // Delete
  const handleDeleteAutoCloseTime = async () => {
    try {
      await deleteAutoCloseTime(deleteId);
      toast.success("Auto Close Time deleted successfully");
      setDeleteModal(false);
      setDeleteId(null);
      fetchAutoCloseTimes();
    } catch (err) {
      toast.error("Failed to delete auto close time");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          INCIDENT AUTO CLOSE TIME
        </h2>
        <MaterialReactTable table={table} />
      </div>

      {/* Add Modal */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Add Auto Close Time
            </h2>
            <form onSubmit={handleAddAutoCloseTime} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Auto Close Time*
                </label>
                <TextField
                  name="autoCloseTime"
                  required
                  fullWidth
                  value={addForm.autoCloseTime}
                  onChange={(e) =>
                    setAddForm({ autoCloseTime: e.target.value })
                  }
                  placeholder="Enter time in minutes/hours"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[#6f7fbc] text-white px-4 py-2 rounded-md text-sm"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm font-medium"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Edit Auto Close Time
            </h2>
            <form onSubmit={handleEditAutoCloseTime} className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Auto Close Time*
                </label>
                <TextField
                  name="autoCloseTime"
                  required
                  fullWidth
                  value={editForm.autoCloseTime}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      autoCloseTime: e.target.value,
                    }))
                  }
                  placeholder="Enter time in minutes/hours"
                  variant="standard"
                  sx={{ width: 250 }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  // type="submit"
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="bg-[#6f7fbc] text-white px-4 py-2 rounded-md text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setOpenEditModal(false)}
                  className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <ConfirmUpdateModal
                  isOpen={showConfirm}
                  onConfirm={handleEditAutoCloseTime}
                  message="Are you sure you want to update this auto close time?"
                  onCancel={() => setShowConfirm(false)}
                />
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
              This action will permanently delete the Auto Close Time.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="border px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAutoCloseTime}
                className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm"
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

export default AutoClosedTime;
