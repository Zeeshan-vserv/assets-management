import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
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

const rangeToDays = {
  "1 Week": 30,
  "2 Weeks": 90,
  "3 Month": 90,
  "6 Months": 180,
  All: 365,
};

const BarGraphForRequest = ({
  title,
  chartData,
  min,
  max,
  stepSizes,
  ticksArray,
}) => {
  const [selectedRange, setSelectedRange] = React.useState("All");

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
        label: "Total Incidents",
        data: chartData.map((item) => item.value),
        backgroundColor: "#2196f3",
        borderRadius: 4,
        barThickness: 1,
      },
    ],
  };

  return (
    <CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h7" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body2" gutterBottom>
            Filter
          </Typography>
          <Select
            variant="standard"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            sx={{ minWidth: 100, fontSize: "0.875rem" }}
          >
            {Object.keys(rangeToDays).map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Box sx={{ width: "100%", height: { xs: 250, sm: 300, md: 350 } }}>
        <Bar data={data} options={options} />
      </Box>
    </CardContent>
  );
};

export default BarGraphForRequest;
