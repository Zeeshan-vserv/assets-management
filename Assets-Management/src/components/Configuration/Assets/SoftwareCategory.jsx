// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { Box, Button, IconButton } from "@mui/material";
// import { MdModeEdit } from "react-icons/md";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { AiOutlineFileExcel } from "react-icons/ai";
// import { AiOutlineFilePdf } from "react-icons/ai";
// import { mkConfig, generateCsv, download } from "export-to-csv";
// import { jsPDF } from "jspdf";
// import { autoTable } from "jspdf-autotable";
// import { TextField } from "@mui/material";
// import {
//   createSoftwareCategory,
//   deleteSoftwareCategory,
//   getAllSoftware,
//   getAllSoftwareCategory,
//   updateSoftwareCategory,
// } from "../../../api/SoftwareCategoryRequest";
// import { toast } from "react-toastify";

// const csvConfig = mkConfig({
//   fieldSeparator: ",",
//   decimalSeparator: ".",
//   useKeysAsHeaders: true,
//   filename: "Assets-Management-Department.csv",
// });

// function SoftwareCategory() {
//   const [data, setData] = useState([]);
//   const [softwareData, setSoftwareData] = useState([]);
//   const [SelectedSoftwareId, setSelectedSoftwareId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const [addSoftwareCategoryModal, setAddSoftwareCategoryModal] =
//     useState(false);
//   const [addNewSoftwareCategory, setAddNewSoftwareCategory] = useState({
//     softwareCategoryName: "",
//   });

//   const [editSoftwareCategory, setEditSoftwareCategory] = useState(null);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);

//   const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
//   const [deleteSoftwareCategoryId, setDeleteSoftwareCategoryId] =
//     useState(null);
//   const [deleteSoftwareId, setDeleteSoftwareId] = useState(null);

//   const fetchSoftwareCategory = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getAllSoftwareCategory();
//       setData(response?.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching software category:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSoftwareCategory();
//   }, []);

//   const fetchgetAllSoftware = async () => {
//     try {
//       setIsLoading(true);
//       const getAllSoftwareResponse = await getAllSoftware();
//       setSoftwareData(getAllSoftwareResponse?.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching software Name:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchgetAllSoftware();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "softwareCategoryId",
//         header: "Software Category Id",
//       },
//       {
//         accessorKey: "softwareCategoryName",
//         header: "Software Category Name",
//       },
//       {
//         id: "edit",
//         header: "Edit",
//         size: 80,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() => handleUpdateSoftwareCategory(row.original._id)}
//             color="primary"
//             aria-label="edit"
//           >
//             <MdModeEdit />
//           </IconButton>
//         ),
//       },
//       {
//         id: "delete",
//         header: "Delete",
//         size: 80,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() =>
//               handleDeleteSoftwareCategory(row.original._id, softwareData)
//             }
//             color="error"
//             aria-label="delete"
//           >
//             <DeleteIcon />
//           </IconButton>
//         ),
//       },
//     ],
//     [isLoading]
//   );

//   //Add
//   const openAddSoftwareCategoryModal = (softwareId) => {
//     setSelectedSoftwareId(softwareId);
//     setAddSoftwareCategoryModal(true);
//   };

//   const addNewSoftwareCategoryChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setAddNewSoftwareCategory((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const addNewSoftwareCategoryHandler = async (e) => {
//     e.preventDefault();
//     const formData = {
//       softwareCategoryName: addNewSoftwareCategory?.softwareCategoryName,
//     };
//     const createSoftwareCategoryResponse = await createSoftwareCategory(
//       SelectedSoftwareId,
//       formData
//     );
//     console.log();
//     if (createSoftwareCategoryResponse?.data.success) {
//       toast.success("Software Category created successfullly");
//       await fetchSoftwareCategory();
//       await fetchgetAllSoftware();
//     }
//     setAddSoftwareCategoryModal(false);
//   };

//   //Update
//   const handleUpdateSoftwareCategory = (id) => {
//     const softwareCategoryToEdit = data?.find((d) => d._id === id);
//     if (softwareCategoryToEdit) {
//       setEditSoftwareCategory({
//         _id: softwareCategoryToEdit?._id,
//         softwareCategoryName: softwareCategoryToEdit.softwareCategoryName,
//       });
//       setOpenUpdateModal(true);
//     }
//   };

//   const updateSoftwareCategoryChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setEditSoftwareCategory((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const updateSoftwareCategoryHandler = async (e) => {
//     e.preventDefault();
//     if (!editSoftwareCategory?._id) return;
//     try {
//       const updatedData = {
//         softwareCategoryName: editSoftwareCategory?.softwareCategoryName,
//       };
//       const updateSoftwareCategoryResponse = await updateSoftwareCategory(
//         editSoftwareCategory?._id,
//         updatedData
//       );
//       if (updateSoftwareCategoryResponse?.data.success) {
//         toast.success("Software category updated successfully");
//         await fetchSoftwareCategory();
//         await fetchgetAllSoftware();
//       }
//       setEditSoftwareCategory(null);
//     } catch (error) {
//       console.error("Error updating software category:", error);
//     } finally {
//       setOpenUpdateModal(false);
//     }
//   };

//   //Delete
//   const handleDeleteSoftwareCategory = (softwareCategoryId, softwareDatas) => {
//     const softwareWithPublisher = softwareDatas.find((software) =>
//       software.softwareCategory.some((pub) => pub._id === softwareCategoryId)
//     );
//     if (softwareWithPublisher) {
//       setDeleteSoftwareId(softwareWithPublisher?._id);
//       setDeleteSoftwareCategoryId(softwareCategoryId);
//       setDeleteConfirmationModal(true);
//     }
//   };

//   const deleteSoftwareCategoryHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const deleteSoftwareCategoryResponse = await deleteSoftwareCategory(
//         deleteSoftwareId,
//         deleteSoftwareCategoryId
//       );
//       if (deleteSoftwareCategoryResponse?.data.success) {
//         toast.success("Software category deleted successfully");
//         await fetchSoftwareCategory();
//         await fetchgetAllSoftware();
//       }
//     } catch (error) {
//       console.error("Error deleting software category:", error);
//     }
//     setDeleteConfirmationModal(false);
//     setDeleteSoftwareCategoryId(null);
//     setDeleteSoftwareCategoryId(null);
//   };

//   //Exports
//   const handleExportRows = (rows) => {
//     const visibleColumns = table
//       .getAllLeafColumns()
//       .filter(
//         (col) =>
//           col.getIsVisible() &&
//           col.id !== "mrt-row-select" &&
//           col.id !== "edit" &&
//           col.id !== "delete"
//       );

//     const rowData = rows.map((row) => {
//       const result = {};
//       visibleColumns.forEach((col) => {
//         const key = col.id || col.accessorKey;
//         result[key] = row.original[key];
//       });
//       return result;
//     });

//     const csv = generateCsv(csvConfig)(rowData);
//     download(csvConfig)(csv);
//   };
//   const handleExportData = () => {
//     const visibleColumns = table
//       .getAllLeafColumns()
//       .filter(
//         (col) =>
//           col.getIsVisible() &&
//           col.id !== "mrt-row-select" &&
//           col.id !== "edit" &&
//           col.id !== "delete"
//       );

//     const exportData = data.map((item) => {
//       const result = {};
//       visibleColumns.forEach((col) => {
//         const key = col.id || col.accessorKey;
//         result[key] = item[key];
//       });
//       return result;
//     });

//     const csv = generateCsv(csvConfig)(exportData);
//     download(csvConfig)(csv);
//   };
//   const handlePdfData = () => {
//     const excludedColumns = ["mrt-row-select", "edit", "delete"];

//     const visibleColumns = table
//       .getAllLeafColumns()
//       .filter((col) => col.getIsVisible() && !excludedColumns.includes(col.id));

//     // Prepare headers for PDF
//     const headers = visibleColumns.map((col) => col.columnDef.header || col.id);

//     // Prepare data rows for PDF
//     const exportData = data.map((item) =>
//       visibleColumns.map((col) => {
//         const key = col.id || col.accessorKey;
//         let value = item[key];
//         return value ?? "";
//       })
//     );

//     const doc = new jsPDF({});
//     autoTable(doc, {
//       head: [headers],
//       body: exportData,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [66, 139, 202] },
//       margin: { top: 20 },
//     });
//     doc.save("Assets-Management-Components.pdf");
//   };

//   const table = useMaterialReactTable({
//     data,
//     columns,
//     getRowId: (row) => row?._id?.toString(),
//     enableRowSelection: true,
//     initialState: {
//       density: "compact",
//       pagination: { pageSize: 5 },
//     },
//     renderTopToolbarCustomActions: ({ table }) => {
//       return (
//         <Box>
//           {softwareData.map((software) => (
//             <Button
//               key={software?._id}
//               onClick={() => openAddSoftwareCategoryModal(software?._id)}
//               variant="contained"
//               size="small"
//               startIcon={<AddCircleOutlineIcon />}
//               sx={{
//                 backgroundColor: "#2563eb",
//                 color: "#fff",
//                 textTransform: "none",
//                 mt: 1,
//                 mb: 1,
//               }}
//             >
//               New
//             </Button>
//           ))}
//           <Button
//             onClick={handlePdfData}
//             startIcon={<AiOutlineFilePdf />}
//             size="small"
//             variant="outlined"
//             sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
//           >
//             Export as PDF
//           </Button>
//           <Button
//             onClick={handleExportData}
//             startIcon={<AiOutlineFileExcel />}
//             size="small"
//             variant="outlined"
//             sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
//           >
//             Export All Data
//           </Button>
//           <Button
//             disabled={table.getPrePaginationRowModel().rows.length === 0}
//             onClick={() =>
//               handleExportRows(table.getPrePaginationRowModel().rows)
//             }
//             startIcon={<AiOutlineFileExcel />}
//             size="small"
//             variant="outlined"
//             sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
//           >
//             Export All Rows
//           </Button>
//           <Button
//             disabled={table.getRowModel().rows.length === 0}
//             onClick={() => handleExportRows(table.getRowModel().rows)}
//             startIcon={<AiOutlineFileExcel />}
//             size="small"
//             variant="outlined"
//             sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
//           >
//             Export Page Rows
//           </Button>
//           <Button
//             disabled={
//               !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
//             }
//             onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
//             startIcon={<AiOutlineFileExcel />}
//             size="small"
//             variant="outlined"
//             sx={{ textTransform: "none", ml: 2, mt: 1, mb: 1 }}
//           >
//             Export Selected Rows
//           </Button>
//         </Box>
//       );
//     },

//     muiTableProps: {
//       sx: {
//         border: "1px solid rgba(81, 81, 81, .5)",
//         caption: {
//           captionSide: "top",
//         },
//       },
//     },

//     paginationDisplayMode: "pages",
//     positionToolbarAlertBanner: "bottom",
//     muiPaginationProps: {
//       color: "secondary",
//       rowsPerPageOptions: [10, 15, 20],
//       shape: "rounded",
//       variant: "outlined",
//     },
//     enablePagination: true,

//     muiTableHeadCellProps: {
//       sx: {
//         backgroundColor: "#f1f5fa",
//         color: "#303E67",
//         fontSize: "14px",
//         fontWeight: "500",
//       },
//     },
//     muiTableBodyRowProps: ({ row }) => ({
//       sx: {
//         backgroundColor: row.index % 2 === 1 ? "#f1f5fa" : "inherit",
//       },
//     }),
//   });

//   return (
//     <>
//       <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
//         <h2 className="text-lg font-semibold mb-6 text-start">
//           SOFTWARE CATEGORY
//         </h2>
//         <MaterialReactTable table={table} />
//         {addSoftwareCategoryModal && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//               <h2 className="text-md font-semibold mb-6 text-start">
//                 Add Software Category
//               </h2>
//               <form
//                 onSubmit={addNewSoftwareCategoryHandler}
//                 className="space-y-4"
//               >
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2">
//                     <label className="w-40 text-sm font-medium text-gray-500">
//                       Software Category
//                     </label>
//                     <TextField
//                       name="softwareCategoryName"
//                       required
//                       fullWidth
//                       value={addNewSoftwareCategory?.softwareCategoryName || ""}
//                       onChange={addNewSoftwareCategoryChangeHandler}
//                       variant="standard"
//                       sx={{ width: 250 }}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setAddSoftwareCategoryModal(false)}
//                     className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {openUpdateModal && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//               <h2 className="text-md font-semibold mb-6 text-start">
//                 Edit Software Category
//               </h2>
//               <form
//                 onSubmit={updateSoftwareCategoryHandler}
//                 className="space-y-4"
//               >
//                 <div className="flex items-center gap-2">
//                   <label className="w-40 text-sm font-medium text-gray-500">
//                     Software Category
//                   </label>
//                   <TextField
//                     name="softwareCategoryName"
//                     required
//                     fullWidth
//                     value={editSoftwareCategory?.softwareCategoryName || ""}
//                     onChange={updateSoftwareCategoryChangeHandler}
//                     placeholder="Enter Software Category Name"
//                     variant="standard"
//                     sx={{ width: 250 }}
//                   />
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setOpenUpdateModal(false)}
//                     className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
//                   >
//                     Update
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {deleteConfirmationModal && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
//               <h2 className="text-xl font-semibold text-red-600 mb-3">
//                 Are you sure?
//               </h2>
//               <p className="text-gray-700 mb-6">
//                 This action will permanently delete the department.
//               </p>
//               <form
//                 onSubmit={deleteSoftwareCategoryHandler}
//                 className="flex justify-end gap-3"
//               >
//                 <button
//                   type="button"
//                   onClick={() => setDeleteConfirmationModal(false)}
//                   className="shadow-md px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-500 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                 >
//                   Delete
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default SoftwareCategory;

import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { MdModeEdit } from "react-icons/md";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AiOutlineFileExcel } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  createSoftwareCategory,
  deleteSoftwareCategory,
  getAllSoftwareCategory,
  updateSoftwareCategory,
} from "../../../api/SoftwareCategoryRequest";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SoftwareCategory.csv",
});

function SoftwareCategory() {
  const user = useSelector((state) => state.authReducer.authData);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addSoftwareCategoryModal, setAddSoftwareCategoryModal] = useState(false);
  const [addNewSoftwareCategory, setAddNewSoftwareCategory] = useState({
    softwareCategoryName: "",
  });

  const [editSoftwareCategory, setEditSoftwareCategory] = useState(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteSoftwareCategoryId, setDeleteSoftwareCategoryId] = useState(null);

  // Fetch all software categories
  const fetchSoftwareCategory = async () => {
    try {
      setIsLoading(true);
      const response = await getAllSoftwareCategory();
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching software category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftwareCategory();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "softwareCategoryId",
        header: "Software Category Id",
      },
      {
        accessorKey: "softwareCategoryName",
        header: "Software Category Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleUpdateSoftwareCategory(row.original._id)}
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
            onClick={() => handleDeleteSoftwareCategory(row.original._id)}
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
  const openAddSoftwareCategoryModal = () => {
    setAddSoftwareCategoryModal(true);
  };

  const addNewSoftwareCategoryChangeHandler = (e) => {
    const { name, value } = e.target;
    setAddNewSoftwareCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSoftwareCategoryHandler = async (e) => {
    e.preventDefault();
    const formData = {
      softwareCategoryName: addNewSoftwareCategory?.softwareCategoryName,
      userId: user?.userId, // If your backend expects userId
    };
    const createSoftwareCategoryResponse = await createSoftwareCategory(formData);
    if (createSoftwareCategoryResponse?.data.success) {
      toast.success("Software Category created successfully");
      await fetchSoftwareCategory();
    }
    setAddSoftwareCategoryModal(false);
    setAddNewSoftwareCategory({ softwareCategoryName: "" });
  };

  // Update
  const handleUpdateSoftwareCategory = (id) => {
    const softwareCategoryToEdit = data?.find((d) => d._id === id);
    if (softwareCategoryToEdit) {
      setEditSoftwareCategory({
        _id: softwareCategoryToEdit?._id,
        softwareCategoryName: softwareCategoryToEdit.softwareCategoryName,
      });
      setOpenUpdateModal(true);
    }
  };

  const updateSoftwareCategoryChangeHandler = (e) => {
    const { name, value } = e.target;
    setEditSoftwareCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateSoftwareCategoryHandler = async (e) => {
    e.preventDefault();
    if (!editSoftwareCategory?._id) return;
    try {
      const updatedData = {
        softwareCategoryName: editSoftwareCategory?.softwareCategoryName,
      };
      const updateSoftwareCategoryResponse = await updateSoftwareCategory(
        editSoftwareCategory?._id,
        updatedData
      );
      if (updateSoftwareCategoryResponse?.data.success) {
        toast.success("Software category updated successfully");
        await fetchSoftwareCategory();
      }
      setEditSoftwareCategory(null);
    } catch (error) {
      console.error("Error updating software category:", error);
    } finally {
      setOpenUpdateModal(false);
    }
  };

  // Delete
  const handleDeleteSoftwareCategory = (softwareCategoryId) => {
    setDeleteSoftwareCategoryId(softwareCategoryId);
    setDeleteConfirmationModal(true);
  };

  const deleteSoftwareCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const deleteSoftwareCategoryResponse = await deleteSoftwareCategory(
        deleteSoftwareCategoryId
      );
      if (deleteSoftwareCategoryResponse?.data.success) {
        toast.success("Software category deleted successfully");
        await fetchSoftwareCategory();
      }
    } catch (error) {
      console.error("Error deleting software category:", error);
    }
    setDeleteConfirmationModal(false);
    setDeleteSoftwareCategoryId(null);
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
          onClick={openAddSoftwareCategoryModal}
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
    doc.save("Assets-Management-SoftwareCategory.pdf");
  }

  return (
    <>
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          SOFTWARE CATEGORY
        </h2>
        <MaterialReactTable table={table} />
        {/* Add Modal */}
        {addSoftwareCategoryModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Add Software Category
              </h2>
              <form
                onSubmit={addNewSoftwareCategoryHandler}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm font-medium text-gray-500">
                      Software Category
                    </label>
                    <TextField
                      name="softwareCategoryName"
                      required
                      fullWidth
                      value={addNewSoftwareCategory?.softwareCategoryName || ""}
                      onChange={addNewSoftwareCategoryChangeHandler}
                      variant="standard"
                      sx={{ width: 250 }}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setAddSoftwareCategoryModal(false)}
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

        {/* Edit Modal */}
        {openUpdateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
              <h2 className="text-md font-semibold mb-6 text-start">
                Edit Software Category
              </h2>
              <form
                onSubmit={updateSoftwareCategoryHandler}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Software Category
                  </label>
                  <TextField
                    name="softwareCategoryName"
                    required
                    fullWidth
                    value={editSoftwareCategory?.softwareCategoryName || ""}
                    onChange={updateSoftwareCategoryChangeHandler}
                    placeholder="Enter Software Category Name"
                    variant="standard"
                    sx={{ width: 250 }}
                  />
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
        )}

        {/* Delete Modal */}
        {deleteConfirmationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-md:max-w-sm max-sm:max-w-xs p-8">
              <h2 className="text-xl font-semibold text-red-600 mb-3">
                Are you sure?
              </h2>
              <p className="text-gray-700 mb-6">
                This action will permanently delete the software category.
              </p>
              <form
                onSubmit={deleteSoftwareCategoryHandler}
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

export default SoftwareCategory;