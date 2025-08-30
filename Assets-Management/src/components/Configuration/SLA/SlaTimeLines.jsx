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

function SlaTimeLines() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addSlaTimeLinesModal, setAddSlaTimeLinesModal] = useState(false);
  const [addNewSlaTimeLines, setAddNewSlaTimeLines] = useState({
    priority: "",
    type: "",
    displayName: "",
    description: "",
    responseSLADay: "",
    responseSLAHour: "",
    responseSLAMinute: "",
    resolutionSLADay: "",
    resolutionSLAHour: "",
    resolutionSLAMinute: "",
    penality: "",
    stattus: false,
  });

  const [editSlaTimeLines, setEditSlaTimeLines] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSlaTimeLinesId, setDeleteSlaTimeLinesId] = useState(null);

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
        accessorKey: "type",
        header: "SLA Type",
        Cell: ({ cell }) => cell.getValue()?.toUpperCase() || "",
      },
      {
        accessorKey: "responseSLA",
        header: "Response SLA (D:HH:MM)",
      },
      {
        accessorKey: "resolutionSLA",
        header: "Resolution SLA (D:HH:MM)",
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
    const { name, value, type, checked } = e.target;
    setAddNewSlaTimeLines((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const pad = (num) => String(num).padStart(2, "0");

  const addNewSlaTimeLinesHandler = async (e) => {
    e.preventDefault();
    // Combine day, hour and minute fields into "D:HH:MM"
    const responseSLA = `${addNewSlaTimeLines.responseSLADay || 0}:${pad(
      addNewSlaTimeLines.responseSLAHour || 0
    )}:${pad(addNewSlaTimeLines.responseSLAMinute || 0)}`;
    const resolutionSLA = `${addNewSlaTimeLines.resolutionSLADay || 0}:${pad(
      addNewSlaTimeLines.resolutionSLAHour || 0
    )}:${pad(addNewSlaTimeLines.resolutionSLAMinute || 0)}`;
    try {
      const formData = {
        userId: user.userId,
        priority: addNewSlaTimeLines.priority,
        type: addNewSlaTimeLines.type,
        displayName: addNewSlaTimeLines.displayName,
        description: addNewSlaTimeLines.description,
        responseSLA,
        resolutionSLA,
        penality: addNewSlaTimeLines.penality,
        stattus: addNewSlaTimeLines.stattus,
      };
      const response = await createSLATimeline(formData);
      if (response?.data.success) {
        toast.success("SLA Timeline created successfully");
        await fetchSlaTimeLines();
      }
      setAddSlaTimeLinesModal(false);
      setAddNewSlaTimeLines({
        priority: "",
        displayName: "",
        description: "",
        responseSLADay: "",
        responseSLAHour: "",
        responseSLAMinute: "",
        resolutionSLADay: "",
        resolutionSLAHour: "",
        resolutionSLAMinute: "",
        penality: "",
        stattus: false,
      });
    } catch (error) {
      console.log("Error creating sla time lines ", error);
    }
  };

  const handleUpdateSlaTimeLines = (id) => {
    const slaTimeLinesToEdit = data?.find((d) => d._id === id);
    if (slaTimeLinesToEdit) {
      // Split responseSLA and resolutionSLA into day, hour and minute for editing
      const [
        responseSLADay = "",
        responseSLAHour = "",
        responseSLAMinute = "",
      ] = (slaTimeLinesToEdit.responseSLA || "").split(":");
      const [
        resolutionSLADay = "",
        resolutionSLAHour = "",
        resolutionSLAMinute = "",
      ] = (slaTimeLinesToEdit.resolutionSLA || "").split(":");
      setEditSlaTimeLines({
        _id: slaTimeLinesToEdit._id,
        priority: slaTimeLinesToEdit.priority,
        type: slaTimeLinesToEdit.type,
        displayName: slaTimeLinesToEdit.displayName,
        description: slaTimeLinesToEdit.description,
        responseSLADay,
        responseSLAHour,
        responseSLAMinute,
        resolutionSLADay,
        resolutionSLAHour,
        resolutionSLAMinute,
        penality: slaTimeLinesToEdit.penality,
        stattus: slaTimeLinesToEdit.stattus,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateSlaTimeLinesChangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setEditSlaTimeLines((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateSlaTimeLinesHandler = async (e) => {
    e.preventDefault();
    if (!editSlaTimeLines?._id) return;

    const responseSLA = `${editSlaTimeLines.responseSLADay || 0}:${pad(
      editSlaTimeLines.responseSLAHour || 0
    )}:${pad(editSlaTimeLines.responseSLAMinute || 0)}`;
    const resolutionSLA = `${editSlaTimeLines.resolutionSLADay || 0}:${pad(
      editSlaTimeLines.resolutionSLAHour || 0
    )}:${pad(editSlaTimeLines.resolutionSLAMinute || 0)}`;

    const updatedData = {
      priority: editSlaTimeLines.priority,
      type: editSlaTimeLines.type,
      displayName: editSlaTimeLines.displayName,
      description: editSlaTimeLines.description,
      responseSLA,
      resolutionSLA,
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
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium mb-4 text-start">
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
                      SLA Type
                    </label>
                    <Autocomplete
                      options={["incident", "service"]}
                      value={addNewSlaTimeLines?.type || ""}
                      onChange={(event, newValue) =>
                        setAddNewSlaTimeLines((prev) => ({
                          ...prev,
                          type: newValue,
                        }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select SLA Type"
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
                  {/* Response SLA */}
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Response SLA
                    </label>
                    <input
                      type="number"
                      name="responseSLADay"
                      min="0"
                      placeholder="D"
                      value={addNewSlaTimeLines.responseSLADay}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="responseSLAHour"
                      min="0"
                      max="23"
                      placeholder="HH"
                      value={addNewSlaTimeLines.responseSLAHour}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="responseSLAMinute"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={addNewSlaTimeLines.responseSLAMinute}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  {/* Resolution SLA */}
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Resolution SLA
                    </label>
                    <input
                      type="number"
                      name="resolutionSLADay"
                      min="0"
                      placeholder="D"
                      value={addNewSlaTimeLines.resolutionSLADay}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="resolutionSLAHour"
                      min="0"
                      max="23"
                      placeholder="HH"
                      value={addNewSlaTimeLines.resolutionSLAHour}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="resolutionSLAMinute"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={addNewSlaTimeLines.resolutionSLAMinute}
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
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
                      onChange={addNewSlaTimeLinesChangeHandler}
                      className="w-6 h-4"
                    />
                  </div>
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
                    onClick={() => setAddSlaTimeLinesModal(false)}
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 animate-fade-in">
              <h2 className="text-lg font-medium mb-4 text-start">
                Update Sla Time
              </h2>
              <form onSubmit={updateSlaTimeLinesHandler} className="space-y-4">
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
                      SLA Type
                    </label>
                    <Autocomplete
                      options={["incident", "service"]}
                      value={editSlaTimeLines?.type || ""}
                      onChange={(event, newValue) =>
                        setEditSlaTimeLines((prev) => ({
                          ...prev,
                          type: newValue,
                        }))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          placeholder="Select SLA Type"
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
                  {/* Response SLA */}
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Response SLA
                    </label>
                    <input
                      type="number"
                      name="responseSLADay"
                      min="0"
                      placeholder="DD"
                      value={editSlaTimeLines?.responseSLADay}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="responseSLAHour"
                      min="0"
                      max="23"
                      placeholder="HH"
                      value={editSlaTimeLines?.responseSLAHour}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="responseSLAMinute"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={editSlaTimeLines?.responseSLAMinute}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-slate-400 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                  {/* Resolution SLA */}
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Resolution SLA
                    </label>
                    <input
                      type="number"
                      name="resolutionSLADay"
                      min="0"
                      placeholder="DD"
                      value={editSlaTimeLines?.resolutionSLADay}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="resolutionSLAHour"
                      min="0"
                      max="23"
                      placeholder="HH"
                      value={editSlaTimeLines?.resolutionSLAHour}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
                    />
                    <span>:</span>
                    <input
                      type="number"
                      name="resolutionSLAMinute"
                      min="0"
                      max="59"
                      placeholder="MM"
                      value={editSlaTimeLines?.resolutionSLAMinute}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-16 border-b border-gray-400 focus:border-blue-500 outline-none"
                      required
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
                      checked={editSlaTimeLines?.stattus || false}
                      onChange={updateSlaTimeLinesChangeHandler}
                      className="w-6 h-4"
                    />
                  </div>
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
