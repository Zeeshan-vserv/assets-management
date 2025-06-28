import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { getAllAssets } from "../../../../api/AssetsRequest"; //later chnage

const AssetComponents = ({ id }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(id)

  const fetchAssetComponents = async () => {
    try {
      setIsLoading(true);
      const response = await getAllAssets(); //later change
      if (response.status !== 200) {
        throw new Error("Failed to fetch data");
      }
      setData(response?.data.data || []);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetComponents();
  }, []);

  // console.log(data);

  const columns = useMemo(
    () => [
      {
        accessorKey: "assetId",
        header: "Id",
      },

      {
        accessorKey: "assetState.user",
        header: "Component Name",
      },
      {
        accessorKey: "assetInformation.model",
        header: "Serial No.",
      },
      {
        accessorKey: "assetInformation.serialNumber",
        header: "Make",
      },
      {
        accessorKey: "locationInformation.location",
        header: "Model",
      },
      {
        accessorKey: "locationInformation.subLocation",
        header: "Warranty End Date",
      },
      {
        accessorKey: "assetState.assetIsCurrently",
        header: "Cost",
      },
      {
        accessorKey: "mappingStatus",
        header: "Vendor",
      },
      {
        accessorKey: "ackStatus",
        header: "Status",
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
      <div className="flex flex-col w-[100%] min-h-full p-4 bg-slate-100 overflow-x-auto">
        <div>
          <MaterialReactTable table={table} />
        </div>
      </div>
    </>
  );
};

export default AssetComponents;
