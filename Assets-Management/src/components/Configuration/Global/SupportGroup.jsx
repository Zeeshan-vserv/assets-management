import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Autocomplete,
  TextField,
} from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  getAllSupportDepartment,
  addSupportGroup,
  deleteSupportGroup,
  updateSupportGroup,
} from "../../../api/SuportDepartmentRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SupportGroup.csv",
});

const SupportGroup = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    supportDepartmentName: "",
    supportGroupName: "",
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState({ departmentId: "", groupId: "" });
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  // Fetch all departments and groups
  const fetchDepartmentsAndGroups = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSupportDepartment();
      setDepartments(response?.data?.data || []);
      // Flatten all groups with department info
      const allGroups = (response?.data?.data || []).flatMap((dep) =>
        (dep.supportGroups || []).map((group) => ({
          ...group,
          supportDepartmentName: dep.supportDepartmentName,
          supportDepartmentId: dep._id,
        }))
      );
      setData(allGroups);
    } catch (error) {
      toast.error("Error fetching support groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsAndGroups();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "supportGroupId",
        header: "Support Group Id",
      },
      {
        accessorKey: "supportDepartmentName",
        header: "Support Department Name",
      },
      {
        accessorKey: "supportGroupName",
        header: "Support Group Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleEditGroup(row.original)}
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
            onClick={() => handleDeleteGroup(row.original)}
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
    const selectedDepartment = departments.find(
      (dep) => dep.supportDepartmentName === addForm.supportDepartmentName
    );
    if (!selectedDepartment) {
      toast.error("Please select a department");
      return;
    }
    if (!addForm.supportGroupName) {
      toast.error("Please enter group name");
      return;
    }
    try {
      const res = await addSupportGroup(selectedDepartment._id, {
        supportGroupName: addForm.supportGroupName,
      });
      if (res?.data?.success) {
        toast.success("Support Group added successfully");
        fetchDepartmentsAndGroups();
        setAddForm({ supportDepartmentName: "", supportGroupName: "" });
        setOpenAddModal(false);
      } else {
        toast.error(res?.data?.message || "Failed to add group");
      }
    } catch (error) {
      toast.error("Error adding support group");
    }
  };

  // Delete
  const handleDeleteGroup = (group) => {
    setDeleteIds({
      departmentId: group.supportDepartmentId,
      groupId: group._id,
    });
    setDeleteModal(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteSupportGroup(
        deleteIds.departmentId,
        deleteIds.groupId
      );
      if (res?.data?.success) {
        toast.success("Support Group deleted successfully");
        fetchDepartmentsAndGroups();
      } else {
        toast.error(res?.data?.message || "Failed to delete group");
      }
    } catch (error) {
      toast.error("Error deleting support group");
    }
    setDeleteModal(false);
    setDeleteIds({ departmentId: "", groupId: "" });
  };

  // Edit
  const handleEditGroup = (group) => {
    setEditGroup({
      _id: group._id,
      supportDepartmentName: group.supportDepartmentName,
      supportGroupName: group.supportGroupName,
      supportDepartmentId: group.supportDepartmentId,
    });
    setOpenUpdateModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditGroup((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editGroup?._id) return;
    try {
      const res = await updateSupportGroup(editGroup._id, {
        supportGroupName: editGroup.supportGroupName,
      });
      if (res?.data?.success) {
        toast.success("Support Group updated successfully");
        fetchDepartmentsAndGroups();
        setOpenUpdateModal(false);
        setEditGroup(null);
      } else {
        toast.error(res?.data?.message || "Failed to update group");
      }
    } catch (error) {
      toast.error("Error updating support group");
    }
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

  function handleExportData() {
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
  }

  function handlePdfData() {
    const excludedColumns = ["mrt-row-select", "edit", "delete"];
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));
    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);
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
    doc.save("Assets-Management-SupportGroup.pdf");
  }

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">SUPPORT GROUP</h2>
        <MaterialReactTable table={table} />
        {openAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Add Support Group
              </h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Support Department Name
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={departments.map(
                      (dep) => dep.supportDepartmentName
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Department"
                        variant="standard"
                        required
                      />
                    )}
                    value={addForm.supportDepartmentName || null}
                    onChange={(event, value) =>
                      setAddForm((prev) => ({
                        ...prev,
                        supportDepartmentName: value || "",
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Support Group Name
                  </label>
                  <TextField
                    name="supportGroupName"
                    required
                    fullWidth
                    value={addForm.supportGroupName}
                    onChange={handleAddChange}
                    placeholder="Enter Group Name"
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
                    onClick={() => setOpenAddModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
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
                This action will permanently delete the group.
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
        {/* Edit Modal */}
        {openUpdateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                Edit Support Group
              </h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Support Department Name
                  </label>
                  <span className="w-60 text-lg border-b border-gray-400 text-black">
                    {editGroup?.supportDepartmentName || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Support Group Name
                  </label>
                  <TextField
                    name="supportGroupName"
                    required
                    fullWidth
                    value={editGroup?.supportGroupName || ""}
                    onChange={handleEditChange}
                    placeholder="Enter Group Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
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
};

export default SupportGroup;
