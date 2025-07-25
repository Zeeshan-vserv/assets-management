import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextField } from "@mui/material";
import {
  createHolidayCalender,
  deleteHolidayCalender,
  getAllHolidayCalender,
  updateHolidayCalender,
} from "../../../api/slaRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

function HolidayCalendar() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addCalendarLocModal, setAddCalendarLocModal] = useState(false);
  const [addCalendarLocation, setAddCalendarLocation] = useState({
    holidayCalenderLocation: "",
  });

  const [editCalendarLocation, setEditCalendarLocation] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteCalendarLocationId, setDeleteCalendarLocationId] =
    useState(null);

  const [showConfirm, setShowConfirm] = useState(false);

  const fetchHolidayCalendar = async () => {
    try {
      setIsLoading(true);
      const response = await getAllHolidayCalender();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidayCalendar();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "holidayCalenderId",
        header: "Holiday Calendar",
      },
      {
        accessorKey: "holidayCalenderLocation",
        header: "Holiday Calendar Location",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateCalendarLocation(row.original._id)}
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
            onClick={() => handleDeleteCalendarLocation(row.original._id)}
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
  const addNewCalendarLocationChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddCalendarLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewCalendarLocationHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user.userId,
        holidayCalenderLocation: addCalendarLocation.holidayCalenderLocation,
      };
      const response = await createHolidayCalender(formData);
      if (response?.data.success) {
        toast.success("Holiday Calender created successfully");
        await fetchHolidayCalendar();
        setAddCalendarLocModal(false);
      }
    } catch (error) {
      console.log("Error creating holiday calendar");
    }
  };

  //update
  const handleUpdateCalendarLocation = (id) => {
    const calendarLocationToEdit = data?.find((d) => d._id === id);
    if (calendarLocationToEdit) {
      setEditCalendarLocation({
        _id: calendarLocationToEdit._id,
        holidayCalenderLocation: calendarLocationToEdit.holidayCalenderLocation,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateCalendarLocationChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditCalendarLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateCalendarLocationHandler = async (e) => {
    e.preventDefault();
    if (!editCalendarLocation?._id) return;
    try {
      const updatedData = {
        holidayCalenderLocation: editCalendarLocation.holidayCalenderLocation,
      };
      const response = await updateHolidayCalender(
        editCalendarLocation?._id,
        updatedData
      );
      if (response?.data.success) {
        toast.success("Holiday calender updated successfully");
        await fetchHolidayCalendar();
        setOpenUpdateModal(false);
        setEditCalendarLocation(null);
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error updating calendar location:", error);
    }
  };

  //delete
  const handleDeleteCalendarLocation = (id) => {
    setDeleteCalendarLocationId(id);
    setDeleteConfirmationModal(true);
  };
  const deleteCalendarLocationHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteHolidayCalender(deleteCalendarLocationId);
      if (response?.data.success) {
        toast.success("Holiday calender deleted successfully");
        await fetchHolidayCalendar();
        setDeleteConfirmationModal(false);
        setDeleteCalendarLocationId(null);
      }
    } catch (error) {
      console.error("Error deleting calendar location:", error);
    }
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
            onClick={() => setAddCalendarLocModal(true)}
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
        <h2 className="text-lg font-semibold mb-6 text-start">
          HOLIDAY CALENDAR
        </h2>
        <MaterialReactTable table={table} />
        {addCalendarLocModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Add Holiday Calendar
              </h2>
              <form
                onSubmit={addNewCalendarLocationHandler}
                className="space-y-2"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Holiday Calendar Location
                    </label>
                    <TextField
                      name="holidayCalenderLocation"
                      required
                      fullWidth
                      value={addCalendarLocation?.holidayCalenderLocation || ""}
                      onChange={addNewCalendarLocationChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
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
                    onClick={() => setAddCalendarLocModal(false)}
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
                <h2 className="text-md font-semibold mb-6 text-start">
                  Update Holiday Calendar
                </h2>
                <form
                  onSubmit={updateCalendarLocationHandler}
                  className="space-y-2"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Holiday Calendar Location
                      </label>
                      <TextField
                        name="holidayCalenderLocation"
                        required
                        fullWidth
                        value={
                          editCalendarLocation?.holidayCalenderLocation || ""
                        }
                        onChange={updateCalendarLocationChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
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
                      onConfirm={updateCalendarLocationHandler}
                      message="Are you sure you want to update this holiday calendar?"
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
                onSubmit={deleteCalendarLocationHandler}
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

export default HolidayCalendar;
