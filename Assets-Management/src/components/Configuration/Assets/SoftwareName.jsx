import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
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
  createSoftware,
  deleteSoftware,
  getAllPublisher,
  getAllSoftware,
  getAllSoftwareCategory,
  updateSoftware,
} from "../../../api/SoftwareCategoryRequest";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SoftwareName.csv",
});

function SoftwareName() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addSoftwareNameModal, setAddSoftwareNameModal] = useState(false);
  const [addNewSoftwareName, setAddNewSoftwareName] = useState({
    softwareName: "",
    publisher: "",
    softwareCategory: "",
  });
  const [publishers, setPublishers] = useState([]);
  const [softwareCategories, setSoftwareCategories] = useState([]);

  const [editSoftwareName, setEditSoftwareName] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSoftwareNameId, setDeleteSoftwareNameId] = useState(null);

  const fetchSoftwareName = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSoftware();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching software names:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublisherData = async () => {
    try {
      const res = await getAllPublisher();
      setPublishers(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching publishers:", error);
    }
  };

  const fetchSoftwareCategory = async () => {
    try {
      const res = await getAllSoftwareCategory();
      setSoftwareCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching software categories:", error);
    }
  };

  useEffect(() => {
    fetchSoftwareName();
    fetchPublisherData();
    fetchSoftwareCategory();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "softwareNameId",
        header: "Software Name Id",
      },
      {
        accessorKey: "softwareCategory",
        header: "Software Category",
        Cell: ({ row }) => row.original.softwareCategory || "",
      },
      {
        accessorKey: "publisher",
        header: "Publisher",
        Cell: ({ row }) => row.original.publisher || "",
      },
      {
        accessorKey: "softwareName",
        header: "Software Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateSoftwareName(row.original._id)}
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
            onClick={() => handleDeleteSoftwareName(row.original._id)}
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

  const addNewSoftwareNameChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSoftwareName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSoftwareNameHandler = async (e) => {
    e.preventDefault();
    const formData = {
      softwareName: addNewSoftwareName.softwareName,
      publisher: addNewSoftwareName.publisher,
      softwareCategory: addNewSoftwareName.softwareCategory,
    };
    try {
      const createSoftwareResponse = await createSoftware(formData);
      if (createSoftwareResponse?.data?.success) {
        toast.success("Software created successfully");
        fetchSoftwareName();
      }
      setAddNewSoftwareName({
        softwareName: "",
        publisher: "",
        softwareCategory: "",
      });
    } catch (error) {
      console.error("Error adding new software name:", error);
    }
    setAddSoftwareNameModal(false);
  };

  const handleUpdateSoftwareName = (id) => {
    const softwareNameToEdit = data?.find((d) => d._id === id);
    if (softwareNameToEdit) {
      setEditSoftwareName({
        _id: softwareNameToEdit._id,
        softwareName: softwareNameToEdit.softwareName,
        publisher: softwareNameToEdit.publisher || "",
        softwareCategory: softwareNameToEdit.softwareCategory || "",
      });
      setOpenUpdateModal(true);
    }
  };

  const updateSoftwareNameChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditSoftwareName((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSoftwareNameHandler = async (e) => {
    e.preventDefault();
    if (!editSoftwareName?._id) return;
    const updatedData = {
      softwareName: editSoftwareName.softwareName,
      publisher: editSoftwareName.publisher,
      softwareCategory: editSoftwareName.softwareCategory,
    };
    try {
      const updateSoftwareResponse = await updateSoftware(
        editSoftwareName._id,
        updatedData
      );
      if (updateSoftwareResponse?.data?.success) {
        toast.success("Software updated successfully");
        fetchSoftwareName();
      }
      setEditSoftwareName(null);
      setOpenUpdateModal(false);
    } catch (error) {
      console.error("Error updating software name:", error);
    }
  };

  // Delete
  const handleDeleteSoftwareName = (id) => {
    setDeleteSoftwareNameId(id);
    setDeleteConfirmationModal(true);
  };
  const deleteSoftwareNameHandler = async (e) => {
    e.preventDefault();
    try {
      const deleteSoftwareResponse = await deleteSoftware(deleteSoftwareNameId);
      if (deleteSoftwareResponse?.data?.success) {
        toast.success("Software deleted successfully");
        fetchSoftwareName();
      }
    } catch (error) {
      console.error("Error deleting software name:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteSoftwareNameId(null);
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
          onClick={() => setAddSoftwareNameModal(true)}
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
    doc.save("Assets-Management-SoftwareName.pdf");
  }

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">SOFTWARE NAME</h2>
        <MaterialReactTable table={table} />
        {addSoftwareNameModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-start">
                Add Software Name
              </h2>
              <form onSubmit={addNewSoftwareNameHandler} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Software Name <span className="text-red-500 text-base">*</span>
                  </label>
                  <TextField
                    name="softwareName"
                    required
                    fullWidth
                    value={addNewSoftwareName.softwareName || ""}
                    onChange={addNewSoftwareNameChangeHandler}
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Publisher
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={publishers.map(
                      (publisher) => publisher.publisherName
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                      />
                    )}
                    value={addNewSoftwareName.publisher || null}
                    onChange={(event, value) =>
                      setAddNewSoftwareName((prev) => ({
                        ...prev,
                        publisher: value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Software Category
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={softwareCategories.map(
                      (category) => category.softwareCategoryName
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                      />
                    )}
                    value={addNewSoftwareName.softwareCategory || null}
                    onChange={(event, value) =>
                      setAddNewSoftwareName((prev) => ({
                        ...prev,
                        softwareCategory: value,
                      }))
                    }
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
                    onClick={() => setAddSoftwareNameModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {openUpdateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-lg font-semibold mb-4 text-start">
                Edit Software Name
              </h2>
              <form onSubmit={updateSoftwareNameHandler} className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Software Name <span className="text-red-500 text-base">*</span>
                  </label>
                  <TextField
                    name="softwareName"
                    required
                    fullWidth
                    value={editSoftwareName?.softwareName || ""}
                    onChange={updateSoftwareNameChangeHandler}
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Publisher <span className="text-red-500 text-base">*</span>
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={publishers.map(
                      (publisher) => publisher.publisherName
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                    value={editSoftwareName?.publisher || null}
                    onChange={(event, value) =>
                      setEditSoftwareName((prev) => ({
                        ...prev,
                        publisher: value,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Software Category <span className="text-red-500 text-base">*</span>
                  </label>
                  <Autocomplete
                    sx={{ width: 250 }}
                    options={softwareCategories.map(
                      (category) => category.softwareCategoryName
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select"
                        variant="standard"
                        required
                      />
                    )}
                    value={editSoftwareName?.softwareCategory || null}
                    onChange={(event, value) =>
                      setEditSoftwareName((prev) => ({
                        ...prev,
                        softwareCategory: value,
                      }))
                    }
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

        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the software name.
              </p>
              <form
                onSubmit={deleteSoftwareNameHandler}
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

export default SoftwareName;
