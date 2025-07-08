import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Card, CardContent, Typography, Box } from "@mui/material";

const browserData = [{ name: "BSO Faridabad", value: 100 }];

const AssetsByBusinessUnitBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assets By Business Unit
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
                tickValues: [0, 600, 1200, 1800, 2400, 3000],
                max: 3000,
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

export default AssetsByBusinessUnitBarChart;
