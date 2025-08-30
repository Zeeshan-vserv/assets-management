import { SLACreationModel, SLATimelineModel } from "../models/slaModel.js";
import { HolidayListModel, HolidayCalenderModel } from "../models/slaModel.js";

// --- Shared Holiday Logic ---
async function getAllHolidayDates() {
  const holidayLists = await HolidayListModel.find();
  const holidayCalendars = await HolidayCalenderModel.find();
  const listDates = holidayLists
    .filter(h => h.holidayDate)
    .map(h => {
      const d = new Date(h.holidayDate);
      return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
    })
    .filter(Boolean);
  const calendarDates = holidayCalendars
    .filter(h => h.holidayDate)
    .map(h => {
      const d = new Date(h.holidayDate);
      return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
    })
    .filter(Boolean);
  return Array.from(new Set([...listDates, ...calendarDates]));
}

// --- Shared Business Time Logic ---
function getBusinessWindow(date, slaTimeline) {
  const weekDay = date.toLocaleString("en-US", { weekday: "long" });
  const slot = slaTimeline.find((s) => s.weekDay === weekDay);
  if (!slot || !slot.startTime || !slot.endTime) return null;

  const getTimeString = (t) =>
    typeof t === "string"
      ? t
      : t instanceof Date
      ? t.toISOString().substr(11, 5)
      : "";

  const [startHour, startMinute] = getTimeString(slot.startTime).split(":").map(Number);
  const [endHour, endMinute] = getTimeString(slot.endTime).split(":").map(Number);

  // Defensive: Check for NaN
  if (
    [startHour, startMinute, endHour, endMinute].some(
      (v) => Number.isNaN(v) || v === undefined
    )
  ) {
    console.error(
      "Invalid business window time:",
      slot.startTime,
      slot.endTime,
      "parsed as",
      startHour,
      startMinute,
      endHour,
      endMinute
    );
    return null;
  }

  const start = new Date(date);
  start.setHours(startHour, startMinute, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, endMinute, 0, 0);
  return { start, end };
}

async function addBusinessTimeWithHoliday(startDate, hoursToAdd, slaTimeline) {
  const holidayDates = await getAllHolidayDates();
  let remainingMinutes = Math.round(hoursToAdd * 60);
  let current = new Date(startDate);

  if (isNaN(current.getTime())) {
    throw new Error("Invalid start date for SLA calculation");
  }

  while (remainingMinutes > 0) {
    const dateStr = current.toISOString().slice(0, 10);
    if (holidayDates.includes(dateStr)) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const window = getBusinessWindow(current, slaTimeline);
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

async function getBusinessMinutesBetweenWithHoliday(now, end, slaTimeline) {
  const holidayDates = await getAllHolidayDates();
  let minutes = 0;
  let current = new Date(now);
  if (isNaN(current.getTime()) || isNaN(new Date(end).getTime())) {
    throw new Error("Invalid date in business minutes calculation");
  }
  while (current < end) {
    const dateStr = current.toISOString().slice(0, 10);
    if (holidayDates.includes(dateStr)) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    const window = getBusinessWindow(current, slaTimeline);
    if (!window) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    if (current >= window.end) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }
    if (current < window.start) current = new Date(window.start);
    const until = end < window.end ? end : window.end;
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

// --- SLA String Parser ---
export function parseSlaString(slaStr) {
  if (!slaStr) return { days: 0, hours: 0, minutes: 0, totalMinutes: 0, totalHours: 0 };
  const parts = slaStr.split(":").map(s => Number(s.replace(/^0+(\d)$/, '$1')));
  let days = 0, hours = 0, minutes = 0;
  if (parts.length === 3) {
    [days, hours, minutes] = parts;
  } else if (parts.length === 2) {
    [hours, minutes] = parts;
  } else if (parts.length === 1) {
    [minutes] = parts;
  }
  days = Number.isNaN(days) ? 0 : days;
  hours = Number.isNaN(hours) ? 0 : hours;
  minutes = Number.isNaN(minutes) ? 0 : minutes;
  return {
    days,
    hours,
    minutes,
    totalMinutes: days * 24 * 60 + hours * 60 + minutes,
    totalHours: days * 24 + hours + minutes / 60,
  };
}

// --- Incident SLA Logic ---
export async function calculateIncidentSLA(incident) {
  const slaConfig = await SLACreationModel.findOne({ default: true, type: "incident" });
  if (!slaConfig) throw new Error("No SLA config found for incidents");
  const slaTimelineData = await SLATimelineModel.find({ type: "incident" });
  const businessHours = slaConfig?.slaTimeline || [];
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    throw new Error("No business hours defined in SLA config");
  }

  const severity = incident?.classificaton?.severityLevel;
  if (!severity) throw new Error("Incident severityLevel is missing");
  const cleanSeverity = severity.replace(/[\s\-]/g, "").toLowerCase();
  const matchedTimeline = slaTimelineData.find(
    (item) =>
      item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
  );
  if (!matchedTimeline) throw new Error("No SLA timeline matched for severity: " + severity);
  const resolution = matchedTimeline.resolutionSLA || "0:00:30";
  const { totalHours } = parseSlaString(resolution);

  const loggedIn = new Date(
    incident?.createdAt || incident?.submitter?.loggedInTime
  );
  if (isNaN(loggedIn.getTime())) throw new Error("Invalid incident date");

  const slaDeadline = await addBusinessTimeWithHoliday(loggedIn, totalHours, businessHours);

  // SLA Remaining (stopped at resolved)
  const timeline = (incident.statusTimeline || []).filter(
    t => t && typeof t.status === "string" && t.changedAt
  );
  const latestStatus = timeline.length ? timeline.at(-1).status.toLowerCase() : undefined;
  let slaRemainingMinutes;
  if (latestStatus === "resolved") {
    const resolvedEntry = [...timeline].reverse().find(
      (t) => t.status?.toLowerCase() === "resolved"
    );
    const resolvedTime = resolvedEntry && resolvedEntry.changedAt ? new Date(resolvedEntry.changedAt) : null;
    if (resolvedTime && !isNaN(resolvedTime.getTime())) {
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

  return {
    slaDeadline,
    slaRemainingMinutes,
    sla: formatMinutes(slaRemainingMinutes),
  };
}

// --- Service Request SLA Logic ---
export async function calculateServiceRequestSLA(serviceRequest) {
  const slaConfig = await SLACreationModel.findOne({ default: true, type: "service" });
  if (!slaConfig) throw new Error("No SLA config found for service requests");
  const slaTimelineData = await SLATimelineModel.find({ type: "service" });
  const businessHours = slaConfig?.slaTimeline || [];
  if (!Array.isArray(businessHours) || businessHours.length === 0) {
    throw new Error("No business hours defined in SLA config");
  }

  const priority = serviceRequest?.classificaton?.priorityLevel;
  if (!priority) throw new Error("Service request priorityLevel is missing");
  const cleanPriority = priority.replace(/[\s\-]/g, "").toLowerCase();
  const matchedTimeline = slaTimelineData.find(
    (item) =>
      item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanPriority
  );
  if (!matchedTimeline) throw new Error("No SLA timeline matched for priority: " + priority);
  const resolution = matchedTimeline.resolutionSLA || "0:01:00";
  const { totalHours } = parseSlaString(resolution);

  const loggedIn = new Date(
    serviceRequest?.createdAt || serviceRequest?.submitter?.loggedInTime
  );
  if (isNaN(loggedIn.getTime())) throw new Error("Invalid service request date");

  const slaDeadline = await addBusinessTimeWithHoliday(loggedIn, totalHours, businessHours);

  // SLA Remaining (stopped at resolved)
  const timeline = (serviceRequest.statusTimeline || []).filter(
    t => t && typeof t.status === "string" && t.changedAt
  );
  const latestStatus = timeline.length ? timeline.at(-1).status.toLowerCase() : undefined;
  let slaRemainingMinutes;
  if (latestStatus === "resolved") {
    const resolvedEntry = [...timeline].reverse().find(
      (t) => t.status?.toLowerCase() === "resolved"
    );
    const resolvedTime = resolvedEntry && resolvedEntry.changedAt ? new Date(resolvedEntry.changedAt) : null;
    if (resolvedTime && !isNaN(resolvedTime.getTime())) {
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

  return {
    slaDeadline,
    slaRemainingMinutes,
    sla: formatMinutes(slaRemainingMinutes),
  };
}

// --- Helper ---
function formatMinutes(minutes) {
  if (minutes == null) return "N/A";
  const abs = Math.abs(minutes);
  const days = Math.floor(abs / (60 * 24));
  const hr = Math.floor((abs % (60 * 24)) / 60);
  const min = abs % 60;
  let result = "";
  if (days) result += `${days} day${days > 1 ? "s" : ""} `;
  if (hr) result += `${hr} hr `;
  result += `${min} min`;
  return result.trim();
}