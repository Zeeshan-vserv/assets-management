import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { TextField } from "@mui/material";
import { getAllAssets } from "../../../../api/AssetsRequest"; //later chnage
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-Insurance.csv",
});

function Insurances({ id }) {
  // const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addInsuranceModal, setAddInsuranceModal] = useState(false);
  const [addNewInsurance, setAddNewInsurance] = useState({
    vendorName: "",
    coverageAmount: "",
    premium: "",
    startDate: "",
    endDate: "",
  });

  const fetchInsurance = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching insurance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurance();
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
        header: "Vendor Name",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Coverage Amount",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Premium",
      },
      {
        accessorKey: "mappingStatus",
        header: "Start Date",
      },
      {
        accessorKey: "ackStatus",
        header: "End Date",
      },
    ],
    [isLoading]
  );

  //Add
  const addNewInsuranceChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewInsurance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewInsuranceHandler = async (e) => {
    e.preventDefault();
    try {
      //call api
      // console.log("addNewInsurance", addNewInsurance);
      fetchInsurance();
    } catch (error) {
      console.error("Error adding new insurance:", error);
    }
    setAddInsuranceModal(false);
  };

  //Exports
  const handleExportRows = (rows) => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter((col) => col.getIsVisible() && col.id !== "mrt-row-select");

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
      .filter((col) => col.getIsVisible() && col.id !== "mrt-row-select");

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
    const excludedColumns = ["mrt-row-select"];

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
    doc.save("Assets-Management-Insurance.pdf");
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
            onClick={() => setAddInsuranceModal(true)}
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
        {addInsuranceModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                ADD INSURANCE DETAILS
              </h2>
              <form onSubmit={addNewInsuranceHandler} className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Vendor Name
                    </label>
                    <TextField
                      name="vendorName"
                      required
                      fullWidth
                      value={addNewInsurance?.vendorName || ""}
                      onChange={addNewInsuranceChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Coverage Amount
                    </label>
                    <TextField
                      name="coverageAmount"
                      required
                      fullWidth
                      value={addNewInsurance?.coverageAmount || ""}
                      onChange={addNewInsuranceChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Coverage Amount
                    </label>
                    <TextField
                      name="premium"
                      required
                      fullWidth
                      value={addNewInsurance?.premium || ""}
                      onChange={addNewInsuranceChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Start Date
                    </label>
                    <TextField
                      name="startDate"
                      type="date"
                      required
                      fullWidth
                      value={addNewInsurance?.startDate || ""}
                      onChange={addNewInsuranceChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      End Date
                    </label>
                    <TextField
                      type="date"
                      name="endDate"
                      required
                      fullWidth
                      value={addNewInsurance?.endDate || ""}
                      onChange={addNewInsuranceChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddInsuranceModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Save
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

export default Insurances;
