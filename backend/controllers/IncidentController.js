import AuthModel from "../models/authModel.js";
import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";
import { SLACreationModel, SLATimelineModel } from "../models/slaModel.js";

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

export const getAllIncidentsSla = async (req, res) => {
  try {
    const incidents = await IncidentModel.find();
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find();
    const businessHours = slaConfig?.slaTimeline || [];

    const results = incidents.map((incident) => {
      const severity = incident?.classificaton?.severityLevel;
      const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
      const matchedTimeline = slaTimelineData.find(
        (item) =>
          item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
      );
      const resolution = matchedTimeline?.resolutionSLA || "00:30";
      const [slaHours, slaMinutes] = resolution.split(":").map(Number);
      const totalHours = slaHours + slaMinutes / 60;

      const loggedIn = new Date(
        incident?.createdAt || incident?.submitter?.loggedInTime
      );
      const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);

      const timeline = incident.statusTimeline || [];
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

      const formatMinutes = (minutes) => {
        if (minutes == null) return "N/A";
        const abs = Math.abs(minutes);
        const hr = Math.floor(abs / 60);
        const min = abs % 60;
        return `${hr} hr ${min} min`;
      };

      return {
        _id: incident._id,
        incidentId: incident.incidentId,
        sla: formatMinutes(slaRemainingMinutes),
        slaRawMinutes: slaRemainingMinutes,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: "Error calculating SLA for all incidents", error: error.message });
  }
};

export const getAllIncidentsTat = async (req, res) => {
  try {
    const incidents = await IncidentModel.find();

    const results = incidents.map((incident) => {
      const timeline = incident.statusTimeline || [];
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

      const formatMinutes = (minutes) => {
        if (minutes == null) return "N/A";
        const abs = Math.abs(minutes);
        const hr = Math.floor(abs / 60);
        const min = abs % 60;
        return `${hr} hr ${min} min`;
      };

      return {
        _id: incident._id,
        incidentId: incident.incidentId,
        tat: formatMinutes(tatMinutes),
        tatRawMinutes: tatMinutes,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: "Error calculating TAT for all incidents", error: error.message });
  }
};

export const getIncidentSla = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await IncidentModel.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    // ...SLA calculation logic (same as before, but only return SLA)...

    // Get SLA config and timeline
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find();
    const businessHours = slaConfig?.slaTimeline || [];
    const severity = incident?.classificaton?.severityLevel;
    const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
    const matchedTimeline = slaTimelineData.find(
      (item) =>
        item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
    );
    const resolution = matchedTimeline?.resolutionSLA || "00:30";
    const [slaHours, slaMinutes] = resolution.split(":").map(Number);
    const totalHours = slaHours + slaMinutes / 60;

    // SLA Deadline
    const loggedIn = new Date(
      incident?.createdAt || incident?.submitter?.loggedInTime
    );
    const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);

    // SLA Remaining (stopped at resolved)
    const timeline = incident.statusTimeline || [];
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

    // Format output
    const formatMinutes = (minutes) => {
      if (minutes == null) return "N/A";
      const abs = Math.abs(minutes);
      const hr = Math.floor(abs / 60);
      const min = abs % 60;
      return `${hr} hr ${min} min`;
    };

    res.json({
      success: true,
      sla: formatMinutes(slaRemainingMinutes),
      slaRawMinutes: slaRemainingMinutes,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating SLA", error: error.message });
  }
};

export const getIncidentTat = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await IncidentModel.findById(id);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    // TAT Calculation (assigned to resolved)
    const timeline = incident.statusTimeline || [];
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

    // Format output
    const formatMinutes = (minutes) => {
      if (minutes == null) return "N/A";
      const abs = Math.abs(minutes);
      const hr = Math.floor(abs / 60);
      const min = abs % 60;
      return `${hr} hr ${min} min`;
    };

    res.json({
      success: true,
      tat: formatMinutes(tatMinutes),
      tatRawMinutes: tatMinutes,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating TAT", error: error.message });
  }
};

// ✅ Utility: Get IST Time
// Convert date to IST
function getISTDate(date = new Date()) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
}

// ✅ Utility: Calculate TAT (Assigned to Resolved) in IST
function calculateTAT(assignedAt, resolvedAt) {
  const start = getISTDate(new Date(assignedAt));
  const end = getISTDate(new Date(resolvedAt));
  const diffMs = end - start;

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(diffMins / (60 * 24));
  const hours = Math.floor((diffMins % (60 * 24)) / 60);
  const mins = diffMins % 60;

  return `${days} days ${hours} hours ${mins} mins`;
}

// Calculate SLA deadline
function calculateSLADeadline(loggedInTime, slaHours, slaTimeline = [], serviceWindow = true) {
  if (serviceWindow) {
    return new Date(loggedInTime.getTime() + slaHours * 60 * 60 * 1000);
  } else {
    let remainingHours = slaHours;
    let current = dayjs(loggedInTime);
    let deadline = current;

    while (remainingHours > 0) {
      const weekday = deadline.format('dddd');
      const slot = slaTimeline.find(s => s.weekDay === weekday);

      if (slot) {
        const workStart = dayjs(deadline.format('YYYY-MM-DD') + 'T' + dayjs(slot.startTime).format('HH:mm'));
        const workEnd = dayjs(deadline.format('YYYY-MM-DD') + 'T' + dayjs(slot.endTime).format('HH:mm'));

        if (deadline.isBefore(workEnd)) {
          const available = Math.max(0, workEnd.diff(dayjs.max(deadline, workStart), 'hour', true));
          const used = Math.min(available, remainingHours);
          remainingHours -= used;
          deadline = deadline.add(used, 'hour');
        }
      }

      if (remainingHours > 0) {
        deadline = deadline.add(1, 'day').startOf('day');
      }
    }

    return deadline.toDate();
  }
}

export const createIncident = async (req, res) => {
  try {
    const { userId, ...incidentData } = req.body;
    if (!userId) return res.status(404).json({ message: "User not found" });

    const user = await AuthModel.findById(userId);

    // Parse possible JSON fields
    let submitter = typeof incidentData.submitter === "string" ? JSON.parse(incidentData.submitter) : incidentData.submitter;
    let assetDetails = typeof incidentData.assetDetails === "string" ? JSON.parse(incidentData.assetDetails) : incidentData.assetDetails;
    let locationDetails = typeof incidentData.locationDetails === "string" ? JSON.parse(incidentData.locationDetails) : incidentData.locationDetails;
    let classificaton = typeof incidentData.classificaton === "string" ? JSON.parse(incidentData.classificaton) : incidentData.classificaton;

    // Determine status based on technician field
    let status = "New";
    if (classificaton?.technician && classificaton.technician.trim() !== "") {
      status = "Assigned";
    } else if (incidentData.status) {
      status = incidentData.status;
    }

    let attachmentPath = "";
    if (req.file) {
      attachmentPath = req.file.path;
    }

    // Generate incident ID
    const counter = await IncidentCounterModel.findOneAndUpdate(
      { name: "incident" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const now = getISTDate();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}`;
    const newIncidentId = `INC${dateStr}${counter.seq}`;

    // Fill submitter defaults
    submitter = {
      user: submitter?.user || user?.employeeName || "",
      userContactNumber: submitter?.userContactNumber || user?.mobileNumber || "",
      userId: submitter?.userId || user?.userId || "",
      userEmail: submitter?.userEmail || user?.emailAddress || "",
      userDepartment: submitter?.userDepartment || user?.department || "",
      loggedBy: submitter?.loggedBy || user?.employeeName || "",
      loggedInTime: submitter?.loggedInTime ? getISTDate(new Date(submitter.loggedInTime)) : now,
    };

    // Fill location defaults
    locationDetails = {
      location: locationDetails?.location || user?.location || "",
      subLocation: locationDetails?.subLocation || user?.subLocation || "",
      floor: locationDetails?.floor || user?.floor || "",
      roomNo: locationDetails?.roomNo || user?.roomNo || "",
    };

    // SLA Calculation
    const severity = classificaton?.severityLevel || "";
    let resolutionHours = 24;
    let slaTimeline = [];
    let serviceWindow = true;

    if (severity) {
      const cleanSeverity = severity.replace(/[\s\-]/g, "").toLowerCase();
      const allTimelines = await SLATimelineModel.find();
      const matched = allTimelines.find(t =>
        t.priority.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
      );
      if (matched?.resolutionSLA) {
        const [h, m] = matched.resolutionSLA.split(":").map(Number);
        resolutionHours = h + m / 60;
      }
    }

    const slaConfig = await SLACreationModel.findOne({ default: true });
    if (slaConfig) {
      serviceWindow = slaConfig.serviceWindow;
      slaTimeline = slaConfig.slaTimeline || [];
    }

    const slaDeadline = calculateSLADeadline(submitter.loggedInTime, resolutionHours, slaTimeline, serviceWindow);

    // Save Incident
    const newIncident = new IncidentModel({
      userId,
      incidentId: newIncidentId,
      subject: incidentData.subject,
      category: incidentData.category,
      subCategory: incidentData.subCategory,
      loggedVia: incidentData.loggedVia,
      description: incidentData.description,
      status,
      sla: slaDeadline,
      isSla: true,
      tat: incidentData.tat || "",
      feedback: incidentData.feedback,
      attachment: attachmentPath,
      submitter,
      assetDetails,
      locationDetails,
      classificaton,
      statusTimeline: [
        {
          status,
          changedAt: now,
          changedBy: userId,
        },
      ],
    });

    await newIncident.save();

    res.status(201).json({
      success: true,
      data: newIncident,
      message: "Incident created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred while creating incident",
      error: error.message,
    });
  }
};

export const getAllIncident = async (req, res) => {
    try {
        const incident = await IncidentModel.find()
        res.status(200).json({ success: true, data: incident })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching incidents' });
    }
}

export const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params
        const incident = await IncidentModel.findById(id)

        if (!incident) {
            return res.status(404).json({ success: false, message: 'Incident Id not found' })
        }
        res.status(200).json({ success: true, data: incident })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching incident' });
    }
}

export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, changedBy, ...otherFields } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const incident = await IncidentModel.findById(id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident Id not found' });
    }

    // Track changes in other fields
    const fieldChanges = {};
    Object.keys(otherFields).forEach((key) => {
      if (incident[key] !== undefined && incident[key] !== otherFields[key]) {
        fieldChanges[key] = { from: incident[key], to: otherFields[key] };
        incident[key] = otherFields[key];
      }
    });

    // Track status change (always push to timeline, even if same status)
    incident.statusTimeline.push({
      status,
      changedAt: getISTDate(),
      changedBy
    });
    incident.status = status;
    let statusChanged = true;

    // ✅ TAT Calculation: If status is "Resolved", calculate TAT from latest "Assigned" to latest "Resolved"
    if (status.toLowerCase() === "resolved") {
      const timeline = incident.statusTimeline;
      const assignedEntry = [...timeline].reverse().find(e => e.status?.toLowerCase() === "assigned");
      const resolvedEntry = [...timeline].reverse().find(e => e.status?.toLowerCase() === "resolved");
      if (assignedEntry && resolvedEntry) {
        const tat = calculateTAT(assignedEntry.changedAt, resolvedEntry.changedAt);
        incident.tat = tat;
      } else {
        incident.tat = "N/A";
      }
      incident.isResolved = true;
    } else {
      incident.isResolved = false;
    }

    // Push field changes if any
    if (Object.keys(fieldChanges).length > 0) {
      incident.fieldChangeHistory.push({
        changes: fieldChanges,
        changedAt: getISTDate(),
        changedBy
      });
    }

    await incident.save();
    res.status(200).json({ success: true, data: incident, message: 'Incident updated and lifecycle recorded' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating incident', error: error.message });
  }
};

export const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params
        const deletedIncident = await IncidentModel.findByIdAndDelete(id)

        if (!deletedIncident) {
            return res.status(404).json({ success: false, message: 'Incident Id not found' })
        }
        res.status(200).json({ success: true, message: 'Incident deleted successfullly' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting incident' })
    }
}