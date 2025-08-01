import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { getResolutionSlaStatus } from "../../../../api/DashboardRequest";

function ResolutionSlaStatusPieChart() {
  const [selectedRange, setSelectedRange] = React.useState("1 week");
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = new Date();
      const from = new Date(today);
      let days = 7;
      if (selectedRange === "2 weeks") days = 14;
      else if (selectedRange === "1 month") days = 30;
      else if (selectedRange === "3 Months") days = 90;
      from.setDate(today.getDate() - days);
      try {
        const res = await getResolutionSlaStatus(
          from.toISOString().slice(0, 10),
          today.toISOString().slice(0, 10)
        );
        setData(res.data.data || []);
      } catch {
        setData([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedRange]);

  const valueFormatter = ({ value }) => `${value}`;
  const title = "Resolution SLA Status";

  return (
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <PieChart
          series={[
            {
              data,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              valueFormatter,
            },
          ]}
          width={200}
          height={200}
        />
      )}
    </div>
  );
}

export default ResolutionSlaStatusPieChart;
