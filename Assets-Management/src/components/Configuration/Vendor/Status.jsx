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
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { TextField } from "@mui/material";
import {
  createStatus,
  deleteStatus,
  getAllStatus,
  updateStatus,
} from "../../../api/VendorStatusCategoryRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

function Status() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addStatusModal, setAddStatusModal] = useState(false);
  const [addNewStatus, setAddNewStatus] = useState({
    statusName: "",
  });

  const [editStatus, setEditStatus] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteStatusId, setDeleteStatusId] = useState(null);

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getAllStatus();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "statusId",
        header: "Status Id",
      },
      {
        accessorKey: "statusName",
        header: "Status Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateStatus(row.original._id)}
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
            onClick={() => handleDeleteStatus(row.original._id)}
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
  const addNewStatusChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewStatusHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user?.userId,
        statusName: addNewStatus.statusName,
      };
      const createStatusResponse = await createStatus(formData);
      if (createStatusResponse?.data?.success) {
        toast.success("Status created successfully");
        setAddNewStatus({ statusName: "" });
        fetchStatus();
      }
    } catch (error) {
      console.error("Error adding new status:", error);
    }
    setAddStatusModal(false);
  };

  //update
  const handleUpdateStatus = (id) => {
    const statusToEdit = data?.find((d) => d._id === id);
    if (statusToEdit) {
      setEditStatus({
        _id: statusToEdit._id,
        statusName: statusToEdit.statusName,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateStatusChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditStatus((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateStatusHandler = async (e) => {
    e.preventDefault();
    if (!editStatus?._id) return;
    try {
      const updatedData = {
        statusName: editStatus.statusName,
      };
      const updateStatusResponse = await updateStatus(
        editStatus._id,
        updatedData
      );
      if (updateStatusResponse?.data?.success) {
        toast.success("Status updated successfully");
        fetchStatus();
      }
      setOpenUpdateModal(false);
      setEditStatus(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  //delete
  const handleDeleteStatus = (id) => {
    setDeleteStatusId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteStatusHandler = async (e) => {
    e.preventDefault();
    try {
      const deleteStatusResponse = await deleteStatus(deleteStatusId);
      if (deleteStatusResponse?.data?.success) {
        toast.success("Status deleted successfully");
        fetchStatus();
      }
    } catch (error) {
      console.error("Error deleting status:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteStatusId(null);
  };

  //Exports
  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "edit" &&
          col.id !== "delete"
      );

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
          col.id !== "delete"
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
    const excludedColumns = ["mrt-row-select", "edit", "delete"];

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
        return value ?? "";
      })
    );

    const doc = new jsPDF({});
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });
    doc.save("Assets-Management-Components.pdf");
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
            onClick={() => setAddStatusModal(true)}
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
        <h2 className="text-lg font-semibold mb-6 text-start">STATUS</h2>
        <MaterialReactTable table={table} />
        {addStatusModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Add Status
              </h2>
              <form onSubmit={addNewStatusHandler} className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Status *
                    </label>
                    <TextField
                      name="statusName"
                      required
                      fullWidth
                      value={addNewStatus?.statusName || ""}
                      onChange={addNewStatusChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddStatusModal(false)}
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
                  Edit Status
                </h2>
                <form onSubmit={updateStatusHandler} className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Status *
                      </label>
                      <TextField
                        name="statusName"
                        required
                        fullWidth
                        value={editStatus?.statusName || ""}
                        onChange={updateStatusChangeHandler}
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
                onSubmit={deleteStatusHandler}
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

export default Status;
