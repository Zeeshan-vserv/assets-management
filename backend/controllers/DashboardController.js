import AssetModel from "../models/assetModel.js";
import IncidentModel from "../models/incidentModel.js";
import ServiceRequestModel from "../models/serviceRequestModel.js";
import { SLACreationModel, SLATimelineModel } from "../models/slaModel.js";
import { getISTDate } from "../utils/dateUtils.js";
import ExcelJS from "exceljs";

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30 * 24 * 60 * 60 * 1000); // default 30 days ago
    const endDate = to ? new getISTDate(to) : new getISTDate();

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30*24*60*60*1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30*24*60*60*1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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

      const resolvedAt = new getISTDate(resolvedEntry.changedAt);
      const slaDeadline = new getISTDate(incident.sla);

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 7 * 24 * 60 * 60 * 1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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

      const resolvedAt = new getISTDate(resolvedEntry.changedAt);
      // Use incident.resolutionSla for the deadline (make sure this field exists)
      const slaDeadline = new getISTDate(incident.resolutionSla || incident.sla);

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

    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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
    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30 * 24 * 60 * 60 * 1000); 
    const endDate = to ? new getISTDate(to) : new getISTDate();

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

    const startDate = from ? new getISTDate(from) : new getISTDate(getISTDate.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = to ? new getISTDate(to) : new getISTDate();

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
    const now = new getISTDate();
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

// Helper: Get business minutes between two dates
// Helper: Get business minutes between two dates
function getBusinessMinutesBetween(now, end, slaTimeline) {
  let minutes = 0;
  let current = new Date(now);
  while (current < end) {
    const weekDay = current.toLocaleString("en-US", { weekday: "long" });
    const slot = slaTimeline.find((s) => s.weekDay === weekDay);
    if (!slot) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const start = new Date(current);
    start.setHours(
      new Date(slot.startTime).getUTCHours(),
      new Date(slot.startTime).getUTCMinutes(),
      0,
      0
    );
    const endWindow = new Date(current);
    endWindow.setHours(
      new Date(slot.endTime).getUTCHours(),
      new Date(slot.endTime).getUTCMinutes(),
      0,
      0
    );
    if (current >= endWindow) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    if (current < start) current = new Date(start);
    const until = end < endWindow ? end : endWindow;
    const diff = Math.max(0, (until - current) / 60000);
    minutes += diff;
    current = new Date(until);
    if (current < end) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }
  }
  return Math.round(minutes);
}

// Helper: Calculate SLA deadline (business hours logic)
function addBusinessTime(startDate, hoursToAdd, slaTimeline) {
  let remainingMinutes = Math.round(hoursToAdd * 60);
  let current = new Date(startDate);

  function getBusinessWindow(date) {
    const weekDay = date.toLocaleString("en-US", { weekday: "long" });
    const slot = slaTimeline.find((s) => s.weekDay === weekDay);
    if (!slot) return null;
    const start = new Date(date);
    start.setHours(
      new Date(slot.startTime).getUTCHours(),
      new Date(slot.startTime).getUTCMinutes(),
      0,
      0
    );
    const end = new Date(date);
    end.setHours(
      new Date(slot.endTime).getUTCHours(),
      new Date(slot.endTime).getUTCMinutes(),
      0,
      0
    );
    return { start, end };
  }

  while (remainingMinutes > 0) {
    const window = getBusinessWindow(current);
    if (!window) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    if (current < window.start) current = new Date(window.start);
    if (current >= window.end) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const minutesLeftToday = Math.floor((window.end - current) / 60000);
    const minutesToAdd = Math.min(remainingMinutes, minutesLeftToday);
    current = new Date(current.getTime() + minutesToAdd * 60000);
    remainingMinutes -= minutesToAdd;
    if (remainingMinutes > 0) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
    }
  }
  return current;
}

// Format minutes as "X hr Y min"
function formatMinutes(minutes) {
  if (minutes == null) return "N/A";
  const abs = Math.abs(minutes);
  const hr = Math.floor(abs / 60);
  const min = abs % 60;
  return `${hr} hr ${min} min`;
}

function getReportFileName(type, filters) {
  const from = filters?.from ? filters.from : "all";
  const to = filters?.to ? filters.to : "all";
  return `${from}_to_${to}_${type}_report.xlsx`;
}

// Helper to get nested values
const getNested = (obj, path) =>
  path.split('.').reduce((o, k) => (o ? o[k] : ""), obj);

// Helper to create Excel file with colored headers
async function createExcelFile(columns, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Add header row with styling
  const headerRow = worksheet.addRow(columns.map(col => col.toUpperCase()));
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: "000000" } }; 
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "F5F227" }
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Add data rows
  data.forEach(row => {
    worksheet.addRow(columns.map(col => row[col]));
  });

  // Auto width for columns
  worksheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, cell => {
      maxLength = Math.max(maxLength, (cell.value ? cell.value.toString().length : 0));
    });
    column.width = maxLength + 2;
  });

  return workbook;
}

// INCIDENT REPORT
export const exportIncidentReport = async (req, res) => {
  try {
    const { filters = {}, columns = [] } = req.body;

    // Build MongoDB query
    const query = {};
    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) query.createdAt.$gte = new Date(filters.from);
      if (filters.to) query.createdAt.$lte = new Date(filters.to);
    }

    // Fetch data
    const incidents = await IncidentModel.find(query).lean();

    // Fetch SLA config and timeline only once
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find();
    const businessHours = slaConfig?.slaTimeline || [];

    // Map data to selected columns, calculate SLA/TAT if needed
    const data = incidents.map((item) => {
      const row = {};
      columns.forEach((col) => {
        if (col === "sla") {
          // --- SLA Calculation ---
          const severity = item?.classificaton?.severityLevel;
          const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
          const matchedTimeline = slaTimelineData.find(
            (t) =>
              t.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
          );
          const resolution = matchedTimeline?.resolutionSLA || "00:30";
          const [slaHours, slaMinutes] = resolution.split(":").map(Number);
          const totalHours = slaHours + slaMinutes / 60;
          const loggedIn = new Date(item?.createdAt || item?.submitter?.loggedInTime);
          const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);
          const timeline = item.statusTimeline || [];
          const latestStatus = timeline?.at(-1)?.status?.toLowerCase();
          let slaRemainingMinutes;
          if (latestStatus === "resolved") {
            const resolvedEntry = [...timeline].reverse().find(
              (t) => t.status?.toLowerCase() === "resolved"
            );
            const resolvedTime = resolvedEntry ? new Date(resolvedEntry.changedAt) : null;
            if (resolvedTime) {
              slaRemainingMinutes = resolvedTime < slaDeadline
                ? getBusinessMinutesBetween(resolvedTime, slaDeadline, businessHours)
                : -getBusinessMinutesBetween(slaDeadline, resolvedTime, businessHours);
            } else {
              slaRemainingMinutes = 0;
            }
          } else {
            const now = new Date();
            if (now < slaDeadline) {
              slaRemainingMinutes = getBusinessMinutesBetween(now, slaDeadline, businessHours);
            } else {
              slaRemainingMinutes = -getBusinessMinutesBetween(slaDeadline, now, businessHours);
            }
          }
          row[col] = formatMinutes(slaRemainingMinutes);
        } else if (col === "tat") {
          // --- TAT Calculation ---
          const timeline = item.statusTimeline || [];
          const assignedEntry = [...timeline].reverse().find(
            (t) => t.status?.toLowerCase() === "assigned"
          );
          const resolvedEntry = [...timeline].reverse().find(
            (t) => t.status?.toLowerCase() === "resolved"
          );
          let tatMinutes = null;
          if (assignedEntry && resolvedEntry) {
            const assignedTime = new Date(assignedEntry.changedAt);
            const resolvedTime = new Date(resolvedEntry.changedAt);
            if (resolvedTime > assignedTime) {
              tatMinutes = Math.floor((resolvedTime - assignedTime) / 60000);
            }
          }
          row[col] = formatMinutes(tatMinutes);
        } else {
          row[col] = getNested(item, col);
        }
      });
      return row;
    });

    // Create Excel file
    const workbook = await createExcelFile(columns, data);

    const filename = getReportFileName("incident", filters);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
};

// SERVICE REQUEST REPORT
export const exportServiceRequestReport = async (req, res) => {
  try {
    const { filters = {}, columns = [] } = req.body;

    // Build MongoDB query for date range if provided
    const query = {};
    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) query.createdAt.$gte = new Date(filters.from);
      if (filters.to) query.createdAt.$lte = new Date(filters.to);
    }

    // Fetch data
    const requests = await ServiceRequestModel.find(query).lean();

    // Fetch SLA config and timeline if needed for SLA/TAT calculation
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find();
    const businessHours = slaConfig?.slaTimeline || [];

    // SLA and TAT calculation logic (similar to incidents)
    const data = requests.map((item) => {
      const row = {};
      columns.forEach((col) => {
        if (col === "sla") {
          // --- SLA Calculation ---
          const severity = item?.classificaton?.severityLevel;
          const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
          const matchedTimeline = slaTimelineData.find(
            (t) =>
              t.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
          );
          const resolution = matchedTimeline?.resolutionSLA || "00:30";
          const [slaHours, slaMinutes] = resolution.split(":").map(Number);
          const totalHours = slaHours + slaMinutes / 60;
          const loggedIn = new Date(item?.createdAt || item?.submitter?.loggedInTime);
          const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);
          const timeline = item.statusTimeline || [];
          const latestStatus = timeline?.at(-1)?.status?.toLowerCase();
          let slaRemainingMinutes;
          if (latestStatus === "resolved") {
            const resolvedEntry = [...timeline].reverse().find(
              (t) => t.status?.toLowerCase() === "resolved"
            );
            const resolvedTime = resolvedEntry ? new Date(resolvedEntry.changedAt) : null;
            if (resolvedTime) {
              slaRemainingMinutes = resolvedTime < slaDeadline
                ? getBusinessMinutesBetween(resolvedTime, slaDeadline, businessHours)
                : -getBusinessMinutesBetween(slaDeadline, resolvedTime, businessHours);
            } else {
              slaRemainingMinutes = 0;
            }
          } else {
            const now = new Date();
            if (now < slaDeadline) {
              slaRemainingMinutes = getBusinessMinutesBetween(now, slaDeadline, businessHours);
            } else {
              slaRemainingMinutes = -getBusinessMinutesBetween(slaDeadline, now, businessHours);
            }
          }
          row[col] = formatMinutes(slaRemainingMinutes);
        } else if (col === "tat") {
          // --- TAT Calculation ---
          const timeline = item.statusTimeline || [];
          const assignedEntry = [...timeline].reverse().find(
            (t) => t.status?.toLowerCase() === "assigned"
          );
          const resolvedEntry = [...timeline].reverse().find(
            (t) => t.status?.toLowerCase() === "resolved"
          );
          let tatMinutes = null;
          if (assignedEntry && resolvedEntry) {
            const assignedTime = new Date(assignedEntry.changedAt);
            const resolvedTime = new Date(resolvedEntry.changedAt);
            if (resolvedTime > assignedTime) {
              tatMinutes = Math.floor((resolvedTime - assignedTime) / 60000);
            }
          }
          row[col] = formatMinutes(tatMinutes);
        } else {
          row[col] = getNested(item, col);
        }
      });
      return row;
    });

    // Create Excel file
    const workbook = await createExcelFile(columns, data);

    const filename = getReportFileName("service_request", filters);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
};

// ASSET REPORT
export const exportAssetReport = async (req, res) => {
  try {
    const { filters = {}, columns = [] } = req.body;

    // Build MongoDB query
    const query = {};
    if (filters.from || filters.to) {
      query.createdAt = {};
      if (filters.from) query.createdAt.$gte = new Date(filters.from);
      if (filters.to) query.createdAt.$lte = new Date(filters.to);
    }

    // Fetch data
    const assets = await AssetModel.find(query).lean();

    // Map data to selected columns
    const data = assets.map((item) => {
      const row = {};
      columns.forEach((col) => row[col] = getNested(item, col));
      return row;
    });

    // Create Excel file
    const workbook = await createExcelFile(columns, data);

    const filename = getReportFileName("asset", filters);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Export failed");
  }
};

