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
  createIncidentCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../../../api/IncidentCategoryRequest";
import { NavLink } from "react-router-dom";
import { deleteRule, getAllRules } from "../../../api/ConfigurationIncidentRequest";

const IncidentRules = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ categoryName: "" });

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAllRules();
      setData(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  // console.log("Data fetched:", data);
  

  useEffect(() => {
    fetchCategories();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "ruleName", header: "Rules Name" },
      { accessorKey: "priority", header: "Priority" },
      { accessorKey: "assignTo.technician", header: "Technician" },
      {
        id: "edit",
        header: "Edit",
        size: 60,
        enableSorting: false,
        Cell: ({ row }) => (
          <NavLink to={`/main/configuration/EditRule/${row.original._id}`}>
            {/* {console.log(row.original)} */}
          <IconButton
            color="primary"
            aria-label="edit"
          >
            <MdModeEdit />
          </IconButton>
          </NavLink>
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
        <NavLink to="/main/configuration/AddRule">
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
        </NavLink>
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

   // Delete Handler
    const handleDeleteCategory = async () => {
      try {
        await deleteRule(deleteId);
        toast.success("Predefined reply deleted successfully");
        setDeleteModal(false);
        setDeleteId(null);
        fetchCategories();
      } catch (err) {
        toast.error("Failed to delete predefined reply");
      }
    };


  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          INCIDENT RULE DETAILS
        </h2>
        <MaterialReactTable table={table} />
      </div>
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

export default IncidentRules;
