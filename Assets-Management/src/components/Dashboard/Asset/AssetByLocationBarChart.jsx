import React, { useEffect, useState } from "react";
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
import { getAssetsByLocation } from "../../../api/DashboardRequest";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AssetByLocationBarChart = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAssetsByLocation();
        setLocationData(res?.data?.data || []);
      } catch {
        setLocationData([]);
      }
    };
    fetchData();
  }, []);

  // Calculate dynamic max and ticks
  const maxValue = Math.max(
    ...locationData.map((item) => Number(item.value) || 0),
    0
  );
  const stepSize =
    maxValue > 0 ? Math.ceil((maxValue / 4) / 100) * 100 : 100;
  const dynamicMax = Math.ceil(maxValue / stepSize) * stepSize || 400;
  const ticksArray = Array.from(
    { length: Math.floor(dynamicMax / stepSize) + 1 },
    (_, i) => i * stepSize
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: dynamicMax,
        ticks: {
          stepSize: stepSize,
          callback: function (value) {
            return ticksArray.includes(value) ? value : "";
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
    labels: locationData.map((item) => item.label),
    datasets: [
      {
        label: "Assets",
        data: locationData.map((item) => Number(item.value) || 0),
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
          Assets By Location
        </Typography>
        <Box sx={{ width: "100%", height: { xs: 300, sm: 400, md: 500 } }}>
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetByLocationBarChart;