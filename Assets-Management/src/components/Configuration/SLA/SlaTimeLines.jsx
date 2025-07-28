import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import {
  createSLATimeline,
  deleteSLATimeline,
  getAllSLATimelines,
  updateSLATimeline,
} from "../../../api/slaRequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

function SlaTimeLines() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addSlaTimeLinesModal, setAddSlaTimeLinesModal] = useState(false);
  const [addNewSlaTimeLines, setAddNewSlaTimeLines] = useState({
    priority: "",
    displayName: "",
    description: "",
    responseSLA: Date,
    resolutionSLA: Date,
    penality: "",
    stattus: null,
  });

  const [editSlaTimeLines, setEditSlaTimeLines] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSlaTimeLinesId, setDeleteSlaTimeLinesId] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSlaTimeLines = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLATimelines();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching Sla time lines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaTimeLines();
  }, []);
  // console.log("dd", data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "priority",
        header: "Priority",
      },
      {
        accessorKey: "displayName",
        header: "Display Name",
      },
      {
        accessorKey: "responseSLA",
        header: "Response SLA (in Mins.)",
      },
      {
        accessorKey: "resolutionSLA",
        header: "Resolution SLA (in Mins.)",
      },

      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateSlaTimeLines(row.original._id)}
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
            onClick={() => handleDeleteSlaTimeLines(row.original._id)}
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
  const addNewSlaTimeLinesChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSlaTimeLines((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSlaTimeLinesHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user.userId,
        priority: addNewSlaTimeLines.priority,
        displayName: addNewSlaTimeLines.displayName,
        description: addNewSlaTimeLines.description,
        responseSLA: addNewSlaTimeLines.responseSLA,
        resolutionSLA: addNewSlaTimeLines.resolutionSLA,
        penality: addNewSlaTimeLines.penality,
        stattus: addNewSlaTimeLines.stattus,
      };
      const response = await createSLATimeline(formData);
      if (response?.data.success) {
        toast.success("SLA Timeline created successfully");
        await fetchSlaTimeLines();
      }
      setAddSlaTimeLinesModal(false);
      setAddNewSlaTimeLines({});
    } catch (error) {
      console.log("Error creating sla time lines ", error);
    }
  };

  //update
  const handleUpdateSlaTimeLines = (id) => {
    const slaTimeLinesToEdit = data?.find((d) => d._id === id);
    if (slaTimeLinesToEdit) {
      setEditSlaTimeLines({
        _id: slaTimeLinesToEdit._id,
        priority: slaTimeLinesToEdit.priority,
        displayName: slaTimeLinesToEdit.displayName,
        description: slaTimeLinesToEdit.description,
        responseSLA: slaTimeLinesToEdit.responseSLA,
        resolutionSLA: slaTimeLinesToEdit.resolutionSLA,
        penality: slaTimeLinesToEdit.penality,
        stattus: slaTimeLinesToEdit.stattus,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateSlaTimeLinesChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditSlaTimeLines((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSlaTimeLinesHandler = async (e) => {
    e.preventDefault();
    if (!editSlaTimeLines?._id) return;

    const updatedData = {
      priority: editSlaTimeLines.priority,
      displayName: editSlaTimeLines.displayName,
      description: editSlaTimeLines.description,
      responseSLA: editSlaTimeLines.responseSLA,
      resolutionSLA: editSlaTimeLines.resolutionSLA,
      penality: editSlaTimeLines.penality,
      stattus: editSlaTimeLines.stattus,
    };

    try {
      const response = await updateSLATimeline(
        editSlaTimeLines._id,
        updatedData
      );
      if (response?.data?.success) {
        toast.success("SLA timeline updated successfully");
        await fetchSlaTimeLines();
        setOpenUpdateModal(false);
        setEditSlaTimeLines(null);
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error updating sla time lines:", error);
    }
  };

  //delete
  const handleDeleteSlaTimeLines = (id) => {
    setDeleteSlaTimeLinesId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteSlaTimeLinesHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteSLATimeline(deleteSlaTimeLinesId);
      if (response?.data.success) {
        toast.success("SLA timeline deleted successfully");
        await fetchSlaTimeLines();
      }
    } catch (error) {
      console.error("Error deleting sla time line:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteSlaTimeLinesId(null);
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
            onClick={() => setAddSlaTimeLinesModal(true)}
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">SLA TIMELINE</h2>
        <MaterialReactTable table={table} />
        {addSlaTimeLinesModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in space-y-6">
                <h2 className="text-md font-semibold mb-6 text-start">
                  Create Sla Time Lines
                </h2>
                <form onSubmit={addNewSlaTimeLinesHandler}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Priority
                      </label>
                      <Autocomplete
                        options={[
                          "Severity-1",
                          "Severity-2",
                          "Severity-3",
                          "Severity-4",
                        ]}
                        value={addNewSlaTimeLines.priority || ""}
                        onChange={(event, newValue) =>
                          setAddNewSlaTimeLines((prev) => ({
                            ...prev,
                            priority: newValue,
                          }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Select Priority"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Display Name
                      </label>
                      <TextField
                        name="displayName"
                        required
                        fullWidth
                        value={addNewSlaTimeLines.displayName || ""}
                        onChange={addNewSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={addNewSlaTimeLines.description || ""}
                        required
                        onChange={addNewSlaTimeLinesChangeHandler}
                        className="w-full border border-slate-500 rounded-md focus:border-blue-500 outline-none"
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Response SLA
                      </label>
                      <input
                        type="text"
                        name="responseSLA"
                        value={addNewSlaTimeLines.responseSLA || ""}
                        onChange={addNewSlaTimeLinesChangeHandler}
                        placeholder="HH:MM"
                        className="w-full border-b border-slate-400 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Resolution SLA
                      </label>
                      <input
                        type="text"
                        name="resolutionSLA"
                        value={addNewSlaTimeLines.resolutionSLA || ""}
                        placeholder="HH:MM"
                        onChange={addNewSlaTimeLinesChangeHandler}
                        className="w-full border-b border-gray-400 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Penality
                      </label>
                      <input
                        type="text"
                        name="penality"
                        value={addNewSlaTimeLines.penality || ""}
                        onChange={addNewSlaTimeLinesChangeHandler}
                        className="w-full border-b border-gray-400 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Active
                      </label>
                      <input
                        type="checkbox"
                        name="stattus"
                        checked={addNewSlaTimeLines.stattus || false}
                        onChange={(e) =>
                          setAddNewSlaTimeLines((prev) => ({
                            ...prev,
                            stattus: e.target.checked,
                          }))
                        }
                        className="w-6 h-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                    >
                      Add
                    </button> 
                    <button
                      type="button"
                      onClick={() => setAddSlaTimeLinesModal(false)}
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
        {openUpdateModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in">
                <h2 className="text-md font-semibold mb-6 text-start">
                  Update Sla Time
                </h2>
                <form
                  onSubmit={updateSlaTimeLinesHandler}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Priority
                      </label>
                      <Autocomplete
                        options={[
                          "Priority - 1",
                          "Priority - 2",
                          "Priority - 3",
                          "Priority - 4",
                        ]}
                        value={editSlaTimeLines?.priority || ""}
                        onChange={(event, newValue) =>
                          setEditSlaTimeLines((prev) => ({
                            ...prev,
                            priority: newValue,
                          }))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            placeholder="Select Priority"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Display Name
                      </label>
                      <TextField
                        name="displayName"
                        required
                        fullWidth
                        value={editSlaTimeLines.displayName || ""}
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editSlaTimeLines?.description || ""}
                        required
                        onChange={updateSlaTimeLinesChangeHandler}
                        className="w-full border border-slate-500 rounded-md focus:border-blue-500 outline-none"
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Response SLA
                      </label>
                      <TextField
                        name="responseSLA"
                        required
                        fullWidth
                        value={editSlaTimeLines?.responseSLA || ""}
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Resolution SLA
                      </label>
                      <TextField
                        name="resolutionSLA"
                        required
                        fullWidth
                        value={editSlaTimeLines.resolutionSLA || ""}
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Penality / Hour
                      </label>
                      <TextField
                        name="penality"
                        required
                        fullWidth
                        value={editSlaTimeLines?.penality || ""}
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Active
                      </label>
                      <input
                        type="checkbox"
                        name="stattus"
                        checked={editSlaTimeLines.stattus || false}
                        onChange={(e) =>
                          setAddNewSlaTimeLines((prev) => ({
                            ...prev,
                            stattus: e.target.checked,
                          }))
                        }
                        className="w-6 h-4"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      // type="submit"
                      type="button"
                      onClick={() => setShowConfirm(true)}
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
                    <ConfirmUpdateModal
                      isOpen={showConfirm}
                      onConfirm={updateSlaTimeLinesHandler}
                      message="Are you sure you want to update this SLA timeline?"
                      onCancel={() => setShowConfirm(false)}
                    />
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
                onSubmit={deleteSlaTimeLinesHandler}
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

export default SlaTimeLines;
