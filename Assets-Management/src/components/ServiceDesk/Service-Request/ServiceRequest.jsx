import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Autocomplete, Box, Button, IconButton } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { MdModeEdit } from "react-icons/md";
import { FaDesktop } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { getAllIncident } from "../../../api/IncidentRequest";
import {
  getAllServiceRequests,
  getServiceRequestStatusCounts,
} from "../../../api/serviceRequest";
import { useSelector } from "react-redux";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});
const ticketOptions = ["All Tickets", "My Tickets"];

function ServiceRequest() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState([]);
  const [changeStatus, setChangeStatus] = useState(false);
  const [seletecetdRowId, setSelectedRowId] = useState(null);
  const [selectDropDownValue, setSelectDropDownValue] = useState("");
  const [ticketType, setTicketType] = useState(ticketOptions[0]);


  const fetchService = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllServiceRequests();
      setData(response?.data?.data || []);
      const countResponse = await getServiceRequestStatusCounts();
      // Convert object to array if needed
      let counts = countResponse?.data?.data;
      if (counts && !Array.isArray(counts)) {
        counts = [
          { id: "1", count: counts["New"] || 0, description: "New" },
          { id: "2", count: counts["Assigned"] || 0, description: "Assigned" },
          {
            id: "3",
            count: counts["In-Progress"] || 0,
            description: "In-Progress",
          },
          { id: "4", count: counts["Pause"] || 0, description: "Pause" },
          { id: "5", count: counts["Resolved"] || 0, description: "Resolved" },
          {
            id: "6",
            count: counts["Cancelled"] || counts["cancel"] || 0,
            description: "Cancelled",
          },
          {
            id: "7",
            count: counts["Reopened"] || counts["reopen"] || 0,
            description: "Reopened",
          },
          { id: "8", count: counts["Closed"] || 0, description: "Closed" },
          {
            id: "9",
            count: counts["Converted to SR"] || 0,
            description: "Converted to SR",
          },
          {
            id: "11",
            count: response?.data?.data?.length || 0,
            description: "Total",
          },
        ];
      }
      setCardData(counts || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchService();
  }, []);

  // console.log("data", data);
  //
  const filteredData = useMemo(() => {
    if (ticketType === "All Tickets") {
      return data;
    } else if (ticketType === "My Tickets") {
      return data.filter((item) => item.submitter?.userId === user?.userId);
    }
    return data;
  }, [data, ticketType, user?.userId]);

  //status
  const selectedRow = data.find((item) => item._id === seletecetdRowId);
  // console.log("selectedRow", selectedRow?._id); //use later

  const statusSubmitHandler = (e) => {
    e.preventDefault();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "serviceId",
        header: "Service Req ID",
      },
      {
        accessorKey: "subject",
        header: "Subject",
      },
      {
        accessorKey: "category",
        header: "Category",
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
      },
      {
        accessorKey: "submitter.user",
        header: "Submitter",
      },
      {
        accessorKey: "classificaton.technician",
        header: "Assigned To",
      },
      // {
      //   accessorKey: "",
      //   header: "Approval",
      // },
      {
        accessorKey: "submitter.loggedInTime",
        header: "Logged Time",
        Cell: ({ cell }) =>
          cell.getValue()
            ? new Date(cell.getValue()).toLocaleString("en-IN", {
                timeZone: "UTC",
              })
            : "",
      },
      // {
      //   accessorKey: "",
      //   header: "SLA",
      // },
      {
        header: "Status",
        accessorKey: "statusTimeline",
        Cell: ({ row }) => {
          const timeline = row.original.statusTimeline;
          if (!Array.isArray(timeline)) return "No Timeline";
          if (timeline.length === 0) return "No Status";
          const lastStatus = timeline[timeline.length - 1];
          return lastStatus.status || "No Status";
        },
      },

      // {
      //   accessorKey: "",
      //   header: "TAT",
      // },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() =>
              navigate(
                `/main/ServiceDesk/edit-service-request/${row.original._id}`
              )
            }
            color="primary"
            aria-label="edit"
          >
            <MdModeEdit />
          </IconButton>
        ),
      },
    ],
    [isLoading]
  );

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
        <Box className="flex flex-wrap w-full">
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/main/ServiceDesk/new-service-request")}
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
          <Autocomplete
            className="w-[15%]"
            sx={{
              ml: 2,
              mt: 1,
              mb: 1,
              "& .MuiInputBase-root": {
                borderRadius: "0.35rem",
                backgroundColor: "#f9fafb",
                fontSize: "0.85rem",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#94a3b8",
              },
            }}
            options={ticketOptions}
            value={ticketType}
            onChange={(_, newValue) =>
              setTicketType(newValue || ticketOptions[0])
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
                inputProps={{
                  ...params.inputProps,
                  style: { fontSize: "0.85rem", padding: "8px" },
                }}
              />
            )}
          />
          <Button
            variant="contained"
            size="small"
            disabled={table.getSelectedRowModel().rows.length !== 1}
            sx={{
              padding: "4px 12px",
              backgroundColor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              mt: 1,
              mb: 1,
              ml: 2,
              "&.Mui-disabled": {
                backgroundColor: "#B0BBE5",
                color: "#FFFFFF",
                cursor: "not-allowed",
              },
              opacity: table.getSelectedRowModel().rows.length !== 1 ? 0.5 : 1,
              cursor:
                table.getSelectedRowModel().rows.length !== 1
                  ? "not-allowed"
                  : "pointer",
            }}
            onClick={() => {
              const selectedRow = table.getSelectedRowModel().rows[0];
              const id = selectedRow.original?._id;
              setSelectedRowId(id);
              setChangeStatus(true);
            }}
          >
            Change Status
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
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold mb-6 text-start">
            ALL SERVICE REQUESTS
          </h2>
          <button
            onClick={() => navigate("/main/dashboard/request")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-2 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span> View Dashboard</span>
            </div>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {cardData.map((item) => (
            <div
              key={item?.id}
              className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 text-gray-700 transition"
            >
              <h2 className="font-semibold text-xl text-blue-600 mb-1">
                {item.count}
              </h2>
              <span className="text-sm">{item.description}</span>
            </div>
          ))}
        </div>
        <MaterialReactTable table={table} />
        {changeStatus && (
          <>
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
                <h2 className="text-md font-medium text-gray-800 mb-4">
                  CHANGE SERVICE REQUEST STATUS
                </h2>
                <form onSubmit={statusSubmitHandler} className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-1">
                    <div className="flex items-center gap-2 mt-2">
                      <label className="w-[40%] text-sm font-medium text-gray-500">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectDropDownValue}
                        onChange={(e) => setSelectDropDownValue(e.target.value)}
                        className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                      >
                        <option value="" className="text-start">
                          Select
                        </option>
                        <option value="new" className="text-start">
                          New
                        </option>
                        <option value="approvalPending" className="text-start">
                          Approval Pending
                        </option>
                        <option value="provisioning" className="text-start">
                          Provisioning
                        </option>
                        <option value="assigned" className="text-start">
                          Assigned
                        </option>
                        <option value="inProgress" className="text-start">
                          In Progress
                        </option>
                        <option value="onHold" className="text-start">
                          On Hold
                        </option>
                        <option value="cancelled" className="text-start">
                          Cancelled
                        </option>
                        <option value="rejected" className="text-start">
                          Rejected
                        </option>
                        <option value="resolved" className="text-start">
                          Resolved
                        </option>
                        <option value="closed" className="text-start">
                          Closed
                        </option>
                        <option
                          value="serviceToIncident"
                          className="text-start"
                        >
                          Service To Incident
                        </option>
                        <option value="waitingForUpdate" className="text-start">
                          Waiting For Update
                        </option>
                      </select>
                    </div>
                    {selectDropDownValue === "assigned" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Department
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={["IT Support"]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Group
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={["", ""]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Technician
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={["", ""]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    {selectDropDownValue === "onHold" && (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Comments
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"></textarea>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Support Department
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={[
                                "Pending With Vendor / OEM",
                                "Pause With Other Reason",
                                "Standby Provided",
                              ]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Remarks
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"></textarea>
                        </div>
                      </>
                    )}
                    {selectDropDownValue === "resolved" && (
                      <>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Enter Comments
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            rows={2}
                            className="w-[60%] px-4 py-2 border-b border-gray-300 outline-none transition-all cursor-pointer"
                          ></textarea>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="w-[40%] text-sm font-medium text-gray-500">
                            Closure Code
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="w-[60%]">
                            <Autocomplete
                              options={[""]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select"
                                  variant="standard"
                                  required
                                />
                              )}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 mt-6">
                    <button
                      type="submit"
                      className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangeStatus(false)}
                      className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ServiceRequest;
