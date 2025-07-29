import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  approveServiceRequest,
  getMyPendingApprovals,
} from "../../api/ServiceRequest";
import authReducer from "../../reducers2/AuthReducer2";
import { getUserById } from "../../api/UserAuth";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

function ServiceRequestApproval() {
  const user = useSelector((state) => state.authReducer.authData);
  const [userData, setUserData] = useState({});
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "Approved" or "Rejected"
  const [selectedId, setSelectedId] = useState(null);
  const [remarks, setRemarks] = useState("");

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getUserById(user.userId);
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setUserData(response?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // console.log(userData)

  const fetchServiceRequestApproval = async () => {
    try {
      setIsLoading(true);
      const response = await getMyPendingApprovals();
      console.log("API response:", response?.data?.data); // <-- Add this
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching service request approval:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceRequestApproval();
  }, []);
  //   console.log("data", data);

  const handleOpenModal = (id, action) => {
    setSelectedId(id);
    setModalAction(action);
    setRemarks("");
    setOpenModal(true);
  };

  const handleModalSubmit = async () => {
    try {
      await approveServiceRequest(selectedId, modalAction, remarks);
      setOpenModal(false);
      fetchServiceRequestApproval(); // Refresh list
    } catch (error) {
      console.error("Error submitting approval:", error);
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "serviceId", header: "Service Req Id" },
      {
        header: "Approval Level",
        Cell: ({ row }) => row.original.approvalStatus?.at(-1)?.level,
      },
      { accessorKey: "subject", header: "Subject" },
      {
        header: "Submitter",
        Cell: ({ row }) => row.original.submitter?.user,
      },
      {
        header: "Approval Status",
        Cell: ({ row }) => row.original.approvalStatus?.at(-1)?.status,
      },
      {
        header: "Logged Time",
        Cell: ({ row }) =>
          row.original.submitter?.loggedInTime
            ? new Date(row.original.submitter.loggedInTime).toLocaleString()
            : "",
      },
      {
        id: "accept",
        header: "Accept",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleOpenModal(row.original._id, "Approved")}
            color="success"
            aria-label="accept"
          >
            <CheckIcon sx={{ color: "#4caf50" }} />
          </IconButton>
        ),
      },
      {
        id: "reject",
        header: "Reject",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleOpenModal(row.original._id, "Rejected")}
            color="error"
            aria-label="reject"
          >
            <ClearIcon sx={{ color: "#f44336" }} />
          </IconButton>
        ),
      },
    ],
    [isLoading]
  );

  //Exports
  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() &&
          col.id !== "mrt-row-select" &&
          col.id !== "accept" &&
          col.id !== "reject"
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
          col.id !== "accept" &&
          col.id !== "reject"
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
    const excludedColumns = ["mrt-row-select", "accept", "reject"];

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
          {/* <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>
              {modalAction === "Approved"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>
            <DialogContent>
              <TextField
                label="Remarks"
                fullWidth
                multiline
                minRows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button
                onClick={handleModalSubmit}
                variant="contained"
                color={modalAction === "Approved" ? "success" : "error"}
                disabled={!remarks.trim()}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog> */}
          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 3, p: 1.5 },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: "1.25rem",
                textAlign: "center",
                pb: 1,
              }}
            >
              {modalAction === "Approved"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>

            <DialogContent sx={{ mt: 1 , overflowY: "visible"}}>
              <TextField
                label="Remarks"
                placeholder="Enter your remarks here..."
                fullWidth
                multiline
                minRows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.9rem",
                  },
                }}
              />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-end" }}>
              <Button
                onClick={() => setOpenModal(false)}
                variant="outlined"
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleModalSubmit}
                variant="contained"
                color={modalAction === "Approved" ? "success" : "error"}
                disabled={!remarks.trim()}
                sx={{ borderRadius: 2, textTransform: "none", ml: 1 }}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          
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
      rowsPerPageOptions: [5, 10, 15],
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
      <div>
        <h2 className="text-md font-semibold mb-4 text-start">
          SERVICE REQUEST APPROVAL
        </h2>
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

export default ServiceRequestApproval;
