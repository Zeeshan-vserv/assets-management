import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
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
import { getAllAssets } from "../../../api/AssetsRequest"; //Later change this api

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Assets",
});

function GetPass() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openGetPassDeleteModal, setOpenGetPassDeleteModal] = useState(false);
  const [deleteGetPassId, setDeleteGetPassId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchGetPass = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching assets:", error);
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
        accessorKey: "assetId",
        header: "ID",
      },
      {
        accessorKey: "assetInformation.assetTag",
        header: "Movement Type",
      },
      {
        accessorKey: "assetState.user",
        header: "Get Pass Type",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Expected Date of Return",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Approval",
      },
      {
        accessorKey: "locationInformation.location",
        header: "Status",
      },
      {
        accessorFn: (row) => new Date(row.startDate),
        id: "startDate",
        header: "Created Date",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorFn: (row) => new Date(row.startDate),
        id: "endDate",
        header: "Validity",
        filterVariant: "date",
        filterFn: "lessThan",
        sortingFn: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        muiFilterTextFieldProps: {
          sx: {
            minWidth: "250px",
          },
        },
      },
      {
        accessorKey: "locationInformation.subLocation",
        header: "Attachment",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/Asset/edit-pass/${row.original._id}`}>
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

  const deleteGetPassDeleteHandler = async () => {
    try {
      console.log("Deleted", deleteGetPassId);
      //call api
      setOpenGetPassDeleteModal(false);
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

    doc.save("Assets-Management-Assets.pdf");
  };

  //Use for Action button
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const printGetPassHandler = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      alert("Please select Get Pass to print.");
      return;
    }
    const selectedIds = selectedRows.map((row) => row.original._id);
    // console.log("Printing Get Passes with IDs:", selectedIds);
    //logic
    handleClose();
  };
  const closeGetPassHandler = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      alert("Please select Get Pass to close.");
      return;
    }
    const selectedIds = selectedRows.map((row) => row.original._id);
    // console.log("Closing Get Passes with IDs:", selectedIds);
    //logic
    handleClose();
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
        <NavLink to="/main/Asset/get-pass-import">
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
            <MenuItem onClick={printGetPassHandler} sx={{ fontSize: "0.8rem" }}>
              Print Get Pass
            </MenuItem>
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
                  className="flex justify-end gap-3"
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
      </div>
    </>
  );
}

export default GetPass;
