import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

function OpenServiceBySeverity() {
  const valueFormatter = ({ value }) => `${value}`;

  const title = "Open Service By Severity";
  const OpenIncidentBySaverityData = [
    { id: 0, value: 20, label: "Severity 4", color: "#1976d2" },
  ];
  return (
    <>
      <div className="bg-white rounded-md p-4 border-2 border-gray-400 shadow-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
        <PieChart
          series={[
            {
              data: OpenIncidentBySaverityData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter,
            },
          ]}
          width={200}
          height={200}
        />
      </div>
    </>
  );
}

export default OpenServiceBySeverity;
