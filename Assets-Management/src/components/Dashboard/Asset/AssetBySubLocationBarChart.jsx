import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Box } from "@mui/material";

const browserData = [
  { name: "BSO Faridabad", value: 1020 },
  { name: "BSO PRAYAGRAJ", value: 350 },
  { name: "BHOPAL CCO", value: 290 },
  { name: "GO AHMEDABAD", value: 610 },
  { name: "BSO Bokaro", value: 10 },
  { name: "BSO Delhi", value: 5 },
];

const AssetBySubLocationBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assets By Sub Location
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
                tickValues: [0, 100, 200, 300, 400],
                max: 400,
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

export default AssetBySubLocationBarChart;
