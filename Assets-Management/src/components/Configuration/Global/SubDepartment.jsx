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
  deleteSubDepartment,
  getAllSubDepartment,
  addSubDepartment,
  updateSubDepartment,
} from "../../../api/DepartmentRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SubDepartment.csv",
});

function SubDepartment() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddSubDepartemntModal, setOpenAddSubDepartemntModal] =
    useState(false);
  const [addNewSubDepartment, setNewSubDepartment] = useState({
    departmentName: "",
    subdepartmentName: "",
  });
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSubDepartmentId, setDeleteSubDepartmentId] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);

  const fetchDepartmentAndSubDepartemntData = async () => {
    try {
      setIsLoading(true);
      const response = await getAllDepartment();
      setDepartments(response?.data?.data);
      const allSubDepartments = response?.data?.data?.reduce(
        (acc, department) => {
          if (
            department.subdepartments &&
            department.subdepartments.length > 0
          ) {
            return [
              ...acc,
              ...department.subdepartments.map((sub) => ({
                ...sub,
                departmentName: department.departmentName,
                departmentId: department.departmentId,
                department_id: department._id,
              })),
            ];
          }
          return acc;
        },
        []
      );
      setData(allSubDepartments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentAndSubDepartemntData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "subdepartmentId",
        header: "Sub Department Id",
      },
      {
        accessorKey: "departmentName",
        header: "Department Name",
      },
      {
        accessorKey: "subdepartmentName",
        header: "Sub Department Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateSubDepartment(row.original)}
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
            onClick={() => handleDeleteSubDepartment(row.original)}
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
  const addNewSubDepartmentChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewSubDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSubDepartmentHandler = async (e) => {
    e.preventDefault();
    const selectedDepartment = departments.find(
      (dept) => dept.departmentName === addNewSubDepartment.departmentName
    );
    const formData = {
      // userId: user?.userId,
      // departmentId: selectedDepartment.departmentId,
      // departmentName: addNewSubDepartment.departmentName,
      // subdepartments: [
      //   {
      subdepartmentName: addNewSubDepartment.subdepartmentName,
      //   },
      // ],
    };

    const response = await addSubDepartment(selectedDepartment._id, formData);
    if (response?.data?.success) {
      toast.success("Sub Department Added successfully");
      await fetchDepartmentAndSubDepartemntData();
      setNewSubDepartment({
        departmentName: "",
        subdepartmentName: "",
      });
      setOpenAddSubDepartemntModal(false);
    }
  };

  //delete
  const handleDeleteSubDepartment = async (subDepartment, id) => {
    // console.log(subDepartment);

    setDeleteSubDepartmentId({
      departmentId: subDepartment.department_id,
      subdepartmentId: subDepartment._id,
    });
    setDeleteConfirmationModal(true);
  };

  // Confirmation handler
  const deleteSubDepartmentConfirmationHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteSubDepartment(
        deleteSubDepartmentId.departmentId,
        deleteSubDepartmentId.subdepartmentId
      );

      if (response?.data?.success) {
        toast.success("Sub Department deleted successfully");
        await fetchDepartmentAndSubDepartemntData();
      } else {
        throw new Error(
          response?.data?.message || "Failed to delete sub department"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete sub department"
      );
    } finally {
      setDeleteConfirmationModal(false);
    }
  };

  //Update

  const UpdateSubDepartmentChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubDepartment = (subDepartment) => {
    setEditDepartment({
      _id: subDepartment._id,
      departmentName: subDepartment.departmentName,
      subdepartmentName: subDepartment.subdepartmentName,
      departmentId: subDepartment.department_id,
    });
    setOpenUpdateModal(true);
  };

  const updateSubDepartmentHandler = async (e) => {
    e.preventDefault();
    if (!editDepartment?._id) return;
    try {
      const formData = {
        subdepartmentName: editDepartment.subdepartmentName,
      };

      const response = await updateSubDepartment(editDepartment._id, formData);
      if (response?.data?.success) {
        toast.success("Sub Department Updated successfully");
        await fetchDepartmentAndSubDepartemntData();
        setOpenUpdateModal(false);
        setEditDepartment(null);
      } else {
        throw new Error(
          response?.data?.message || "Failed to update sub department"
        );
      }
    } catch (error) {
      console.error("Error updating sub department:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update sub department"
      );
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
            onClick={() => setOpenAddSubDepartemntModal(true)}
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
        <h2 className="text-lg font-semibold mb-6 text-start">
          SUB DEPARTMENT
        </h2>
        <MaterialReactTable table={table} />
        {openAddSubDepartemntModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {" "}
                Add Sub Department
              </h2>
              <form onSubmit={addNewSubDepartmentHandler} className="space-y-4">
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Department Name
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={departments.map((dept) => dept.departmentName)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                    value={addNewSubDepartment.departmentName || null}
                    onChange={(event, value) =>
                      setNewSubDepartment((prev) => ({
                        ...prev,
                        departmentName: value || "",
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Sub Department Name
                  </label>
                  <TextField
                    name="subdepartmentName"
                    required
                    fullWidth
                    value={addNewSubDepartment.subdepartmentName}
                    onChange={addNewSubDepartmentChangeHandler}
                    placeholder="Enter Sub Department Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenAddSubDepartemntModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
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
                onSubmit={deleteSubDepartmentConfirmationHandler}
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
        {openUpdateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {" "}
                Edit Sub Department
              </h2>
              <form onSubmit={updateSubDepartmentHandler} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Department Name
                  </label>
                  <span className="w-60 text-lg border-b border-gray-400 text-black">
                    {editDepartment?.departmentName || "N/A"}
                  </span>
                  {/* <TextField
                    name="departmentName"
                    required
                    fullWidth
                    value={editDepartment?.departmentName || ""}
                    onChange={addNewSubDepartmentChangeHandler}
                    placeholder="Enter Department Name"
                    variant="standard"
                    sx={{ width: 250 }}
                    readOnly
                  /> */}
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Department Name
                  </label>
                  <TextField
                    name="subdepartmentName"
                    required
                    fullWidth
                    value={editDepartment?.subdepartmentName || ""}
                    onChange={UpdateSubDepartmentChangeHandler}
                    placeholder="Enter Sub Department Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    onClick={() => setOpenUpdateModal(false)}
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
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SubDepartment;
