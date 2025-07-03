import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

function MyServiceRequestChart() {
  const desktopOS = [
    { id: 0, value: 30, label: "New", color: "#1976d2" },
    { id: 1, value: 170, label: "Resolved", color: "#00C853" },
    { id: 2, value: 20, label: "Cancel", color: "#fbc02d" },
  ];

  const valueFormatter = ({ value }) => `${value}`;

  return (
    <>
      <div className="bg-white rounded-md p-4 w-[30%] min-w-60 h-full">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          MY SERVICE REQUESTS
        </h3>
        <PieChart
          series={[
            {
              data: desktopOS,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter,
            },
          ]}
          height={200}
          width={200}
        />
      </div>
    </>
  );
}
export default MyServiceRequestChart;
