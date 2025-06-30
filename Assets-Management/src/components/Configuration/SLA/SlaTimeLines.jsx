import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { IconButton, TextField } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import { getAllAssets } from "../../../api/AssetsRequest"; //later change

function SlaTimeLines() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editSlaTimeLines, setEditSlaTimeLines] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchSlaTimeLines = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
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
        accessorKey: "assetState.user",
        header: "Priority",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Display Name",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Response SLA(In Mins.)",
      },
      {
        accessorKey: "locationInformation.location",
        header: "	Resolution SLA(In Mins.)",
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
    ],
    [isLoading]
  );

  //update
  const handleUpdateSlaTimeLines = (id) => {
    const slaTimeLinesToEdit = data?.find((d) => d._id === id);
    if (slaTimeLinesToEdit) {
      setEditSlaTimeLines({});
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
    try {
      // console.log("editSlaTimeLines", editSlaTimeLines);
      //call api
      setEditSlaTimeLines(null);
    } catch (error) {
      console.error("Error updating sla time lines:", error);
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
                      <TextField
                        name=""
                        required
                        fullWidth
                        value=""
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Display Name
                      </label>
                      <TextField
                        name=""
                        required
                        fullWidth
                        value=""
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
                        name=""
                        value=""
                        required
                        onChange={updateSlaTimeLinesChangeHandler}
                        className="w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Response SLA
                      </label>
                      <TextField
                        name=""
                        required
                        fullWidth
                        value=""
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
                        name=""
                        required
                        fullWidth
                        value=""
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
                        name=""
                        required
                        fullWidth
                        value=""
                        onChange={updateSlaTimeLinesChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Highlight Color
                      </label>
                      <input type="color" className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Active
                      </label>
                      <input type="checkbox" className="w-6 h-4" />
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
      </div>
    </>
  );
}

export default SlaTimeLines;
