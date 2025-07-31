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
  "30 days": 30,
  "90 days": 90,
  "6 Months": 180,
  "1 Year": 365,
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 15,
      ticks: {
        stepSize: 3,
        callback: function (value) {
          return [0, 3, 6, 9, 12, 15].includes(value) ? value : "";
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

const TotalRequestBarChart = ({ title, chartData }) => {
  const [selectedRange, setSelectedRange] = React.useState("30 days");

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
            sx={{ minWidth: 240, fontSize: "0.875rem" }}
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

export default TotalRequestBarChart;
