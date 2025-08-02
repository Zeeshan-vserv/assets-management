import IncidentModel from "../models/incidentModel.js";
import { HolidayCalenderModel, HolidayListModel, SLACreationModel, SLATimelineModel } from "../models/slaModel.js";

// Helper: Get all holiday dates from both HolidayList and HolidayCalender
async function getAllHolidayDates() {
  const holidayLists = await HolidayListModel.find();
  const holidayCalendars = await HolidayCalenderModel.find();
  const listDates = holidayLists.map(h => new Date(h.holidayDate).toISOString().slice(0, 10));
  const calendarDates = holidayCalendars.map(h => new Date(h.holidayDate).toISOString().slice(0, 10));
  return Array.from(new Set([...listDates, ...calendarDates]));
}

// Helper: Calculate SLA deadline (business hours logic) with holiday support
async function addBusinessTimeWithHoliday(startDate, hoursToAdd, slaTimeline) {
  const holidayDates = await getAllHolidayDates();
  let remainingMinutes = Math.round(hoursToAdd * 60);
  let current = new Date(startDate);

  function getBusinessWindow(date) {
    const weekDay = date.toLocaleString("en-US", { weekday: "long" });
    const slot = slaTimeline.find((s) => s.weekDay === weekDay);
    if (!slot || !slot.startTime || !slot.endTime) return null;
    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.endTime);
    if (isNaN(startTime) || isNaN(endTime)) return null;
    const start = new Date(date);
    start.setHours(startTime.getUTCHours(), startTime.getUTCMinutes(), 0, 0);
    const end = new Date(date);
    end.setHours(endTime.getUTCHours(), endTime.getUTCMinutes(), 0, 0);
    return { start, end };
  }

  while (remainingMinutes > 0) {
    const dateStr = current.toISOString().slice(0, 10);
    if (holidayDates.includes(dateStr)) {
      // Skip holiday
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
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

// Helper: Get business minutes between two dates with holiday support
async function getBusinessMinutesBetweenWithHoliday(now, end, slaTimeline) {
  const holidayDates = await getAllHolidayDates();
  let minutes = 0;
  let current = new Date(now);
  while (current < end) {
    const dateStr = current.toISOString().slice(0, 10);
    if (holidayDates.includes(dateStr)) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const weekDay = current.toLocaleString("en-US", { weekday: "long" });
    const slot = slaTimeline.find((s) => s.weekDay === weekDay);
    if (!slot || !slot.startTime || !slot.endTime) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.endTime);
    if (isNaN(startTime) || isNaN(endTime)) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const start = new Date(current);
    start.setHours(startTime.getUTCHours(), startTime.getUTCMinutes(), 0, 0);
    const endWindow = new Date(current);
    endWindow.setHours(endTime.getUTCHours(), endTime.getUTCMinutes(), 0, 0);
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

// Utility: Get IST Time
function getISTDate(date = new Date()) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
}

// Utility: Calculate TAT (Assigned to Resolved) in IST
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

// --- CONTROLLERS ---

export const getAllIncidentsSla = async (req, res) => {
  try {
    const incidents = await IncidentModel.find();
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find({}); // If you have multiple, filter as needed
    const businessHours = slaConfig?.slaTimeline || [];

    const results = await Promise.all(incidents.map(async (incident) => {
      const severity = incident?.classificaton?.severityLevel;
      if (!severity || !severity.trim()) {
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: "No severity set",
          slaRawMinutes: null,
        };
      }
      const severityMap = {
        "CRITICAL": "Severity-1",
        "HIGH": "Severity-2",
        "MEDIUM": "Severity-3",
        "LOW": "Severity-4"
      };
      const mappedSeverity = severityMap[severity?.toUpperCase().trim()] || severity.trim();
      const cleanSeverity = mappedSeverity.replace(/[\s\-]/g, "").toLowerCase().trim();

      // Find the matching timeline
      const matchedTimeline = slaTimelineData.find(
        (item) =>
          item.priority?.replace(/[\s\-]/g, "").toLowerCase().trim() === cleanSeverity
      );

      if (!matchedTimeline) {
        // Debug log to help you see what's happening
        console.log({
          incidentId: incident.incidentId,
          severity,
          mappedSeverity,
          cleanSeverity,
          priorities: slaTimelineData.map(i => i.priority),
          normalizedPriorities: slaTimelineData.map(i => i.priority?.replace(/[\s\-]/g, "").toLowerCase().trim())
        });
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: "Invalid SLA timeline",
          slaRawMinutes: null,
        };
      }
      const resolution = matchedTimeline?.resolutionSLA || "00:30";
      const [slaHours, slaMinutes] = resolution.split(":").map(Number);
      const totalHours = slaHours + slaMinutes / 60;

      const loggedInRaw = incident?.createdAt || incident?.submitter?.loggedInTime;
      const loggedIn = loggedInRaw ? new Date(loggedInRaw) : null;
      if (!loggedIn || isNaN(loggedIn)) {
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: "Invalid loggedIn date",
          slaRawMinutes: null,
        };
      }

      // Defensive: skip if businessHours is empty
      if (!Array.isArray(businessHours) || businessHours.length === 0) {
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: "No SLA timeline",
          slaRawMinutes: null,
        };
      }

      // SLA calculation with holiday logic
      let slaDeadline;
      try {
        slaDeadline = await addBusinessTimeWithHoliday(loggedIn, totalHours, businessHours);
        if (!slaDeadline || isNaN(slaDeadline)) throw new Error("Invalid SLA deadline");
      } catch (e) {
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: "Invalid SLA timeline",
          slaRawMinutes: null,
        };
      }

      const timeline = incident.statusTimeline || [];
      const latestStatus = timeline?.at(-1)?.status?.toLowerCase();
      let slaRemainingMinutes;
      if (latestStatus === "resolved") {
        const resolvedEntry = [...timeline].reverse().find(
          (t) => t.status?.toLowerCase() === "resolved"
        );
        const resolvedTime = resolvedEntry ? new Date(resolvedEntry.changedAt) : null;
        if (resolvedTime && !isNaN(resolvedTime)) {
          slaRemainingMinutes = resolvedTime < slaDeadline
            ? await getBusinessMinutesBetweenWithHoliday(resolvedTime, slaDeadline, businessHours)
            : -await getBusinessMinutesBetweenWithHoliday(slaDeadline, resolvedTime, businessHours);
        } else {
          slaRemainingMinutes = 0;
        }
      } else {
        const now = new Date();
        if (now < slaDeadline) {
          slaRemainingMinutes = await getBusinessMinutesBetweenWithHoliday(now, slaDeadline, businessHours);
        } else {
          slaRemainingMinutes = -await getBusinessMinutesBetweenWithHoliday(slaDeadline, now, businessHours);
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
    }));

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