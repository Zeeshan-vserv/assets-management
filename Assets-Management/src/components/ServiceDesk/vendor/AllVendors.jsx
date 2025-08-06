import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel, AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { NavLink, useNavigate } from "react-router-dom";
import { FaDesktop } from "react-icons/fa";
import { deleteVendor, getAllVendors } from "../../../api/vendorRequest";
import { MdModeEdit } from "react-icons/md";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Assets",
});

function AllVendors() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  /** ✅ Fetch Vendors */
  const fetchAllVendors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllVendors();
      if (response.status !== 200) throw new Error("Failed to fetch vendors");
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllVendors();
  }, [fetchAllVendors]);

  /** ✅ Table Columns */
  const columns = useMemo(
    () => [
      { accessorKey: "vendorCode", header: "Vendor Code" },
      { accessorKey: "vendorName", header: "Vendor Name" },
      { accessorKey: "vendorStatus", header: "Vendor Status" },
      { accessorKey: "vendorCategory", header: "Vendor Category" },
      { accessorKey: "serviceCategory", header: "Services Category" },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() =>
              navigate(
                `/main/ServiceDesk/EditVendor/${row.original._id}`
              )
            }
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
            onClick={() => openDeleteModal(row.original._id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  /** ✅ Delete Modal Handlers */
  const openDeleteModal = (id) => {
    setVendorToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteVendor = async (e) => {
    e.preventDefault();
    try {
      await deleteVendor(vendorToDelete);
      setDeleteModalOpen(false);
      fetchAllVendors(); // refresh after delete
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
  };

  /** ✅ Export Functions */
  const getVisibleColumns = (table) =>
    table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          !["mrt-row-select", "edit", "delete", "file"].includes(col.id)
      );

  const exportToCSV = (rows) => {
    const visibleColumns = getVisibleColumns(table);
    const rowData = rows.map((row) =>
      visibleColumns.reduce((obj, col) => {
        obj[col.id || col.accessorKey] =
          row.original[col.id || col.accessorKey];
        return obj;
      }, {})
    );
    download(csvConfig)(generateCsv(csvConfig)(rowData));
  };

  const exportAllDataToCSV = () => {
    const visibleColumns = getVisibleColumns(table);
    const exportData = data.map((item) =>
      visibleColumns.reduce((obj, col) => {
        obj[col.id || col.accessorKey] = item[col.id || col.accessorKey];
        return obj;
      }, {})
    );
    download(csvConfig)(generateCsv(csvConfig)(exportData));
  };

  const exportToPDF = () => {
    const visibleColumns = getVisibleColumns(table);
    const headers = visibleColumns.map((col) => col.columnDef.header);
    const exportData = data.map((item) =>
      visibleColumns.map((col) => item[col.id || col.accessorKey] ?? "")
    );

    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });

    doc.save("Assets-Management-Assets.pdf");
  };

  /** ✅ Table Config */
  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: { density: "compact" },

    renderTopToolbarCustomActions: () => (
      <Box>
        <NavLink to="/main/ServiceDesk/NewVendor">
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              m: 1,
            }}
          >
            New
          </Button>
        </NavLink>

        <Button
          onClick={exportToPDF}
          startIcon={<AiOutlineFilePdf />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", m: 1 }}
        >
          Export as PDF
        </Button>

        <Button
          onClick={exportAllDataToCSV}
          startIcon={<AiOutlineFileExcel />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", m: 1 }}
        >
          Export All Data
        </Button>

        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => exportToCSV(table.getPrePaginationRowModel().rows)}
          startIcon={<AiOutlineFileExcel />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", m: 1 }}
        >
          Export All Rows
        </Button>

        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => exportToCSV(table.getRowModel().rows)}
          startIcon={<AiOutlineFileExcel />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", m: 1 }}
        >
          Export Page Rows
        </Button>

        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => exportToCSV(table.getSelectedRowModel().rows)}
          startIcon={<AiOutlineFileExcel />}
          size="small"
          variant="outlined"
          sx={{ textTransform: "none", m: 1 }}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),

    muiTableProps: {
      sx: { border: "1px solid rgba(81, 81, 81, .5)" },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 15, 20],
      shape: "rounded",
      variant: "outlined",
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f1f5fa",
        color: "#303E67",
        fontSize: "14px",
        fontWeight: 500,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: { backgroundColor: row.index % 2 === 1 ? "#f1f5fa" : "inherit" },
    }),
  });

  return (
    <div className="flex flex-col w-full min-h-full p-4 bg-slate-100">
      {/* ✅ Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-6">ALL VENDORS</h2>
        <button
          onClick={() => navigate("/main/dashboard/vendor")}
          className="bg-[#6f7fbc] shadow-md px-3 py-2 rounded-md text-sm text-white flex items-center gap-1"
        >
          <FaDesktop size={12} />
          <span> View Dashboard</span>
        </button>
      </div>

      {/* ✅ Table */}
      <MaterialReactTable table={table} />

      {/* ✅ Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-semibold text-red-600 mb-3">
              Are you sure?
            </h2>
            <p className="text-gray-700 mb-6">
              This action will permanently delete the vendor.
            </p>
            <form
              onSubmit={handleDeleteVendor}
              className="flex justify-end gap-3"
            >
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#df656b] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllVendors;
