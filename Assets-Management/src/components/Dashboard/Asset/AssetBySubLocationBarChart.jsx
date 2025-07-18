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

const subLocationData = [
  { name: "BSO Faridabad", value: 350 },
  { name: "BSO PRAYAGRAJ", value: 115 },
  { name: "BHOPAL CCO", value: 200 },
  { name: "GO AHMEDABAD", value: 310 },
  { name: "BSO Bokaro", value: 100 },
  { name: "BSO Delhi", value: 50 },
];

const data = {
  labels: subLocationData.map((item) => item.name),
  datasets: [
    {
      label: "Assets",
      data: subLocationData.map((item) => item.value),
      backgroundColor: "#2196f3",
      borderRadius: 4,
      barThickness: 30,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 400,
      ticks: {
        stepSize: 100,
        callback: function (value) {
          return [0, 100, 200, 300, 400].includes(value) ? value : "";
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

const AssetBySubLocationBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Assets By Sub Location
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 300, sm: 400, md: 500 } }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetBySubLocationBarChart;
