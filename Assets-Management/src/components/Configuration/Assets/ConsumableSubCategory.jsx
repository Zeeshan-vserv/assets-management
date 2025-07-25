// import React, { useEffect, useMemo, useState } from "react";
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
// } from "material-react-table";
// import { Autocomplete, Box, Button, IconButton } from "@mui/material";
// import { MdModeEdit } from "react-icons/md";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import { AiOutlineFileExcel } from "react-icons/ai";
// import { AiOutlineFilePdf } from "react-icons/ai";
// import { mkConfig, generateCsv, download } from "export-to-csv";
// import { jsPDF } from "jspdf";
// import { autoTable } from "jspdf-autotable";
// import { TextField } from "@mui/material";
// // import { getAllDepartment } from "../../../api/DepartmentRequest"; //later chnage it
// import {
//   getAllConsumables,
//   getAllSubConsumables,
//   addSubConsumable,
//   updateSubConsumable,
//   deleteSubConsumable,
// } from "../../../api/ConsumableRequest";

// const csvConfig = mkConfig({
//   fieldSeparator: ",",
//   decimalSeparator: ".",
//   useKeysAsHeaders: true,
//   filename: "Assets-Management-SubCategory.csv",
// });

// function ConsumableSubCategory() {
//   // const [data, setData] = useState([]);
//   // const [isLoading, setIsLoading] = useState(true);
//   // const [addNewConsumableSubCategory, setAddNewConsumableSubCategory] =
//   // useState({
//   //   consumableCategory: "",
//   //   consumableSubCategory: "",
//   // });
//   // const [editConsumableSubCategory, setEditConsumableSubCategory] =
//   // useState(null);
//   // const [addCosumableSubCategoryModal, setAddConsumableSubCategoryModal] =
//   //   useState(false);
//   // const [openUpdateModal, setOpenUpdateModal] = useState(false);

//   // const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
//   // const [deleteConsumableSubCategoryId, setDeleteConsumableSubCategoryId] =
//   //   useState(null);

//      const [data, setData] = useState([]);
//      const [isLoading, setIsLoading] = useState(true);
//       const [rawSubCategory, setRawSubCategory] = useState([]); // for mapping
//       const [addCosumableSubCategoryModal, setAddConsumableSubCategoryModal] = useState(false);
//       const [addNewConsumableSubCategory, setAddNewConsumableSubCategory] = useState({
//         subLocationName: "",
//         locationId: "",
//       });
//       const [consumable, setConsumable] = useState([]);
//       const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
//       const [deleteConsumableSubCategoryId, setDeleteConsumableSubCategoryId] = useState(null);
//       const [openUpdateModal, setOpenUpdateModal] = useState(false);
//       const [editConsumableSubCategory, setEditConsumableSubCategory] = useState(null);

//   const fetchConsumableSubCategory = async () => {
//     // try {
//     //   setIsLoading(true);
//     //   const response = await getAllDepartment(); //later chnage it
//     //   setData(response?.data?.data || []);
//     // }
//       try {
//         setIsLoading(true);
//         const response = await getAllConsumables();
//         console.log(response?.data?.data || []);
//         setConsumable(response?.data?.data || []);
//         const allSubCategories = response?.data?.data?.reduce(
//           (acc, data) => {
//             if (data.subConsumables && data.subConsumables.length > 0) {
//               return [
//                 ...acc,
//                 ...data.subConsumables.map((sub) => ({
//                   ...sub,
//                   locationName: data.locationName,
//                   locationId: data._id,
//                 })),
//               ];
//             }
//             console.log(acc);
//             return acc;
//           },

//           []
//         );
//         setData(allSubCategories || []);
//       }
//     catch (error) {
//       console.error("Error fetching condition:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     const fetchSubLocations = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getAllLocation();
//         setLocations(response?.data?.data || []);
//         const allSubLocations = response?.data?.data?.reduce(
//           (acc, location) => {
//             if (location.subLocations && location.subLocations.length > 0) {
//               return [
//                 ...acc,
//                 ...location.subLocations.map((sub) => ({
//                   ...sub,
//                   locationName: location.locationName,
//                   locationId: location._id,
//                 })),
//               ];
//             }
//             console.log(acc);
//             return acc;
//           },

//           []
//         );
//         setData(allSubLocations || []);
//       } catch (error) {
//         console.error("Error fetching locations:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//   useEffect(() => {
//     fetchConsumableSubCategory();
//   }, []);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "departmentId",
//         header: "Id",
//       },
//       {
//         accessorKey: "departmentName",
//         header: "Consumable Category",
//       },
//       {
//         accessorKey: "departmentHead",
//         header: "Sub Category",
//       },
//       {
//         id: "edit",
//         header: "Edit",
//         size: 80,
//         enableSorting: false,
//         Cell: ({ row }) => (
//           <IconButton
//             onClick={() => handleUpdateConsumableSubCategory(row.original._id)}
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
//             onClick={() => handleDeleteConsumableSubCategory(row.original._id)}
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
//   const addNewConsumableSubCategoryChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setAddNewConsumableSubCategory((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const addNewConsumableSubCategoryHandler = async (e) => {
//     e.preventDefault();
//     // console.log("addNewConsumableSubCategory", addNewConsumableSubCategory);
//     //call api
//     setAddConsumableSubCategoryModal(false);
//   };

//   //update
//   const handleUpdateConsumableSubCategory = (id) => {
//     const consumableSubCategoryToEdit = data?.find((d) => d._id === id);
//     if (consumableSubCategoryToEdit) {
//       setEditConsumableSubCategory({
//         cosumableCategory: consumableSubCategoryToEdit.cosumableCategory,
//         consumableSubCategory:
//           consumableSubCategoryToEdit.consumableSubCategory,
//       });
//       setOpenUpdateModal(true);
//     }
//   };

//   const updateConsumableSubCategoryChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setEditConsumableSubCategory((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const updateConsumableSubCategoryHandler = async (e) => {
//     e.preventDefault();
//     if (!editConsumableSubCategory?._id) return;
//     try {
//       // console.log("editConsumableSubCategory", editConsumableSubCategory);
//       //call api
//       setEditConsumableSubCategory(null);
//     } catch (error) {
//       console.error("Error updating consumable sub category:", error);
//     }
//   };

//   //delete
//   const handleDeleteConsumableSubCategory = (id) => {
//     setDeleteConsumableSubCategoryId(id);
//     setDeleteConfirmationModal(true);
//   };
//   const deleteConsumableSubCategoryHandler = async (e) => {
//     e.preventDefault();
//     try {
//       // console.log(
//       //   "deleteConsumableSubCategoryId",
//       //   deleteConsumableSubCategoryId
//       // );
//       //call api
//     } catch (error) {
//       console.error("Error deleting consumable sub category:", error);
//     }
//     setDeleteConfirmationModal(false);
//     setDeleteConsumableSubCategoryId(null);
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
//           <Button
//             onClick={() => setAddConsumableSubCategoryModal(true)}
//             variant="contained"
//             size="small"
//             startIcon={<AddCircleOutlineIcon />}
//             sx={{
//               backgroundColor: "#2563eb",
//               color: "#fff",
//               textTransform: "none",
//               mt: 1,
//               mb: 1,
//             }}
//           >
//             New
//           </Button>
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
//           CONSUMABLE SUB CATEGORY
//         </h2>
//         <MaterialReactTable table={table} />
//         {addCosumableSubCategoryModal && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//               <h2 className="text-md font-semibold mb-6 text-start">
//                 ADD CONSUMABLE SUB CATEGORY
//               </h2>
//               <form
//                 onSubmit={addNewConsumableSubCategoryHandler}
//                 className="space-y-2"
//               >
//                 <div className="flex items-center gap-2 mt-1">
//                   <label className="w-40 text-sm font-medium text-gray-500">
//                     Consumable Category
//                   </label>
//                   <Autocomplete
//                     sx={{ width: 250 }}
//                     options={["Adobe", "Google", "Microsoft"]}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Select"
//                         variant="standard"
//                         required
//                       />
//                     )}
//                     value={
//                       addNewConsumableSubCategory.consumableCategory || null
//                     }
//                     onChange={(event, value) =>
//                       setAddNewConsumableSubCategory((prev) => ({
//                         ...prev,
//                         consumableCategory: value,
//                       }))
//                     }
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-2">
//                     <label className="w-40 text-sm font-medium text-gray-500">
//                       Sub Category *
//                     </label>
//                     <TextField
//                       name="consumableSubCategory"
//                       required
//                       fullWidth
//                       value={
//                         addNewConsumableSubCategory?.consumableSubCategory || ""
//                       }
//                       onChange={addNewConsumableSubCategoryChangeHandler}
//                       variant="standard"
//                       sx={{ width: 250 }}
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setAddConsumableSubCategoryModal(false)}
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
//           <>
//             <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
//               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
//                 <h2 className="text-md font-semibold mb-6 text-start">
//                   Edit Consumable Category
//                 </h2>
//                 <form
//                   onSubmit={updateConsumableSubCategoryHandler}
//                   className="space-y-2"
//                 >
//                   <div className="flex items-center gap-2 mt-1">
//                     <label className="w-40 text-sm font-medium text-gray-500">
//                       Consumable Category
//                     </label>
//                     <Autocomplete
//                       sx={{ width: 250 }}
//                       options={["Router", "Camera", "Wireless Mouse"]}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           label="Select"
//                           variant="standard"
//                           required
//                         />
//                       )}
//                       value={
//                         editConsumableSubCategory.consumableCategory || null
//                       }
//                       onChange={(event, value) =>
//                         setEditConsumableSubCategory((prev) => ({
//                           ...prev,
//                           consumableCategory: value,
//                         }))
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex items-center gap-2">
//                       <label className="w-40 text-sm font-medium text-gray-500">
//                         Consumable Category*
//                       </label>
//                       <TextField
//                         name="ConsumableSubCategory"
//                         required
//                         fullWidth
//                         value={
//                           editConsumableSubCategory?.ConsumableSubCategory || ""
//                         }
//                         onChange={updateConsumableSubCategoryChangeHandler}
//                         variant="standard"
//                         sx={{ width: 250 }}
//                       />
//                     </div>
//                   </div>
//                   <div className="flex justify-end gap-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => setOpenUpdateModal(false)}
//                       className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
//                     >
//                       Update
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </>
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
//                 onSubmit={deleteConsumableSubCategoryHandler}
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

// export default ConsumableSubCategory;

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
  getAllConsumables,
  getAllSubConsumables,
  addSubConsumable,
  updateSubConsumable,
  deleteSubConsumable,
} from "../../../api/ConsumableRequest";
import { toast } from "react-toastify";
import ConfirmUpdateModal from "../../ConfirmUpdateModal";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
  filename: "Assets-Management-SubCategory.csv",
});

function ConsumableSubCategory() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    subConsumableName: "",
    consumableId: "",
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: "",
    subConsumableName: "",
    consumableId: "",
  });

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch all subcategories and categories
  const fetchAll = async () => {
    try {
      setIsLoading(true);
      const [subRes, catRes] = await Promise.all([
        getAllSubConsumables(),
        getAllConsumables(),
      ]);
      // Attach parent category info to each subcategory for display
      const categoriesArr = catRes?.data?.data || [];
      setCategories(categoriesArr);
      const subData = (subRes?.data?.data || []).map((sub) => {
        const parent = categoriesArr.find(
          (cat) =>
            cat.subConsumables &&
            cat.subConsumables.some((s) => s._id === sub._id)
        );
        return {
          ...sub,
          consumableName: parent ? parent.consumableName : "",
          consumableId: parent ? parent._id : "",
        };
      });
      setData(subData);
    } catch (error) {
      toast.error("Error fetching subcategories or categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "subConsumableId",
        header: "Sub Consumable Id",
      },
      {
        accessorKey: "consumableName",
        header: "Consumable Category",
      },
      {
        accessorKey: "subConsumableName",
        header: "Sub Consumable Name",
      },
      {
        id: "edit",
        header: "Edit",
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <IconButton
            onClick={() => handleEdit(row.original)}
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
            onClick={() => handleDelete(row.original)}
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

  // Add handlers
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategoryChange = (_, value) => {
    const selected = categories.find((cat) => cat.consumableName === value);
    setAddForm((prev) => ({
      ...prev,
      consumableId: selected ? selected._id : "",
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.consumableId || !addForm.subConsumableName) {
      toast.error("Please select category and enter subcategory name");
      return;
    }
    try {
      await addSubConsumable(addForm.consumableId, {
        subConsumableName: addForm.subConsumableName,
      });
      toast.success("Sub Category added!");
      setOpenAddModal(false);
      setAddForm({ subConsumableName: "", consumableId: "" });
      fetchAll();
    } catch (error) {
      toast.error("Failed to add sub category");
    }
  };

  // Edit handlers
  const handleEdit = (row) => {
    setEditForm({
      _id: row._id,
      subConsumableName: row.subConsumableName,
      consumableId: row.consumableId,
    });
    setOpenEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditCategoryChange = (_, value) => {
    const selected = categories.find((cat) => cat.consumableName === value);
    setEditForm((prev) => ({
      ...prev,
      consumableId: selected ? selected._id : "",
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.consumableId || !editForm.subConsumableName) {
      toast.error("Please select category and enter subcategory name");
      return;
    }
    try {
      await updateSubConsumable(editForm._id, {
        subConsumableName: editForm.subConsumableName,
        consumableId: editForm.consumableId,
      });
      toast.success("Sub Category updated!");
      setOpenEditModal(false);
      setShowConfirm(true);
      setEditForm({ _id: "", subConsumableName: "", consumableId: "" });
      fetchAll();
    } catch (error) {
      toast.error("Failed to update sub category");
    }
  };

  // Delete handlers
  const handleDelete = (row) => {
    setDeleteInfo(row);
    setDeleteConfirmationModal(true);
  };

  const handleDeleteConfirm = async (e) => {
    e.preventDefault();
    if (!deleteInfo?._id || !deleteInfo?.consumableId) {
      toast.error("Invalid sub category info");
      return;
    }
    try {
      await deleteSubConsumable(deleteInfo.consumableId, deleteInfo._id);
      toast.success("Sub Category deleted!");
      setDeleteConfirmationModal(false);
      setDeleteInfo(null);
      fetchAll();
    } catch (error) {
      toast.error("Failed to delete sub category");
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button
          onClick={() => setOpenAddModal(true)}
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          CONSUMABLE SUB CATEGORY
        </h2>
        <MaterialReactTable table={table} />
      </div>
      {/* Add Modal */}
      {openAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-md font-semibold mb-6 text-start">
              ADD CONSUMABLE SUB CATEGORY
            </h2>
            <form onSubmit={handleAdd} className="space-y-2">
              <div className="flex items-center gap-2 mt-1">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Consumable Category
                </label>
                <Autocomplete
                  sx={{ width: 250 }}
                  options={categories.map((cat) => cat.consumableName)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select"
                      variant="standard"
                      required
                    />
                  )}
                  value={
                    categories.find((cat) => cat._id === addForm.consumableId)
                      ?.consumableName || ""
                  }
                  onChange={handleAddCategoryChange}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Sub Category *
                  </label>
                  <TextField
                    name="subConsumableName"
                    required
                    fullWidth
                    value={addForm.subConsumableName}
                    onChange={handleAddChange}
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setOpenAddModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in space-y-6">
            <h2 className="text-md font-semibold mb-6 text-start">
              EDIT CONSUMABLE SUB CATEGORY
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-2">
              <div className="flex items-center gap-2 mt-1">
                <label className="w-40 text-sm font-medium text-gray-500">
                  Consumable Category
                </label>
                <Autocomplete
                  sx={{ width: 250 }}
                  options={categories.map((cat) => cat.consumableName)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select"
                      variant="standard"
                      required
                    />
                  )}
                  value={
                    categories.find((cat) => cat._id === editForm.consumableId)
                      ?.consumableName || ""
                  }
                  onChange={handleEditCategoryChange}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <label className="w-40 text-sm font-medium text-gray-500">
                    Sub Category *
                  </label>
                  <TextField
                    name="subConsumableName"
                    required
                    fullWidth
                    value={editForm.subConsumableName}
                    onChange={handleEditChange}
                    variant="standard"
                    sx={{ width: 250 }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  // type="submit"
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-4 py-2 rounded-md text-sm text-white transition-all"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setOpenEditModal(false)}
                  className="bg-[#df656b] shadow-[#F26E75] shadow-md text-white px-4 py-2 rounded-lg transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <ConfirmUpdateModal
                  isOpen={showConfirm}
                  onConfirm={handleEditSubmit}
                  message="Are you sure you want to update this consumable sub category?"
                  onCancel={() => setShowConfirm(false)}
                />
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
              This action will permanently delete the sub category.
            </p>
            <form
              onSubmit={handleDeleteConfirm}
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
    </>
  );
}

export default ConsumableSubCategory;
