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
import { Autocomplete, TextField } from "@mui/material";
import {
  createDepartment,
  getAllDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api/DepartmentRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Components",
});

function Department() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddDepartemntModal, setOpenAddDepartemntModal] = useState(false);
  const [addNewDepartment, setNewDepartment] = useState({
    departmentName: "",
    departmentHead: "",
  });
  const [editDepartment, setEditDepartment] = useState(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDepartment();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "departmentId",
        header: "Department Id",
      },
      {
        accessorKey: "departmentName",
        header: "Department Name",
      },
      {
        accessorKey: "departmentHead",
        header: "Department Head",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateDepartment(row.original._id)}
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
            onClick={() => handleDeleteDepartment(row.original._id)}
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

  const handleUpdateDepartment = (id) => {
    const departmentToEdit = data?.find((d) => d._id === id);
    if (departmentToEdit) {
      setEditDepartment({
        _id: departmentToEdit._id,
        departmentName: departmentToEdit.departmentName,
        departmentHead: departmentToEdit.departmentHead,
      });
      setOpenUpdateModal(true);
    }
  };

  const addNewDepartmentInputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateNewDepartmentHandler = async (e) => {
    e.preventDefault();
    if (!editDepartment?._id) return;
    try {
      const formData = {
        departmentName: editDepartment.departmentName,
        departmentHead: editDepartment.departmentHead,
      };
      await updateDepartment(editDepartment._id, formData);
      await fetchDepartment();
      setOpenUpdateModal(false);
      toast.success("Department Updated successfully");
      setEditDepartment(null);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

  const handleDeleteDepartment = (id) => {
    setDeleteDepartmentId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteDepartmentConfirmationHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteDepartment(deleteDepartmentId);
      toast.success("Department Deleted successfully");
      await fetchDepartment();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteDepartmentId(null);
  };

  const addNewDepartmentChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewDepartmentHandler = async (e) => {
    e.preventDefault();
    const formData = {
      userId: user?.userId,
      departmentName: addNewDepartment.departmentName,
      departmentHead: addNewDepartment.departmentHead,
    };
    const response = await createDepartment(formData);
    if (response?.data?.success) {
      toast.success("Department Added successfully");
      await fetchDepartment();
      setNewDepartment({
        departmentName: "",
        departmentHead: "",
      });
      setOpenAddDepartemntModal(false);
    }
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
            onClick={() => setOpenAddDepartemntModal(true)}
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6 text-start">DEPARTMENT</h2>
        <MaterialReactTable table={table} />
        {openAddDepartemntModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <form onSubmit={addNewDepartmentHandler} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Department Name
                    </label>
                    <TextField
                      name="departmentName"
                      required
                      fullWidth
                      value={addNewDepartment?.departmentName || ""}
                      onChange={addNewDepartmentChangeHandler}
                      placeholder="Enter Department Name"
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Department Head
                    </label>
                    <Autocomplete
                      sx={{ width: 250 }}
                      options={[
                        "bittu.kumar@vservit.com",
                        "zeeshan.ahmed@vservit.com",
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select"
                          variant="standard"
                          required
                        />
                      )}
                      value={addNewDepartment.departmentHead || null}
                      onChange={(event, value) =>
                        setNewDepartment((prev) => ({
                          ...prev,
                          departmentHead: value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenAddDepartemntModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Submit
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
                onSubmit={deleteDepartmentConfirmationHandler}
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
        {openUpdateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <form onSubmit={updateNewDepartmentHandler} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Department Name
                  </label>
                  <TextField
                    name="departmentName"
                    required
                    fullWidth
                    value={editDepartment?.departmentName || ""}
                    onChange={addNewDepartmentInputChangeHandler}
                    placeholder="Enter Department Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Department Head
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={[
                      "bittu.kumar@vservit.com",
                      "zeeshan.ahmed@vservit.com",
                    ]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                    value={editDepartment?.departmentHead || null}
                    onChange={(event, value) =>
                      setEditDepartment((prev) => ({
                        ...prev,
                        departmentHead: value,
                      }))
                    }
                  />
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
        )}
      </div>
    </>
  );
}

export default Department;
