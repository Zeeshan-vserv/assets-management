import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Box } from "@mui/material";

const browserData = [
  { name: "DESKTOP", value: 1020 },
  { name: "LAPTOP", value: 350 },
  { name: "MONITOR", value: 290 },
  { name: "PRINTER", value: 610 },
  { name: "SCANNER", value: 10 },
  { name: "ROUTER", value: 5 },
  { name: "SCANNER-2", value: 45 },
  { name: "Switch", value: 130 },
  { name: "VC", value: 5 },
];

const AssetByCategoryBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assets By Category
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 300, sm: 350, md: 400 } }}>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: browserData.map((d) => d.name),

                tickLabelStyle: {
                  fontStyle: "italic",
                  textAnchor: "end",
                },
              },
            ]}
            yAxis={[
              {
                tickValues: [0, 300, 600, 900, 1200],
                max: 1200,
              },
            ]}
            series={[
              {
                data: browserData.map((d) => d.value),
                color: "#2196f3",
              },
            ]}
            grid={{ horizontal: true }}
            slotProps={{
              legend: { hidden: true },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetByCategoryBarChart;
