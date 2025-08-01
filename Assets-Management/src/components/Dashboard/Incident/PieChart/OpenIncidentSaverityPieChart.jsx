import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { getOpenIncidentsBySeverity } from "../../../../api/DashboardRequest";

function OpenIncidentSaverityPieChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = new Date();
      const from = new Date(today);
      from.setDate(today.getDate() - 30);
      try {
        const res = await getOpenIncidentsBySeverity(
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
  }, []);

  const valueFormatter = ({ value }) => `${value}`;
  const title = "Open Incidents By Severity";

  return (
    <div className="bg-white rounded-md p-4 border-2 border-gray-400 shadow-md">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
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

export default OpenIncidentSaverityPieChart;
