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

const browserData = [{ name: "N/A", value: 10 }];

const data = {
  labels: browserData.map((item) => item.name),
  datasets: [
    {
      label: "Assets",
      data: browserData.map((item) => item.value),
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
      max: 1.0,
      ticks: {
        stepSize: 0.2,
        callback: function (value) {
          return [0.0, 0.2, 0.4, 0.6, 0.8, 1.0].includes(value) ? value : "";
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

const VendorByLocationBarChart = () => {
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Vendor By Location
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 300, sm: 400, md: 500 } }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorByLocationBarChart;
