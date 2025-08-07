import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton } from "@mui/material";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { Autocomplete, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { getAllIncident, updateIncident } from "../../api/IncidentRequest";
import { getAllUsers } from "../../api/UserAuth";
import { getAllSLAs } from "../../api/slaRequest";
import dayjs from "dayjs";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Department.csv",
});

const NewIncidentsAssigned = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [slaData, setSlaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newAssignedModal, setNewAssignedModal] = useState(false);
  const [newIncidentAssignedTo, setNewIncidentAssigendTo] = useState({
    role: "",
    technician: "",
  });
  const [technicianData, setTechnicianData] = useState([]);
  const [assignedId, setAssignedId] = useState(null);

  const fetchDepartment = async () => {
    try {
      setIsLoading(true);
      // const response = await getAllDepartment();
      const response = await getAllIncident();
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

  const fetchSlaCreation = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAs();
      setSlaData(response?.data?.data[0] || []);
    } catch (error) {
      console.error("Error fetching holiday calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaCreation();
  }, []);

  const fetchTechnicans = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      // console.log(response);
      setTechnicianData(response?.data || []);
    } catch (error) {
      console.error("Error fetching users role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicans();
  }, []);

  // console.log(technicianData);
  const filteredTechnicians = useMemo(() => {
    return technicianData?.filter((tech) =>
      ["L1 Technician", "L2 Technician", "L3 Technician"].includes(
        tech.userRole
      )
    );
  }, [technicianData, newIncidentAssignedTo.role]);

  // console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "incidentId",
        header: "Incident ID",
      },
      {
        accessorKey: "status",
        header: "Status",
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
        accessorKey: "assetDetails.asset",
        header: "Asset Id",
      },
      {
        accessorKey: "locationDetails.location",
        header: "Location",
      },
      {
        accessorKey: "locationDetails.subLocation",
        header: "Sub Location",
      },
      // {
      //   accessorKey: "submitter.loggedInTime",
      //   header: "Logged Time",
      // },
      {
        accessorKey: "createdAt",
        header: "Logged Time",
        Cell: ({ cell }) =>
          dayjs(cell.getValue()).format("DD MMM YYYY, hh:mm A"),
      },
      {
        accessorKey: "classificaton.severityLevel",
        header: "Severity",
      },
      {
        id: "assignedTo",
        header: "Assigned To",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <Button
            onClick={() => handleAssignedTo(row.original)}
            color="error"
            sx={{
              textTransform: "none",
              color: "white",
              backgroundColor: "#4bcf5a",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "0.72rem",
              fontWeight: 500,
            }}
          >
            New Assigned
          </Button>
        ),
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton color="primary" aria-label="edit">
            <NavLink to={`/main/ServiceDesk/EditIncident/${row.original._id}`}>
              <MdModeEdit />
            </NavLink>
          </IconButton>
        ),
      },
    ],
    [isLoading]
  );
  const handleAssignedTo = (id) => {
    setNewAssignedModal(true);
    setAssignedId(id);
  };

  const newIncidentsAssignedToChangeHandler = (e) => {
    const { name, value } = e.target;
    setNewIncidentAssigendTo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewAssignedToHandler = async (e) => {
    e.preventDefault();
    try {
      const oldClassification = assignedId.classificaton || {};
      const updateData = {
        status: "Task Assigned",
        changedBy: user.userId,
        role: newIncidentAssignedTo.role,
        classificaton: {
          ...oldClassification,
          technician: newIncidentAssignedTo.technician,
        },
      };

      const response = await updateIncident(assignedId._id, updateData);
    } catch (error) {
      // console.log("Error updating technicians", error);
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
        <Box className="flex flex-wrap w-full">
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">ASSIGNED TASK</h2>
        <MaterialReactTable table={table} />

        {newAssignedModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-6 animate-fade-in">
              <h2 className="text-xl font-medium text-gray-800 mb-6">
                Select Technicians
              </h2>
              <form onSubmit={addNewAssignedToHandler} className="space-y-4">
                <div className="flex flex-row justify-center items-center">
                  <label
                    htmlFor="role"
                    className="text-sm font-medium text-gray-600 mb-1 w-[30%]"
                  >
                    Select<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newIncidentAssignedTo?.role || ""}
                    onChange={newIncidentsAssignedToChangeHandler}
                    required
                    placeholder="Select Technicians"
                    className="w-[70%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all cursor-pointer"
                  >
                    <option value=""></option>
                    <option value="L1 Technician">L1 Technician</option>
                    <option value="L2 Technician">L2 Technician</option>
                    <option value="L3 Technician">L3 Technician</option>
                  </select>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <label
                    htmlFor="componentName"
                    className="text-sm font-medium text-gray-600 mb-1 w-[30%]"
                  >
                    Select<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="technician"
                    value={newIncidentAssignedTo.technician}
                    onChange={newIncidentsAssignedToChangeHandler}
                    required
                    placeholder="Select Technicians"
                    className="w-[70%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all cursor-pointer"
                  >
                    <option value=""></option>
                    {filteredTechnicians.map((tech, idx) => (
                      <option key={tech._id || tech.emailAddress || idx}>
                        {tech.emailAddress}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                  <button
                    type="button"
                    onClick={() => setNewAssignedModal(false)}
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
};

export default NewIncidentsAssigned;
