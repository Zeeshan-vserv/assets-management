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

const VendorByLocationBarChart = ({
  title,
  chartData,
  min,
  max,
  stepSizes,
  ticksArray,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: min,
        max: max,
        ticks: {
          stepSize: stepSizes,
          callback: function (value) {
            if (!ticksArray || !Array.isArray(ticksArray)) return value;
            return ticksArray.some((tick) => Math.abs(tick - value) < 0.001)
              ? value
              : "";
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
  const data = {
    labels: chartData.map((item) => item.name),
    datasets: [
      {
        label: "Assets",
        data: chartData.map((item) => item.value),
        backgroundColor: "#2196f3",
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };
  return (
    <Card sx={{ maxWidth: "100%", mx: "auto", boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Box sx={{ width: "100%", height: { xs: 250, sm: 300, md: 350 } }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VendorByLocationBarChart;
