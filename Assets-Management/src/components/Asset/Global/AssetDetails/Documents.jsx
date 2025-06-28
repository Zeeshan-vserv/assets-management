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
import { getAllAssets } from "../../../../api/AssetsRequest"; //later chnage
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Documents.csv",
});

function Documents({ id }) {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addDocumentsModal, setAddDocumentsModal] = useState(false);
  const [addNewDocuments, setAddNewDocuments] = useState({
    documentsName: "",
    description: "",
  });
  const [fileDate, setFileDate] = useState(null);

  const [editDocuments, setEditDocuments] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [editFileDate, setEditFileDate] = useState(null);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteDocumentsId, setDeleteDocumentsId] = useState(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // console.log(data);
  // console.log(id);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Id",
      },

      {
        accessorKey: "assetState.user",
        header: "Name",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Description",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Upload Date",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateDocuments(row.original._id)}
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
            onClick={() => handleDeleteDocuments(row.original._id)}
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
  const addNewDocumentsChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewDocuments((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewDocumentsHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("documentsName", addNewDocuments.documentsName);
      formData.append("description", addNewDocuments.description);
      if (fileDate) {
        formData.append("file", fileDate);
      }

      console.log("Form data to be submitted:", {
        documentsName: addNewDocuments.documentsName,
        description: addNewDocuments.description,
        file: fileDate ? fileDate.name : "No file selected",
      });
      //call api

      fetchDocuments();
      setAddNewDocuments({
        documentsName: "",
        description: "",
      });
      setFileDate(null);
    } catch (error) {
      console.error("Error adding new documents:", error);
    }
    setAddDocumentsModal(false);
  };

  //update
  const handleUpdateDocuments = (id) => {
    const documentsToEdit = data?.find((d) => d._id === id);
    if (documentsToEdit) {
      setEditDocuments({
        _id: documentsToEdit._id,
        documentsName: documentsToEdit.documentsName,
        description: documentsToEdit.description,
        fileDate: documentsToEdit.fileDate,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateDocumentsChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditDocuments((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateDocumentsHandler = async (e) => {
    e.preventDefault();
    if (!editDocuments?._id) return;
    try {
      const formData = new FormData();
      formData.append("documentsName", editDocuments.documentsName);
      formData.append("description", editDocuments.description);

      if (editFileDate) {
        formData.append("file", editFileDate);
      }

      console.log("Update form data:", {
        documentsName: editDocuments.documentsName,
        description: editDocuments.description,
        file: editFileDate ? editFileDate.name : "Using existing file",
      });

      //call api
      // await updateDocumentsApi(editDocuments._id, formData);

      fetchDocuments();
      setOpenUpdateModal(false);
      setEditDocuments(null);
      setEditFileDate(null);
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  //delete
  const handleDeleteDocuments = (id) => {
    setDeleteDocumentsId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteDocumentsHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("deleteDocumentsId", deleteDocumentsId);
      //call api
    } catch (error) {
      console.error("Error deleting documents:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteDocumentsId(null);
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
    doc.save("Assets-Management-Documents.pdf");
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
            onClick={() => setAddDocumentsModal(true)}
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
            Add Files
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100 overflow-x-auto">
        <MaterialReactTable table={table} />
        {addDocumentsModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                ADD DOCUMENT
              </h2>
              <form onSubmit={addNewDocumentsHandler} className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <TextField
                      name="documentsName"
                      required
                      fullWidth
                      value={addNewDocuments?.documentsName || ""}
                      onChange={addNewDocumentsChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={addNewDocuments?.description || ""}
                      onChange={addNewDocumentsChangeHandler}
                      className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="documentsImage"
                      className="w-40 text-xs font-semibold text-slate-600"
                    >
                      File
                    </label>
                    <input
                      className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                      type="file"
                      id="documentsImage"
                      name="documentsImage"
                      onChange={(e) => setFileDate(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddDocumentsModal(false)}
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
                  Edit ADD DOCUMENT
                </h2>
                <form onSubmit={updateDocumentsHandler} className="space-y-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <TextField
                        name="documentsName"
                        required
                        fullWidth
                        value={editDocuments?.documentsName || ""}
                        onChange={updateDocumentsChangeHandler}
                        variant="standard"
                        sx={{ width: 250 }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="w-40 text-sm font-medium text-gray-500">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editDocuments?.description || ""}
                        onChange={updateDocumentsChangeHandler}
                        className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                      ></textarea>
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="documentsImage"
                        className="w-40 text-xs font-semibold text-slate-600"
                      >
                        File
                      </label>
                      <input
                        className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-500"
                        type="file"
                        id="editDocumentsImage"
                        name="editDocumentsImage"
                        onChange={(e) => setEditFileDate(e.target.files[0])}
                      />
                      {editDocuments?.fileDate && !editFileDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current file: {editDocuments.fileDate}
                        </p>
                      )}
                      {editFileDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          New file selected: {editFileDate.name}
                        </p>
                      )}
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
                onSubmit={deleteDocumentsHandler}
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

export default Documents;
