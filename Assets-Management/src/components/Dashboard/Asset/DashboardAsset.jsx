import React, { useEffect, useState } from "react";
import AssetPieChart from "./AssetPieChart";
import { getAllAssets } from "../../../api/AssetsRequest.js";
import { useNavigate } from "react-router-dom";
import { FaDesktop } from "react-icons/fa";
import { Container } from "@mui/material";
import AssetByCategoryBarChart from "./AssetByCategoryBarChart.jsx";
import AssetBySubLocationBarChart from "./AssetBySubLocationBarChart.jsx";
import AssetsByBusinessUnitBarChart from "./AssetsByBusinessUnitBarChart.jsx";

function DashboardAsset() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await getAllAssets();
        console.log("rr", response);
        setAssets(response?.data?.data || []);
      } catch (error) {
        setAssets([]);
      }
    };
    fetchAssets();
  }, []);

  //static data later chnage
  const AssetsByStatus = [
    { id: 0, value: 30, label: "Allocated", color: "#1976d2" },
    { id: 1, value: 170, label: "Instore", color: "#00C853" },
  ];
  const AssetsBySupportType = [
    { id: 0, value: 30, label: "Under Warranty", color: "#1976d2" },
    { id: 1, value: 170, label: "Under AMC", color: "#00C853" },
    { id: 2, value: 20, label: "Out of Support", color: "#fbc02d" },
  ];

  const AssetsByWarrantyExpiry = [
    { id: 0, value: 30, label: "7 Days", color: "#1976d2" },
    { id: 1, value: 170, label: "15 Days", color: "#00C853" },
    { id: 2, value: 20, label: "30 Days", color: "#fbc02d" },
    { id: 3, value: 75, label: "90 Days", color: "#e53935" },
  ];
  const AssetsByLife = [
    { id: 0, value: 30, label: "3 Month", color: "#1976d2" },
    { id: 1, value: 170, label: "3 to 6 Month", color: "#00C853" },
    { id: 2, value: 20, label: "6 to 12 Month", color: "#fbc02d" },
    { id: 3, value: 75, label: "After 1 year", color: "#e53935" },
    { id: 4, value: 50, label: "Expired", color: "#8e24aa" },
    { id: 5, value: 40, label: "Status not available", color: "#00838f" },
  ];

  const AssetsByLifes = [
    { id: 0, value: 30, label: "0 Years", color: "#1976d2" },
    { id: 1, value: 170, label: "3 Years", color: "#00C853" },
  ];
  const CmdbAgent = [
    { id: 0, value: 30, label: "Mismatched", color: "#1976d2" },
    { id: 1, value: 170, label: "Matched", color: "#00C853" },
  ];
  const PatchStatus = [
    { id: 0, value: 30, label: "Installed", color: "#1976d2" },
    { id: 1, value: 170, label: "Missing", color: "#00C853" },
    { id: 2, value: 20, label: "Not-Available", color: "#fbc02d" },
  ];

  const AssetsByAMCExpiry = [
    { id: 0, value: 30, label: "30 Days", color: "#1976d2" },
    { id: 1, value: 170, label: "60 Days", color: "#00C853" },
    { id: 2, value: 20, label: "90 Days", color: "#fbc02d" },
  ];

  const CMDBAgentMapping = [
    { id: 0, value: 30, label: "Mapped", color: "#1976d2" },
    { id: 1, value: 170, label: "Not Mapped", color: "#00C853" },
  ];

  return (
    <>
      <div className="flrx flex-col gap-6 justify-center p-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/main/asset/AssetData")}
            className="bg-[#6f7fbc] shadow-[#7a8bca] shadow-md px-3 py-2 rounded-md text-sm text-white transition-all"
          >
            <div className="flex flex-row justify-between items-center gap-1">
              <FaDesktop size={12} />
              <span>Go To Module</span>
            </div>
          </button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <AssetPieChart title="Assets By Status" data={AssetsByStatus} />
          <AssetPieChart
            title="Assets By Support Type"
            data={AssetsBySupportType}
          />
          <AssetPieChart
            title="Assets By Warranty Expiry"
            data={AssetsByWarrantyExpiry}
          />
          <AssetPieChart title=" Assets By Life(Expiry)" data={AssetsByLife} />
          <AssetPieChart title="Assets By Life" data={AssetsByLifes} />
          <AssetPieChart
            title="CMDB/Agent (Make, Model, S.No.)"
            data={CmdbAgent}
          />
          <AssetPieChart title="Patch Status" data={PatchStatus} />
          <AssetPieChart
            title="const Assets By AMC Expiry"
            data={AssetsByAMCExpiry}
          />
          <AssetPieChart title="CMDB / Agent Mapping" data={CMDBAgentMapping} />
        </div>
        <div>
          <Container sx={{ mt: 4 }}>
            <AssetByCategoryBarChart />
          </Container>
          <Container sx={{ mt: 4 }}>
            <AssetBySubLocationBarChart />
          </Container>
          <Container sx={{ mt: 4 }}>
            <AssetsByBusinessUnitBarChart />
          </Container>
        </div>
      </div>
    </>
  );
}

export default DashboardAsset;

// import React, { useEffect, useState, useMemo } from "react";
// import { PieChart } from "@mui/x-charts/PieChart";
// import { getAllAssets } from "../../api/AssetsRequest";
// import { Card, CardContent, Typography, Box } from "@mui/material";

// function DashboardAsset() {

//   const [assets, setAssets] = useState([]);

//   useEffect(() => {
//     const fetchAssets = async () => {
//       try {
//         const response = await getAllAssets();
//         setAssets(response?.data?.data || []);
//       } catch (error) {
//         setAssets([]);
//       }
//     };
//     fetchAssets();
//   }, []);

//   // Group assets by category
//   const categoryData = useMemo(() => {
//     const counts = {};
//     assets.forEach((item) => {
//       const cat = item.assetInformation?.category || "Uncategorized";
//       counts[cat] = (counts[cat] || 0) + 1;
//     });
//     return Object.entries(counts).map(([label, value], i) => ({
//       id: i,
//       label,
//       value,
//     }));
//   }, [assets]);

//   // Total assets
//   const totalAssets = assets.length;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Asset Distribution by Category
//       </Typography>
//       <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
//         <PieChart
//           series={[
//             {
//               data: categoryData,
//               highlightScope: { fade: "global", highlight: "item" },
//               faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
//               valueFormatter: (item) => `${item.value}`,
//             },
//           ]}
//           height={250}
//           width={350}
//         />
//         <Card sx={{ minWidth: 180, bgcolor: "#f1f5fa" }}>
//           <CardContent>
//             <Typography variant="h6" color="primary">
//               Total Assets
//             </Typography>
//             <Typography variant="h4" color="text.secondary">
//               {totalAssets}
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//       {/* <Box sx={{ mt: 2 }}>
//         <Typography variant="subtitle1" sx={{ mb: 1 }}>
//           Category Breakdown:
//         </Typography>
//         {categoryData.map((cat) => (
//           <Typography key={cat.label} variant="body2">
//             {cat.label}: <b>{cat.value}</b>
//           </Typography>
//         ))}
//       </Box> */}
//     </Box>
//   )
// }

// export default DashboardAsset
