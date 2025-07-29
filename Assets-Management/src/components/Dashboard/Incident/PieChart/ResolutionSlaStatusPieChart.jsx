import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

function ResolutionSlaStatusPieChart() {
  const [selectedRange, setSelectedRange] = React.useState("1 week");
  const valueFormatter = ({ value }) => `${value}`;

  const title = "Resolution SLA Status";
  const resolutionSlaStatusData = [
    { id: 0, value: 30, label: "Met", color: "#1976d2" },
    { id: 1, value: 170, label: "Missed", color: "#00C853" },
  ];
  return (
    <>
      <div className="bg-white rounded-md p-4 border-2 border-gray-400 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md outline-none block w-[40%] py-1 cursor-pointer"
          >
            <option value="1 week">1 Week</option>
            <option value="2 weeks">2 Weeks</option>
            <option value="1 month">1 Month</option>
            <option value="3 Months">3 Months</option>
          </select>
        </div>
        <PieChart
          series={[
            {
              data: resolutionSlaStatusData,
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

export default ResolutionSlaStatusPieChart;
