import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import { deleteSLA, getAllSLAs } from "../../../api/slaRequest";
import { toast } from "react-toastify";

function SlaCreation() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSlaCreationId, setDeleteSlaCreationId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchSlaCreation = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAs();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaCreation();
  }, []);
  // console.log("data", data);
  const columns = useMemo(
    () => [
      {
        accessorKey: "slaName",
        header: "SLA Name",
      },
      {
        accessorKey: "holidayCalender",
        header: "Holiday Calendar",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => cell.getValue().toString(),
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() =>
              navigate(`/main/configuration/edit-sla/${row.original._id}`)
            }
            color="primary"
            aria-label="edit"
          >
            <MdModeEdit />
          </IconButton>
        ),
      },
      // {
      //   id: "delete",
      //   header: "Delete",
      //   size: 80,
      //   enableSorting: false,
      //   Cell: ({ row }) => (
      //     <IconButton
      //       onClick={() => handleDeleteSlaCreation(row.original._id)}
      //       color="error"
      //       aria-label="delete"
      //     >
      //       <DeleteIcon />
      //     </IconButton>
      //   ),
      // },
    ],
    [isLoading]
  );

  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = () => {
    handleCloseMenu();
    //logic
    // console.log("handleChangeStatus");
  };

  const handleDefault = () => {
    handleCloseMenu();
    //logic
    // console.log("handleDefault");
  };

  //row selected logic

  //delete
  const handleDeleteSlaCreation = (id) => {
    setDeleteSlaCreationId(id);
    setDeleteConfirmationModal(true);
  };
  const deleteSlaCreationHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteSLA(deleteSlaCreationId);
      if (response?.data.success) {
        toast.success("SLA deleted successfully");
        fetchSlaCreation();
      }
    } catch (error) {
      console.error("Error deleting sla creation:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteSlaCreationId(null);
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
          {/* {console.log(data.length === 0)} */}
          {data.length === 0 && (
            <Button
            onClick={() => navigate("/main/configuration/new-sla-creation")}
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
          )}
          
          {/* <Button
            onClick={handleActionClick}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 1,
            }}
          >
            Action
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
            <MenuItem onClick={handleChangeStatus}>Change Ststus</MenuItem>
            <MenuItem onClick={handleDefault}>Default</MenuItem>
          </Menu> */}
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
          SERVICE LEVEL AGREEMENT
        </h2>
        <MaterialReactTable table={table} />
        {/* {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the department.
              </p>
              <form
                onSubmit={deleteSlaCreationHandler}
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
        )} */}
      </div>
    </>
  );
}

export default SlaCreation;
