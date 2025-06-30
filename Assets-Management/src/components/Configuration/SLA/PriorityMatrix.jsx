import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { getAllAssets } from "../../../api/AssetsRequest"; //later change

const PriorityMatrix = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPriorityMatrix = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching priority matrix:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityMatrix();
  }, []);

  // console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetInformation.assetTag",
        header: "Urgency",
      },
      {
        accessorKey: "assetState.user",
        header: "Impact",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "	Priority",
      },
    ],
    [isLoading]
  );

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableRowSelection: true,
    initialState: {
      density: "compact",
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
      <div className="flex flex-col w-[100%] min-h-full  p-4 bg-slate-100">
        <h2 className="text-lg font-semibold mb-6 text-start">
          PRIORITY MATRIX
        </h2>
        <div>
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
};

export default PriorityMatrix;
