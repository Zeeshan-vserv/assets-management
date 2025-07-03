import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";

function RecentIncidents() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentIncidents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://dummyjson.com/recipes");
      setData(response?.data?.recipes || []);
    } catch (error) {
      console.error("Error fetching recent incidents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentIncidents();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Recent Incidents",
      },
      {
        accessorKey: "cuisine",
        header: "Subject",
      },
      {
        accessorKey: "difficulty",
        header: "Status",
      },
    ],
    [isLoading]
  );

  const table = useMaterialReactTable({
    data,
    columns,
    getRowId: (row) => row?._id?.toString(),
    enableHiding: false,
    initialState: {
      density: "compact",
      pagination: { pageSize: 3 },
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
      rowsPerPageOptions: [3, 5],
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-white rounded-md">
        <MaterialReactTable table={table} />
      </div>
    </>
  );
}

export default RecentIncidents;
