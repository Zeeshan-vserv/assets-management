import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Autocomplete, Box, Button, IconButton } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextField } from "@mui/material";
import {
  createHolidayList,
  deleteHolidayList,
  getAllHolidayCalender,
  getAllHolidayList,
  updateHolidayList,
} from "../../../api/slaRequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// const calendarOptions = [
//   { calenderName: "Pan India" },
//   { calenderName: "India - 2025" },
// ];

function HoliDayList() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [holidayCalendar, setHolidayCalendar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarOptions, setCalendarOptions] = useState([]);
  const [addHolidayListModal, setAddHolidatListModal] = useState(false);
  const [addHolidayList, setAddHolidayList] = useState({
    calenderName: "",
    holidayRemark: "",
    holidayDate: Date,
  });

  const [editHolidayList, setEditHolidayList] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteHolidayListId, setDeleteHolidayListId] = useState(null);
  const fetchHolidayList = async () => {
    try {
      setIsLoading(true);
      const response = await getAllHolidayList();
      setData(response?.data?.data || []);
      const response2 = await getAllHolidayCalender();
      const calendars = response2?.data?.data || [];
      setHolidayCalendar(calendars);

      // Gather all unique locations from all calendars
      const allLocations = calendars
        .flatMap((cal) => cal.holidayCalenderLocation || [])
        .filter(Boolean);

      // Remove duplicates and map to { calenderName }
      const uniqueOptions = Array.from(new Set(allLocations)).map((loc) => ({
        calenderName: loc,
      }));

      setCalendarOptions(uniqueOptions);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("Holiday List Data:", holidayCalendar.holidayCalenderLocation);

  useEffect(() => {
    fetchHolidayList();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "calenderName",
        header: "Calendar Name",
      },
      {
        accessorFn: (row) => new Date(row.holidayDate),
        id: "holidayDate",
        header: "Holiday Date",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },

      {
        accessorKey: "holidayRemark",
        header: "Holiday Remarks",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateHolidayList(row.original._id)}
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
            onClick={() => handleDeleteHolidayList(row.original._id)}
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
  const addNewHolidayListChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddHolidayList((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewHolidatListHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user.userId,
        calenderName: addHolidayList.calenderName,
        holidayRemark: addHolidayList.holidayRemark,
        holidayDate: addHolidayList.holidayDate,
      };
      const response = await createHolidayList(formData);
      if (response?.data.success) {
        toast.success("Holiday list created successfully");
        await fetchHolidayList();
        setAddHolidatListModal(false);
      }
    } catch (error) {
      console.log("Error creating holiday list");
    }
  };

  //update
  const handleUpdateHolidayList = (id) => {
    const holidayListToEdit = data?.find((d) => d._id === id);
    if (holidayListToEdit) {
      setEditHolidayList({
        _id: holidayListToEdit._id,
        calenderName: holidayListToEdit.calenderName,
        holidayDate: new Date(holidayListToEdit.holidayDate)
          .toISOString()
          .split("T")[0],

        holidayRemark: holidayListToEdit.holidayRemark,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateHolidayListChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditHolidayList((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateHolidayListHandler = async (e) => {
    e.preventDefault();
    if (!editHolidayList?._id) return;
    try {
      const updatedData = {
        calenderName: editHolidayList.calenderName,
        holidayDate: editHolidayList.holidayDate,
        holidayRemark: editHolidayList.holidayRemark,
      };
      const response = await updateHolidayList(
        editHolidayList?._id,
        updatedData
      );
      if (response?.data.success) {
        toast.success("Holiday list updated successfully");
        await fetchHolidayList();
        setEditHolidayList(null);
        setOpenUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating holiday list:", error);
    }
  };

  //delete
  const handleDeleteHolidayList = (id) => {
    setDeleteHolidayListId(id);
    setDeleteConfirmationModal(true);
  };
  const deleteHolidayListHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteHolidayList(deleteHolidayListId);
      if (response?.data.success) {
        toast.success("Holiday list deleted successfully");
        await fetchHolidayList();
        setDeleteConfirmationModal(false);
        setDeleteHolidayListId(null);
      }
    } catch (error) {
      console.error("Error deleting holiday list:", error);
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
            onClick={() => setAddHolidatListModal(true)}
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
          HOLIDAY CALENDAR LIST
        </h2>
        <MaterialReactTable table={table} />
        {addHolidayListModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Add Holiday Calendar
              </h2>
              <form onSubmit={addNewHolidatListHandler} className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Holiday Calendar
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={calendarOptions}
                      value={
                        calendarOptions.find(
                          (opt) =>
                            opt.calenderName === addHolidayList.calenderName
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        setAddHolidayList((prev) => ({
                          ...prev,
                          calenderName: newValue ? newValue.calenderName : "",
                        }))
                      }
                      getOptionLabel={(option) => option.calenderName || ""}
                      isOptionEqualToValue={(option, value) =>
                        option.calenderName === value.calenderName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          className="text-xs text-slate-600"
                          placeholder="Select"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Holiday Remarks
                    </label>
                    <TextField
                      name="holidayRemark"
                      required
                      fullWidth
                      value={addHolidayList?.holidayRemark || ""}
                      onChange={addNewHolidayListChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Holiday Date
                    </label>
                    <input
                      type="date"
                      name="holidayDate"
                      value={addHolidayList?.holidayDate || ""}
                      onChange={addNewHolidayListChangeHandler}
                      className="w-[65%] text-sm text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddHolidatListModal(false)}
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
        {openUpdateModal && (
          <>
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
                <h2 className="text-md font-semibold mb-6 text-start">
                  Edit Holiday Calendar
                </h2>
                <form onSubmit={updateHolidayListHandler} className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Holiday Calendar
                      </label>
                      <Autocomplete
                        className="w-[65%]"
                        options={calendarOptions}
                        value={
                          calendarOptions.find(
                            (opt) =>
                              opt.calenderName === editHolidayList?.calenderName
                          ) || null
                        }
                        onChange={(_, newValue) =>
                          setEditHolidayList((prev) => ({
                            ...prev,
                            calenderName: newValue ? newValue.calenderName : "",
                          }))
                        }
                        getOptionLabel={(option) => option.calenderName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option.calenderName === value.calenderName
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            className="text-xs text-slate-600"
                            placeholder="Select"
                            inputProps={{
                              ...params.inputProps,
                              style: { fontSize: "0.8rem" },
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Holiday Date
                      </label>
                      <input
                        type="date"
                        name="holidayDate"
                        value={editHolidayList?.holidayDate || ""}
                        onChange={updateHolidayListChangeHandler}
                        className="w-[65%] text-sm text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Holiday Remarks
                      </label>
                      <TextField
                        name="holidayRemark"
                        required
                        fullWidth
                        value={editHolidayList?.holidayRemark || ""}
                        onChange={updateHolidayListChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpenUpdateModal(false)}
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
                onSubmit={deleteHolidayListHandler}
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

export default HoliDayList;
