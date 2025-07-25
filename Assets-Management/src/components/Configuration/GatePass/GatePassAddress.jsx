import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  createGatePassAddress,
  getAllGatePassAddress,
  updateGatePassAddress,
  deleteGatePassAddress,
} from "../../../api/gatePassAddressRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "GatePassAddress.csv",
});

function GatePassAddress() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    addressName: "",
  });

  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    addressName: "",
  });

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const user = useSelector((state) => state.authReducer?.authData);

  // Fetch all addresses
  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const res = await getAllGatePassAddress();
      setData(res?.data?.data || []);
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "addressId",
        header: "Address Id",
      },
      {
        accessorKey: "addressName",
        header: "Address Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleEdit(row.original)}
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
            onClick={() => handleDelete(row.original._id)}
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

  // Add
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user?.userId,
        addressName: addForm.addressName,
      };
      const res = await createGatePassAddress(payload);
      if (res.data.success) {
        toast.success("Address added!");
        fetchAddresses();
        setAddModal(false);
        setAddForm({ addressName: "" });
      } else {
        toast.error(res.data.message || "Failed to add address");
      }
    } catch (error) {
      toast.error("Error adding address");
    }
  };

  // Edit
  const handleEdit = (row) => {
    setEditForm({
      _id: row._id,
      addressName: row.addressName,
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        addressName: editForm.addressName,
      };
      const res = await updateGatePassAddress(editForm._id, payload);
      if (res.data.success) {
        toast.success("Address updated!");
        fetchAddresses();
        setEditModal(false);
        setEditForm({ _id: "", addressName: "" });
        setShowConfirm(false);
      } else {
        toast.error(res.data.message || "Failed to update address");
      }
    } catch (error) {
      toast.error("Error updating address");
    }
  };

  // Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteGatePassAddress(deleteId);
      if (res.data.success) {
        toast.success("Address deleted!");
        fetchAddresses();
      } else {
        toast.error(res.data.message || "Failed to delete address");
      }
    } catch (error) {
      toast.error("Error deleting address");
    }
    setDeleteModal(false);
    setDeleteId(null);
  };

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

  // Export all data as CSV
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

  // Export as PDF
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
    doc.save("GatePassAddress.pdf");
  };

  // Exports
  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
      pagination: { pageSize: 5 },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button
          onClick={() => setAddModal(true)}
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
    ),
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
          GATE PASS ADDRESS
        </h2>
        <MaterialReactTable table={table} />
      </div>
      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-md font-semibold mb-6 text-start">
              Add Gate Pass Address
            </h2>
            <form onSubmit={handleAddSubmit} className="space-y-2">
              <div className="flex items-center gap-2 mt-1">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Address Name
                </label>
                <TextField
                  name="addressName"
                  required
                  fullWidth
                  value={addForm.addressName}
                  onChange={handleAddChange}
                  variant="standard"
                  sx={{ width: 250 }}
                />
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
                  onClick={() => setAddModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-md font-semibold mb-6 text-start">
              Edit Gate Pass Address
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <div className="flex items-center gap-2 mt-1">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Address Name
                </label>
                <TextField
                  name="addressName"
                  required
                  fullWidth
                  value={editForm.addressName}
                  onChange={handleEditChange}
                  variant="standard"
                  sx={{ width: 250 }}
                />
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
                  onClick={() => setEditModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <ConfirmUpdateModal
                  isOpen={showConfirm}
                  onConfirm={handleEditSubmit}
                  message="Are you sure you want to update this Get pass address?"
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action will permanently delete the address.
            </p>
            <form
              onSubmit={handleDeleteSubmit}
              className="flex justify-end gap-3"
            >
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
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
    </>
  );
}

export default GatePassAddress;
