import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Autocomplete, Box, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextField } from "@mui/material";
import {
  createSLAMapping,
  deleteSLAMapping,
  getAllSLAMappings,
  getAllSLAs,
} from "../../../api/slaRequest";
import { getAllSubDepartment } from "../../../api/DepartmentRequest";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllSupportDepartment } from "../../../api/SuportDepartmentRequest";

function SlaMapping() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addSlaMappingModal, setAddSlaMappingModal] = useState(false);
  const [addNewSlaMapping, setAddNewSlaMapping] = useState({
    supportDepartment: "",
    slaName: "",
  });
  const [getSlaName, setGetSlaName] = useState([]);
  const [supportDepartment, setSupportDepartment] = useState([]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSlaMappingId, setDeleteSlaMappingId] = useState(null);

  const fetchSlaMapping = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAMappings();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching Sla Mapping:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaMapping();
  }, []);

  const fetchSlaName = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSLAs();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setGetSlaName(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching Sla Mapping:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaName();
  }, []);

  const fetchSupportDepartment = async () => {
    try {
      setIsLoading(true);
      // const response = await getAllSubDepartment();
      const response = await getAllSupportDepartment();
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setSupportDepartment(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching support department:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportDepartment();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "supportDepartment",
        header: "Support Department",
      },
      {
        accessorKey: "slaName",
        header: "SLA Name",
      },
      {
        id: "delete",
        header: "Delete",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleDeleteSlaMapping(row.original._id)}
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
  const addNewSlaMappingChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSlaMapping((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSlaMappingHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId: user.userId,
        supportDepartment: addNewSlaMapping?.supportDepartment,
        slaName: addNewSlaMapping?.slaName,
      };
      const response = await createSLAMapping(formData);
      if (response?.data.success) {
        toast.success("SLA Mapping created successfully");
        await fetchSlaMapping();
      }
      setAddSlaMappingModal(false);
      setAddNewSlaMapping({
        supportDepartment: "",
        slaName: "",
      });
    } catch (error) {
      console.log("Error creating sla mapping ", error);
    }
  };

  //delete
  const handleDeleteSlaMapping = (id) => {
    setDeleteSlaMappingId(id);
    setDeleteConfirmationModal(true);
  };

  const deleteSlaMappingHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteSLAMapping(deleteSlaMappingId);
      if (response?.data.success) {
        toast.success("SLA Mapping deleted successfully");
        await fetchSlaMapping();
      }
    } catch (error) {
      console.error("Error deleting condition:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteSlaMappingId(null);
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
            onClick={() => setAddSlaMappingModal(true)}
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
          SERVICE LEVEL AGREEMENT
        </h2>
        <MaterialReactTable table={table} />
        {addSlaMappingModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Create SLA Mapping
              </h2>
              <form onSubmit={addNewSlaMappingHandler} className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Support Orgnization
                    </label>
                    {console.log(supportDepartment)}
                    {/* <Autocomplete
                      className="w-[65%]"
                      options={supportDepartment}
                      value={
                        supportDepartment.find(
                          (dept) =>
                            dept.supportDepartmentName ===
                            addNewSlaMapping.supportDepartment
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        setAddNewSlaMapping((prev) => ({
                          ...prev,
                          supportDepartment: newValue
                            ? newValue.subdepartmentName
                            : "",
                        }))
                      }
                      getOptionLabel={(option) =>
                        option.subdepartmentName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.subdepartmentName === value.subdepartmentName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          className="text-xs text-slate-600"
                          placeholder="Select Support Department"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    /> */}
                    <Autocomplete
                      className="w-[65%]"
                      options={supportDepartment}
                      value={
                        supportDepartment.find(
                          (dept) =>
                            dept.supportDepartmentName ===
                            addNewSlaMapping.supportDepartment
                        ) || null
                      }
                      onChange={(_, newValue) =>
                        setAddNewSlaMapping((prev) => ({
                          ...prev,
                          supportDepartment: newValue
                            ? newValue.supportDepartmentName
                            : "",
                        }))
                      }
                      getOptionLabel={(option) =>
                        option.supportDepartmentName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.supportDepartmentName ===
                        value.supportDepartmentName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          className="text-xs text-slate-600"
                          placeholder="Select Support Department"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      SLA Name
                    </label>
                    <Autocomplete
                      className="w-[65%]"
                      options={getSlaName}
                      value={
                        getSlaName.find(
                          (sla) => sla.slaName === addNewSlaMapping?.slaName
                        ) || null
                      }
                      getOptionLabel={(option) => option.slaName || ""}
                      onChange={(_, newValue) =>
                        setAddNewSlaMapping((prev) => ({
                          ...prev,
                          slaName: newValue ? newValue.slaName : "",
                        }))
                      }
                      required
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          className="text-xs text-slate-600"
                          placeholder="Select SLA"
                          inputProps={{
                            ...params.inputProps,
                            style: { fontSize: "0.8rem" },
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddSlaMappingModal(false)}
                    className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                  >
                    Submit
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
                onSubmit={deleteSlaMappingHandler}
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

export default SlaMapping;
