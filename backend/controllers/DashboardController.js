import AssetModel from "../models/assetModel.js";
import IncidentModel from "../models/incidentModel.js";
import ServiceRequestModel from "../models/serviceRequestModel.js";

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

export const getIncidentOpenClosedByField = async (req, res) => {
  try {
    const { groupBy = "category", from, to } = req.query;
    const allowedFields = [
      "category",
      "subCategory",
      "location",
      "subLocation",
      "supportGroup",
      "supportDepartment"
    ];
    const fieldMap = {
      category: "$category",
      subCategory: "$subCategory",
      location: "$locationDetails.location",
      subLocation: "$locationDetails.subLocation",
      supportGroup: "$classificaton.supportGroupName",
      supportDepartment: "$classificaton.supportDepartmentName"
    };
    if (!allowedFields.includes(groupBy)) {
      return res.status(400).json({ message: "Invalid groupBy field" });
    }

    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            group: fieldMap[groupBy],
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.group",
          statuses: {
            $push: { status: "$_id.status", count: "$count" }
          },
          total: { $sum: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          statuses: 1,
          total: 1
        }
      }
    ];

    const aggregation = await IncidentModel.aggregate(pipeline);

    // Format result: Open = New+Assigned+In Progress+Reopened+Overdue, Closed = Closed
    const openStatuses = ["New", "Assigned", "In Progress", "Reopened", "Overdue"];
    const closedStatuses = ["Closed"];
    const result = aggregation.map((item) => {
      let open = 0, closed = 0;
      item.statuses.forEach(s => {
        if (openStatuses.includes(s.status)) open += s.count;
        if (closedStatuses.includes(s.status)) closed += s.count;
      });
      return {
        [groupBy]: item.group,
        Open: open,
        Closed: closed,
        total: item.total
      };
    });

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getServiceRequestStatusSummary = async (req, res) => {
  try {
    // List of statuses you want to count
    const statusList = [
      "Assigned",
      "In Progress",
      "Paused",
      "Overdue",
      "Resolved",
      "Reopened",
      "Closed",
      "Cancelled"
    ];

    // Map status keys to your DB status values
    const statusMap = {
      Assigned: ["Assigned"],
      "In Progress": ["In-Progress", "In Progress"],
      Paused: ["Pause", "Paused", "Hold"],
      Overdue: ["Overdue"],
      Resolved: ["Resolved"],
      Reopened: ["Reopened"],
      Closed: ["Closed"],
      Cancelled: ["Cancelled", "Rejected"]
    };

    // Aggregate by technician and status
    const aggregation = await ServiceRequestModel.aggregate([
      {
        $addFields: {
          latestStatus: { $arrayElemAt: ["$statusTimeline.status", -1] }
        }
      },
      {
        $group: {
          _id: {
            name: "$classificaton.technician",
            status: "$latestStatus"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.name",
          statuses: {
            $push: { status: "$_id.status", count: "$count" }
          },
          total: { $sum: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          statuses: 1,
          total: 1
        }
      }
    ]);

    // Format result for your table
    const result = aggregation
      .map((row) => {
        const counts = {};
        statusList.forEach((key) => {
          counts[key] = row.statuses
            .filter((s) => statusMap[key].includes(s.status))
            .reduce((sum, s) => sum + s.count, 0);
        });
        // Open = Assigned + In Progress + Paused + Overdue
        counts.Open =
          (counts.Assigned || 0) +
          (counts["In Progress"] || 0) +
          (counts.Paused || 0) +
          (counts.Overdue || 0);

        return {
          name: row.name || "Unassigned",
          open: counts.Open,
          assigned: counts.Assigned,
          inProgress: counts["In Progress"],
          paused: counts.Paused,
          overdue: counts.Overdue,
          resolved: counts.Resolved,
          reopend: counts.Reopened,
          closed: counts.Closed,
          cancelled: counts.Cancelled,
          total: row.total
        };
      })
      // Only show rows with assigned > 0
      .filter((row) => row.assigned > 0);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: "Error fetching service request summary", error: error.message });
  }
};

export const getTotalServicesByDateRange = async (req, res) => {
  try {
    // Parse query params
    const { from, to, groupBy = "day" } = req.query;
    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); 
    const endDate = to ? new Date(to) : new Date();

    // Choose date format for grouping
    let dateFormat;
    if (groupBy === "month") dateFormat = "%Y-%m";
    else if (groupBy === "year") dateFormat = "%Y";
    else dateFormat = "%Y-%m-%d"; // default: day

    const aggregation = await ServiceRequestModel.aggregate([
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

export const getServiceOpenByField = async (req, res) => {
  try {
    const { groupBy = "category", from, to } = req.query;
    const allowedFields = [
      "category",
      "subCategory",
      "location",
      "subLocation",
      "supportGroup",
      "supportDepartment"
    ];
    const fieldMap = {
      category: "$category",
      subCategory: "$subCategory",
      location: "$locationDetails.location",
      subLocation: "$locationDetails.subLocation",
      supportGroup: "$classificaton.supportGroupName",
      supportDepartment: "$classificaton.supportDepartmentName"
    };
    if (!allowedFields.includes(groupBy)) {
      return res.status(400).json({ message: "Invalid groupBy field" });
    }

    const startDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new Date(to) : new Date();

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            group: fieldMap[groupBy],
            status: "$status"
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.group",
          statuses: {
            $push: { status: "$_id.status", count: "$count" }
          },
          total: { $sum: "$count" }
        }
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          statuses: 1,
          total: 1
        }
      }
    ];

    const aggregation = await IncidentModel.aggregate(pipeline);

    // Format result: Open = New+Assigned+In Progress+Reopened+Overdue, Closed = Closed
    const openStatuses = ["New", "Assigned", "In Progress", "Reopened", "Overdue"];
    const closedStatuses = ["Closed"];
    const result = aggregation.map((item) => {
      let open = 0, closed = 0;
      item.statuses.forEach(s => {
        if (openStatuses.includes(s.status)) open += s.count;
        if (closedStatuses.includes(s.status)) closed += s.count;
      });
      return {
        [groupBy]: item.group,
        Open: open,
        Closed: closed,
        total: item.total
      };
    });

    res.json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Asset Dashboard Controller
export const getAssetsByStatus = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$assetState.assetIsCurrently",
          count: { $sum: 1 }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    const data = results.map((r, i) => ({
      id: i,
      label: r._id || "Unknown",
      value: r.count
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by status", error: error.message });
  }
};

export const getAssetsBySupportType = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$warrantyInformation.supportType",
          count: { $sum: 1 }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    const data = results.map((r, i) => ({
      id: i,
      label: r._id || "Unknown",
      value: r.count
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by support type", error: error.message });
  }
};

export const getAssetsByWarrantyExpiry = async (req, res) => {
  try {
    const now = new Date();
    const pipeline = [
      {
        $addFields: {
          daysLeft: {
            $divide: [
              { $subtract: ["$warrantyInformation.warrantyEndDate", now] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: "$daysLeft",
          boundaries: [0, 7, 15, 30, 90, 10000],
          default: "Expired",
          output: { count: { $sum: 1 } }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    // Map bucket labels as needed
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by warranty expiry", error: error.message });
  }
};

export const getAssetsByCategory = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$assetInformation.category",
          count: { $sum: 1 }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    const data = results.map((r, i) => ({
      id: i,
      label: r._id || "Uncategorized",
      value: r.count
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by category", error: error.message });
  }
};

export const getAssetsByLocation = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$locationInformation.location",
          count: { $sum: 1 }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    const data = results.map((r, i) => ({
      id: i,
      label: r._id || "Unknown",
      value: r.count
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by location", error: error.message });
  }
};

export const getAssetsBySubLocation = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$locationInformation.subLocation",
          count: { $sum: 1 }
        }
      }
    ];
    const results = await AssetModel.aggregate(pipeline);
    const data = results.map((r, i) => ({
      id: i,
      label: r._id || "Unknown",
      value: r.count
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assets by sub location", error: error.message });
  }
};

// export const getAssetsByBusinessUnit = async (req, res) => {
//   try {
//     const pipeline = [
//       {
//         $group: {
//           _id: "$assetState.department",
//           count: { $sum: 1 }
//         }
//       }
//     ];
//     const results = await AssetModel.aggregate(pipeline);
//     const data = results.map((r, i) => ({
//       id: i,
//       label: r._id || "Unknown",
//       value: r.count
//     }));
//     res.json({ success: true, data });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching assets by business unit", error: error.message });
//   }
// };


