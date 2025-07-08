import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

function AssetPieChart({ title, data, width = 200, height = 200 }) {
  const valueFormatter = ({ value }) => `${value}`;

  return (
    <div className="bg-white rounded-md p-4 w-[30%] max-lg:w-[48%] max-md:w-full h-[100%] border-2 border-gray-400 shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <PieChart
        series={[
          {
            data,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            valueFormatter,
          },
        ]}
        height={height}
        width={width}
      />
    </div>
  );
}

export default AssetPieChart;
