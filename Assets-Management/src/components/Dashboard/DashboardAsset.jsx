import React, { useEffect, useState, useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { getAllAssets } from "../../api/AssetsRequest";
import { Card, CardContent, Typography, Box } from "@mui/material";

function DashboardAsset() {

  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await getAllAssets();
        setAssets(response?.data?.data || []);
      } catch (error) {
        setAssets([]);
      }
    };
    fetchAssets();
  }, []);

  // Group assets by category
  const categoryData = useMemo(() => {
    const counts = {};
    assets.forEach((item) => {
      const cat = item.assetInformation?.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value], i) => ({
      id: i,
      label,
      value,
    }));
  }, [assets]);

  // Total assets
  const totalAssets = assets.length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Asset Distribution by Category
      </Typography>
      <Box sx={{ display: "flex", gap: 4, alignItems: "center" }}>
        <PieChart
          series={[
            {
              data: categoryData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter: (item) => `${item.value}`,
            },
          ]}
          height={250}
          width={350}
        />
        <Card sx={{ minWidth: 180, bgcolor: "#f1f5fa" }}>
          <CardContent>
            <Typography variant="h6" color="primary">
              Total Assets
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {totalAssets}
            </Typography>
          </CardContent>
        </Card>
      </Box>
      {/* <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Category Breakdown:
        </Typography>
        {categoryData.map((cat) => (
          <Typography key={cat.label} variant="body2">
            {cat.label}: <b>{cat.value}</b>
          </Typography>
        ))}
      </Box> */}
    </Box>
  )
}

export default DashboardAsset
