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
  Menu,
  MenuItem,
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
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getAllGatePass, deleteGatePass } from "../../../api/GatePassRequest";
import { IoMdPrint } from "react-icons/io";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-GatePass",
});

function GatePassData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openGetPassDeleteModal, setOpenGetPassDeleteModal] = useState(false);
  const [deleteGetPassId, setDeleteGetPassId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [closeGatePassModal, setCloseGetPassModal] = useState(false);
  const [closeGatePassRowId, setCloseGetPassRowId] = useState(null);
  const [closeStatus, setCloseStatus] = useState("");

  const fetchGetPass = async () => {
    try {
      setIsLoading(true);
      const response = await getAllGatePass();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching gate passes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGetPass();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: "print",
        header: "Print",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/Asset/GatePassPrint/${row.original._id}`}>
              <IoMdPrint />
            </NavLink>
          </IconButton>
        ),
      },
      { accessorKey: "gatePassId", header: "ID" },
      { accessorKey: "movementType", header: "Movement Type" },
      { accessorKey: "gatePassType", header: "Gate Pass Type" },
      // { accessorKey: "expectedReturnDate", header: "Expected Date of Return" },
      {
        accessorFn: (row) => new Date(row.expectedReturnDate),
        id: "expectedReturnDate",
        header: "Expected Date of Return",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        // Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Cell: ({ cell }) => {
          const date = cell.getValue();
          // Check for epoch date (Jan 1, 1970)
          if (
            date instanceof Date &&
            date.getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()
          ) {
            return "Null"; // or return null;
          }
          return date?.toLocaleDateString();
        },
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      { accessorKey: "approvalRequired", header: "Approval" },
      { accessorKey: "fromAddress", header: "Status" },
      { accessorKey: "toAddress", header: "To Address" },
      // { accessorKey: "remarks", header: "Remarks" },
      { accessorKey: "reasonForGatePass", header: "Reason" },
      { accessorKey: "assetType", header: "Asset Type" },
      // { accessorKey: "gatePassValidity", header: "Validity" },
      {
        accessorFn: (row) => new Date(row.gatePassValidity),
        id: "gatePassValidity",
        header: "Validity",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        // Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Cell: ({ cell }) => {
          const date = cell.getValue();
          // Check for epoch date (Jan 1, 1970)
          if (
            date instanceof Date &&
            date.getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()
          ) {
            return "Null"; // or return null;
          }
          return date?.toLocaleDateString();
        },
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorKey: "attachment",
        header: "Attachment",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <a
              href={`http://localhost:5001/${cell.getValue()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-500 px-6 py-2 rounded-lg border-2 border-slate-600 text-white"
            >
              View
            </a>
          ) : (
            "No Attachment"
          ),
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/Asset/EditGetPass/${row.original._id}`}>
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
            onClick={() => handleDeleteComponents(row.original._id)}
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

  const handleDeleteComponents = (id) => {
    setDeleteGetPassId(id);
    setOpenGetPassDeleteModal(true);
  };

  const deleteGetPassDeleteHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteGatePass(deleteGetPassId);
      setOpenGetPassDeleteModal(false);
      setDeleteGetPassId(null);
      fetchGetPass();
    } catch (error) {
      console.log("Delete Get pass error", error);
    }
  };

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
    const excludedColumns = ["mrt-row-select", "edit", "delete", "file"];
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

    const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

    const exportData = data.map((item) =>
      visibleColumns.map((col) => {
        const key = col.id || col.accessorKey;
        let value = item[key];
        // Format date fields if needed
        return value ?? "";
      })
    );

    const doc = new jsPDF();
    autoTable(doc, {
      head: [headers],
      body: exportData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      margin: { top: 20 },
    });

    doc.save("Assets-Management-GatePass.pdf");
  };

  //Use for Action button
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeGetPassHandler = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      alert("Please select Get Pass to close.");
      return;
    }
    const selectedIds = selectedRows.map((row) => row.original._id);
    setCloseGetPassRowId(selectedIds);
    setCloseGetPassModal(true);
    handleClose();
  };

  const closeGatePassSubmitHandler = (e) => {
    e.preventDefault();
    try {
      console.log("closeGatePassRowId", closeGatePassRowId);
      //call api
      setCloseGetPassModal(false);
    } catch (error) {
      console.log("Error updating in close gate pass");
    }
  };

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <NavLink to="/main/Asset/CreateGatePass">
          <Button
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
        <>
          <Button
            variant="contained"
            size="small"
            onClick={handleClick}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 2,
            }}
          >
            Action
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={closeGetPassHandler} sx={{ fontSize: "0.8rem" }}>
              Close Get Pass
            </MenuItem>
          </Menu>
        </>

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
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">GET PASS</h2>
        <MaterialReactTable table={table} />
        {openGetPassDeleteModal && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
                <h2 className="text-xl font-semibold text-red-600 mb-3">
                  Are you sure?
                </h2>
                <p className="text-gray-700 mb-6">
                  This action will permanently delete the component.
                </p>
                <form
                  onSubmit={deleteGetPassDeleteHandler}
                  className="flex justify-end gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setOpenGetPassDeleteModal(false)}
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
          </>
        )}

        {closeGatePassModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Close GatePass
              </h2>
              <form onSubmit={closeGatePassSubmitHandler} className="space-y-4">
                <div className="flex items-center gap-2 mt-2">
                  <label className="w-[30%] mt-1 text-sm text-slate-700">
                    Status <span className="text-red-500 text-md">*</span>
                  </label>
                  <Autocomplete
                    className="w-[65%]"
                    options={[
                      "This item is received",
                      "Other Reason/Partial Received",
                    ]}
                    value={closeStatus}
                    onChange={(event, newValue) => setCloseStatus(newValue)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        placeholder="Selec"
                        inputProps={{
                          ...params.inputProps,
                          style: { fontSize: "0.9rem" },
                        }}
                      />
                    )}
                  />
                </div>
                {closeStatus === "This item is received" && (
                  <>
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 mt-1">
                        <label className="w-[30%] mt-1 text-xs font-semibold text-slate-600">
                          Assets Received{" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <Autocomplete
                          className="w-[65%]"
                          options={[
                            "CALIBW660INA142WJ31",
                            "CALIBW397INA142WJ62",
                            "CALIBW392IN1A42WJ28",
                          ]}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              placeholder="Selec"
                              inputProps={{
                                ...params.inputProps,
                                style: { fontSize: "0.9rem" },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="w-[30%] text-xs font-semibold text-slate-600">
                          Received Date{" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <input
                          type="date"
                          className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="w-[30%] text-xs font-semibold text-slate-600">
                          Received From (Contact Name){" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="w-[30%] text-xs font-semibold text-slate-600">
                          Received From (Contact No.){" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <input className="w-[65%] text-xs text-slate-600 border-b-2 border-slate-300 p-2 outline-none focus:border-blue-400" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="w-[30%] text-xs font-semibold text-slate-600">
                          Remarks(Contact No.){" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <textarea className="w-[65%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none rounded-md focus:border-blue-400"></textarea>
                      </div>
                    </div>
                  </>
                )}
                {closeStatus === "Other Reason/Partial Received" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mt-2">
                        <label className="w-[30%] text-sm text-slate-700">
                          Assets Received{" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <Autocomplete
                          className="w-[65%]"
                          options={[
                            "CALIBW660INA142WJ31",
                            "CALIBW397INA142WJ62",
                            "CALIBW392IN1A42WJ28",
                          ]}
                          getOptionLabel={(option) => option}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              placeholder="Selec"
                              inputProps={{
                                ...params.inputProps,
                                style: { fontSize: "0.9rem" },
                              }}
                            />
                          )}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="w-[30%] text-sm text-slate-700">
                          Remarks(Contact No.){" "}
                          <span className="text-red-500 text-md">*</span>
                        </label>
                        <textarea className="w-[65%] text-xs text-slate-600 border-2 border-slate-300 p-2 outline-none rounded-md focus:border-blue-500"></textarea>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-3 pt-4 mt-6">
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloseGetPassModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-md text-sm transition-all"
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

export default GatePassData;
