import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import axios from "axios";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { getAllUsers } from "../../../api/AuthRequest";
import { NavLink } from "react-router-dom";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Users",
});

const Users = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editComponents, setEditComponents] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteComponentsId, setDeleteComponentsId] = useState(null);
  const [newComponent, setNewComponent] = useState({ name: "" });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data || []);
      // setData(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "employeeName",
        header: "Employee Name",
      },
      {
        accessorKey: "employeeCode",
        header: "Employee Code",
      },
      {
        accessorKey: "emailAddress",
        header: "Email",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        Cell: ({ row }) => {
          const status = row.original.isActive;
          let bgColor = "";
          if (status === false) bgColor = "bg-red-400";
          else if (status === true) bgColor = "bg-green-400";
          return (
            <span className={`${bgColor} px-4 py-2 rounded`}>
              {status ? "Active" : "Unactive"}
            </span>
          );
        },
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            // onClick={() => handleEditComponents(row.original.id)}
            color="primary"
            aria-label="edit"
          >
            <NavLink to={`/main/configuration/${row.original._id}`}>
            <MdModeEdit />
            </NavLink>
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
            onClick={() => handleDeleteComponents(row.original.id)}
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

  // const componentsInputChangeHandler = (e) => {
  //   const { name, value } = e.target;
  //   setEditComponents((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const updateComponentsHandler = (e) => {
  //   e.preventDefault();
  //   const updatedComponentsData = data.map((user) =>
  //     user.id === editComponents?.id ? editComponents : user
  //   );
  //   setData(updatedComponentsData);
  //   //call api
  //   setOpenModal(false);
  // };

  //Add New components
  // const newComponentChangeHandler = (e) => {
  //   const { name, value } = e.target;
  //   setNewComponent((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const addNewComponentHandler = (e) => {
  //   e.preventDefault();
  //   console.log("add new components");
  //   //call api
  //   setNewComponent({ name: "" });
  //   setOpenAddModal(false);
  // };

  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete" &&
          col.id !== "file"
      ); // Exclude edit/delete if needed

    const rowData = rows.map((row) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = row.original[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete" &&
          col.id !== "file"
      );

    const exportData = data.map((item) => {
      const result = {};
      visibleColumns.forEach((col) => {
        const key = col.id || col.accessorKey;
        result[key] = item[key];
      });
      return result;
    });

    const csv = generateCsv(csvConfig)(exportData);
    download(csvConfig)(csv);
  };

  const handlePdfData = () => {
    // Check column IDs for debugging

    const excludedColumns = ["mrt-row-select", "edit", "delete", "file"];

    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

    // Prepare headers for PDF
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    // Prepare data rows for PDF
    const exportData = data.map((item) =>
      visibleColumns.map((col) => {
        const key = col.id || col.accessorKey;
        let value = item[key];

        // Format date fields
        if (
          [
            "entryDate",
            "bgIssueDate",
            "expireDate",
            "amendDate",
            "claimDate",
          ].includes(key)
        ) {
          value = value ? new Date(value).toLocaleDateString() : "";
        }

        return value ?? "";
      })
    );

    const doc = new jsPDF({
      // format: "a3",
      // orientation: "landscape",
    });

    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });

    doc.save("Assets-Management-Components.pdf");
  };

  const handleDeleteComponents = (id) => {
    setDeleteComponentsId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteComponentConfirmationHandler = () => {
    const filterData = data.filter((val) => val.id !== deleteComponentsId);
    setData(filterData);
    setDeleteConfirmationModal(false);
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?.id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <Box>
          <NavLink to="/main/configuration/AddUser">
            <Button
              // onClick={() => setOpenAddModal(true)}
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
              New User
            </Button>
          </NavLink>
          <Button
            onClick={handlePdfData}
            startIcon={<AiOutlineFilePdf />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export as PDF
          </Button>
          <Button
            onClick={handleExportData}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Data
          </Button>
          <Button
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export All Rows
          </Button>
          <Button
            disabled={table.getRowModel().rows.length === 0}
            onClick={() => handleExportRows(table.getRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Page Rows
          </Button>
          <Button
            disabled={
              !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
            startIcon={<AiOutlineFileExcel />}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
          >
            Export Selected Rows
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
        // border: "1px solid #dddddd",
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
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6 text-start">ALL USERS</h2>
        <MaterialReactTable table={table} />
        {/* {openModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Edit Component
              </h2>
              <form onSubmit={updateComponentsHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={editComponents?.name || ""}
                    onChange={componentsInputChangeHandler}
                    placeholder="Enter component name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {openAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Add Component
              </h2>
              <form onSubmit={addNewComponentHandler} className="space-y-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-600 mb-1"
                  >
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={newComponent?.name || ""}
                    onChange={newComponentChangeHandler}
                    required
                    placeholder="Enter component name"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setOpenAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
              
          </div>
        )} */}
        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the component.
              </p>
              <form
                onSubmit={deleteComponentConfirmationHandler}
                className="flex justify-end gap-3"
              >
                <button
                  type="button"
                  onClick={() => setDeleteConfirmationModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:border-gray-500 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
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

export default Users;
