import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, Typography, Box } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

const data = {
  labels: browserData.map((item) => item.name),
  datasets: [
    {
      label: "Assets",
      data: browserData.map((item) => item.value),
      backgroundColor: "#2196f3",
      borderRadius: 4,
      barThickness: 30
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 1200,
      ticks: {
        stepSize: 300,
        callback: function (value) {
          return [0, 300, 600, 900, 1200].includes(value) ? value : "";
        },
      },
      grid: {
        drawBorder: false,
        color: "#e0e0e0",
      },
    },
    x: {
      ticks: {
        font: {
          style: "italic",
        },
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const AssetByCategoryBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assets By Category
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 300, sm: 400, md: 500 } }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetByCategoryBarChart;
