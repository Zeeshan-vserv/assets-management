import IncidentModel from "../models/incidentModel.js";

export const getTechnicianIncidentStatusSummary = async (req, res) => {
  try {
    const statusesList = [
      "Assigned",
      "In Progress",
      "Reopened",
      "Overdue",
      "Paused",
      "Resolved",
      "Closed",
      "Cancelled"
    ];

    // Aggregate incidents by technician and status
    const aggregation = await IncidentModel.aggregate([
  {
    $group: {
      _id: {
        technician: "$classificaton.technician", // <-- fix here!
        status: "$status"
      },
      count: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: "$_id.technician",
      statuses: {
        $push: { status: "$_id.status", count: "$count" }
      },
      total: { $sum: "$count" }
    }
  },
  {
    $project: {
      _id: 0,
      technician: "$_id",
      statuses: 1,
      total: 1
    }
  }
]);

    // Format result for table columns
    let result = aggregation.map((tech) => {
      const statusCounts = {};
      statusesList.forEach((status) => {
        statusCounts[status] =
          tech.statuses.find((s) => s.status === status)?.count || 0;
      });

      // "Open" is the sum of Assigned, In Progress, Reopened, Overdue
      statusCounts["Open"] =
        statusCounts["Assigned"] +
        statusCounts["In Progress"] +
        statusCounts["Reopened"] +
        statusCounts["Overdue"];

      return {
        technician: tech.technician,
        Open: statusCounts["Open"],
        Assigned: statusCounts["Assigned"],
        "In Progress": statusCounts["In Progress"],
        Reopened: statusCounts["Reopened"],
        Overdue: statusCounts["Overdue"],
        Paused: statusCounts["Paused"],
        Resolved: statusCounts["Resolved"],
        Closed: statusCounts["Closed"],
        Cancelled: statusCounts["Cancelled"],
        Total: tech.total
      };
    });

    // Filter out entries with no technician assigned
    result = result.filter(
      (row) =>
        row.technician !== null &&
        row.technician !== undefined &&
        row.technician !== ""
    );

    // Sort by Resolved in descending order
    result.sort((a, b) => (b.Resolved || 0) - (a.Resolved || 0));

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalIncidentsByDateRange = async (req, res) => {
  try {
    // Parse query params
    const { from, to, groupBy = "day" } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // default 30 days ago
    const endDate = to ? new Date(to) : new Date();

    // Choose date format for grouping
    let dateFormat;
    if (groupBy === "month") dateFormat = "%Y-%m";
    else if (groupBy === "year") dateFormat = "%Y";
    else dateFormat = "%Y-%m-%d"; // default: day

    const aggregation = await IncidentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          value: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format for chart: [{ name: "2024-07-01", value: 5 }, ...]
    const result = aggregation.map(item => ({
      name: item._id,
      value: item.value
    }));

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOpenIncidentsByStatus = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30*24*60*60*1000);
    const endDate = to ? new Date(to) : new Date();

    // Only count incidents that are not closed/cancelled/resolved
    const openStatuses = ["Assigned", "In Progress", "New"];
    const pipeline = [
      {
        $match: {
          status: { $in: openStatuses },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      }
    ];
    const results = await IncidentModel.aggregate(pipeline);

    // Format for chart
    const colorMap = {
      "Assigned": "#1976d2",
      "In Progress": "#00C853",
      "New": "#fbc02d"
    };
    const data = openStatuses.map((status, idx) => ({
      id: idx,
      value: results.find(r => r._id === status)?.value || 0,
      label: status,
      color: colorMap[status] || "#ccc"
    }));

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching open incidents by status", error: error.message });
  }
};

// backend/controllers/DashboardController.js
export const getOpenIncidentsBySeverity = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30*24*60*60*1000);
    const endDate = to ? new Date(to) : new Date();

    const openStatuses = ["Assigned", "In Progress", "New"];
    const severities = ["Severity-1", "Severity-2", "Severity-3", "Severity-4"];
    const colorMap = {
      "Severity-1": "#1976d2",
      "Severity-2": "#00C853",
      "Severity-3": "#fbc02d",
      "Severity-4": "#ff5722"
    };

    const pipeline = [
      {
        $match: {
          status: { $in: openStatuses },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$classificaton.severityLevel",
          value: { $sum: 1 }
        }
      }
    ];
    const results = await IncidentModel.aggregate(pipeline);

    const data = severities.map((sev, idx) => ({
      id: idx,
      value: results.find(r => r._id === sev)?.value || 0,
      label: sev,
      color: colorMap[sev] || "#ccc"
    }));

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching open incidents by severity", error: error.message });
  }
};

export const getResponseSlaStatus = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    // Fetch incidents in date range
    const incidents = await IncidentModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      isSla: true
    });

    let met = 0;
    let missed = 0;

    for (const incident of incidents) {
      // If not resolved, skip (or count as missed if you want)
      const timeline = incident.statusTimeline || [];
      const resolvedEntry = [...timeline].reverse().find(
        (t) => t.status?.toLowerCase() === "resolved"
      );
      if (!resolvedEntry) continue;

      const resolvedAt = new Date(resolvedEntry.changedAt);
      const slaDeadline = new Date(incident.sla);

      if (resolvedAt <= slaDeadline) {
        met += 1;
      } else {
        missed += 1;
      }
    }

    const data = [
      { id: 0, value: met, label: "Met", color: "#1976d2" },
      { id: 1, value: missed, label: "Missed", color: "#00C853" }
    ];

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching response SLA status", error: error.message });
  }
};

export const getResolutionSlaStatus = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    // Fetch incidents in date range
    const incidents = await IncidentModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
      isSla: true
    });

    let met = 0;
    let missed = 0;

    for (const incident of incidents) {
      // If not resolved, skip (or count as missed if you want)
      const timeline = incident.statusTimeline || [];
      const resolvedEntry = [...timeline].reverse().find(
        (t) => t.status?.toLowerCase() === "resolved"
      );
      if (!resolvedEntry) continue;

      const resolvedAt = new Date(resolvedEntry.changedAt);
      // Use incident.resolutionSla for the deadline (make sure this field exists)
      const slaDeadline = new Date(incident.resolutionSla || incident.sla);

      if (resolvedAt <= slaDeadline) {
        met += 1;
      } else {
        missed += 1;
      }
    }

    const data = [
      { id: 0, value: met, label: "Met", color: "#1976d2" },
      { id: 1, value: missed, label: "Missed", color: "#00C853" }
    ];

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching resolution SLA status", error: error.message });
  }
};
