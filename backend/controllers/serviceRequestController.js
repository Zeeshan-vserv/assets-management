import AuthModel from "../models/authModel.js";
import ServiceCounterModel from "../models/serviceCounterModel.js";
import ServiceRequestModel from "../models/serviceRequestModel.js";
import { SLACreationModel, SLATimelineModel, HolidayListModel, HolidayCalenderModel } from "../models/slaModel.js";

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
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);
    const start = new Date(date);
    start.setHours(startHour, startMinute, 0, 0);
    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);
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
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const [endHour, endMinute] = slot.endTime.split(":").map(Number);
    const start = new Date(current);
    start.setHours(startHour, startMinute, 0, 0);
    const endWindow = new Date(current);
    endWindow.setHours(endHour, endMinute, 0, 0);
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

export const getAllServiceSla = async (req, res) => {
  try {
    const services = await ServiceRequestModel.find();
    const slaConfig = await SLACreationModel.findOne({ default: true });
    const slaTimelineData = await SLATimelineModel.find();
    const businessHours = slaConfig?.slaTimeline || [];

    const results = services.map((service) => {
      const severity = service?.classificaton?.severityLevel;
      const cleanSeverity = severity?.replace(/[\s\-]/g, "").toLowerCase();
      const matchedTimeline = slaTimelineData.find(
        (item) =>
          item.priority?.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
      );
      const resolution = matchedTimeline?.resolutionSLA || "00:30";
      const [slaHours, slaMinutes] = resolution.split(":").map(Number);
      const totalHours = slaHours + slaMinutes / 60;

      const loggedIn = new Date(
        service?.createdAt || service?.submitter?.loggedInTime
      );
      const slaDeadline = addBusinessTime(loggedIn, totalHours, businessHours);

      const timeline = service.statusTimeline || [];
      const latestStatus = timeline?.at(-1)?.status?.toLowerCase();
      let slaRemainingMinutes;
      if (latestStatus === "resolved") {
        const resolvedEntry = [...timeline]
          .reverse()
          .find((t) => t.status?.toLowerCase() === "resolved");
        const resolvedTime = resolvedEntry
          ? new Date(resolvedEntry.changedAt)
          : null;
        if (resolvedTime) {
          slaRemainingMinutes =
            resolvedTime < slaDeadline
              ? getBusinessMinutesBetween(
                  resolvedTime,
                  slaDeadline,
                  businessHours
                )
              : -getBusinessMinutesBetween(
                  slaDeadline,
                  resolvedTime,
                  businessHours
                );
        } else {
          slaRemainingMinutes = 0;
        }
      } else {
        const now = new Date();
        if (now < slaDeadline) {
          slaRemainingMinutes = getBusinessMinutesBetween(
            now,
            slaDeadline,
            businessHours
          );
        } else {
          slaRemainingMinutes = -getBusinessMinutesBetween(
            slaDeadline,
            now,
            businessHours
          );
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
        _id: service._id,
        serviceId: service.serviceId,
        sla: formatMinutes(slaRemainingMinutes),
        slaRawMinutes: slaRemainingMinutes,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error calculating SLA for all services",
        error: error.message,
      });
  }
};

export const getAllServicesTat = async (req, res) => {
  try {
    const services = await ServiceRequestModel.find();

    const results = services.map((service) => {
      const timeline = service.statusTimeline || [];
      const assignedEntry = [...timeline]
        .reverse()
        .find((t) => t.status?.toLowerCase() === "assigned");
      const resolvedEntry = [...timeline]
        .reverse()
        .find((t) => t.status?.toLowerCase() === "resolved");
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
        _id: service._id,
        serviceId: service.serviceId,
        tat: formatMinutes(tatMinutes),
        tatRawMinutes: tatMinutes,
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error calculating TAT for all services",
        error: error.message,
      });
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
function calculateSLADeadline(
  loggedInTime,
  slaHours,
  slaTimeline = [],
  serviceWindow = true
) {
  if (serviceWindow) {
    return new Date(loggedInTime.getTime() + slaHours * 60 * 60 * 1000);
  } else {
    let remainingHours = slaHours;
    let current = dayjs(loggedInTime);
    let deadline = current;

    while (remainingHours > 0) {
      const weekday = deadline.format("dddd");
      const slot = slaTimeline.find((s) => s.weekDay === weekday);

      if (slot) {
        const workStart = dayjs(
          deadline.format("YYYY-MM-DD") +
            "T" +
            dayjs(slot.startTime).format("HH:mm")
        );
        const workEnd = dayjs(
          deadline.format("YYYY-MM-DD") +
            "T" +
            dayjs(slot.endTime).format("HH:mm")
        );

        if (deadline.isBefore(workEnd)) {
          const available = Math.max(
            0,
            workEnd.diff(dayjs.max(deadline, workStart), "hour", true)
          );
          const used = Math.min(available, remainingHours);
          remainingHours -= used;
          deadline = deadline.add(used, "hour");
        }
      }

      if (remainingHours > 0) {
        deadline = deadline.add(1, "day").startOf("day");
      }
    }

    return deadline.toDate();
  }
}

export const createServiceRequest = async (req, res) => {
  try {
    const { userId, ...serviceRequestData } = req.body;
    if (!userId) return res.status(404).json({ message: "User not found" });

    const user = await AuthModel.findById(userId);

    // Parse possible JSON fields
    let submitter =
      typeof serviceRequestData.submitter === "string"
        ? JSON.parse(serviceRequestData.submitter)
        : serviceRequestData.submitter;
    let assetDetails =
      typeof serviceRequestData.assetDetails === "string"
        ? JSON.parse(serviceRequestData.assetDetails)
        : serviceRequestData.assetDetails;
    let locationDetails =
      typeof serviceRequestData.locationDetails === "string"
        ? JSON.parse(serviceRequestData.locationDetails)
        : serviceRequestData.locationDetails;
    let classificaton =
      typeof serviceRequestData.classificaton === "string"
        ? JSON.parse(serviceRequestData.classificaton)
        : serviceRequestData.classificaton;

    // Determine status based on technician field
    let status = "New";
    if (classificaton?.technician && classificaton.technician.trim() !== "") {
      status = "Assigned";
    } else if (serviceRequestData.status) {
      status = serviceRequestData.status;
    }

    let attachmentPath = "";
    if (req.file) {
      attachmentPath = req.file.path;
    }

    // Generate service ID
    const counter = await ServiceCounterModel.findOneAndUpdate(
      { name: "service" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const now = getISTDate();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${now.getFullYear()}`;
    const newServiceRequestId = `SER${dateStr}${counter.seq}`;

    // Fill submitter defaults
    submitter = {
      user: submitter?.user || user?.employeeName || "",
      userId: submitter?.userId || user?.userId || "",
      userEmail: submitter?.userEmail || user?.emailAddress || "",
      loggedBy: submitter?.loggedBy || user?.employeeName || "",
      loggedInTime: submitter?.loggedInTime
        ? getISTDate(new Date(submitter.loggedInTime))
        : now,
    };

    // Fill location defaults
    locationDetails = {
      location: locationDetails?.location || user?.location || "",
      subLocation: locationDetails?.subLocation || user?.subLocation || "",
    };

    // SLA Calculation
    const severity = classificaton?.severityLevel || "";
    let resolutionHours = 24;
    let slaTimeline = [];
    let serviceWindow = true;

    if (severity) {
      const cleanSeverity = severity.replace(/[\s\-]/g, "").toLowerCase();
      const allTimelines = await SLATimelineModel.find();
      const matched = allTimelines.find(
        (t) => t.priority.replace(/[\s\-]/g, "").toLowerCase() === cleanSeverity
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

    const slaDeadline = calculateSLADeadline(
      submitter.loggedInTime,
      resolutionHours,
      slaTimeline,
      serviceWindow
    );

    const approvalStatusArr = [];
    if (serviceRequestData.approver1) {
      approvalStatusArr.push({
        approver: serviceRequestData.approver1,
        level: 1,
        status: "Pending"
      });
    }

    // Save Service Request
    const newServiceRequest = new ServiceRequestModel({
      userId,
      serviceId: newServiceRequestId,
      subject: serviceRequestData.subject,
      category: serviceRequestData.category,
      subCategory: serviceRequestData.subCategory,
      loggedVia: serviceRequestData.loggedVia,
      description: serviceRequestData.description,
      status,
      sla: slaDeadline,
      isSla: true,
      tat: serviceRequestData.tat || "",
      feedback: serviceRequestData.feedback,
      attachment: attachmentPath,
      submitter,
      assetDetails,
      locationDetails,
      classificaton,
      approval: serviceRequestData.approval || false,
      approver1: serviceRequestData.approver1 || "",
      approver2: serviceRequestData.approver2 || "",
      approver3: serviceRequestData.approver3 || "",
      statusTimeline: [
        {
          status,
          changedAt: now,
          changedBy: userId,
        },
      ],
      approvalStatus: approvalStatusArr,
    });

    await newServiceRequest.save();

    res.status(201).json({
      success: true,
      data: newServiceRequest,
      message: "Service Request created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred while creating service request",
      error: error.message,
    });
  }
};

export const getAllServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequestModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: serviceRequests });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching service requests" });
  }
};

export const getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceRequest = await ServiceRequestModel.findById(id).sort({ createdAt: -1 });

    if (!serviceRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Service Request Id not found" });
    }
    res.status(200).json({ success: true, data: serviceRequest });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching service request" });
  }
};

export const getServiceRequestByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log("Incoming userId:", userId);

    const services = await ServiceRequestModel.find({ userId }).sort({ createdAt: -1 });
    // console.log("Query result:", incidents);

    if (!services || services.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No service request related to this user" });
    }

    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching services by userId:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching services" });
  }
};

export const updateServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, changedBy, ...otherFields } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const serviceRequest = await ServiceRequestModel.findById(id);
    if (!serviceRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Service Request Id not found" });
    }

    // Track changes in other fields
    const fieldChanges = {};
    Object.keys(otherFields).forEach((key) => {
      if (
        serviceRequest[key] !== undefined &&
        serviceRequest[key] !== otherFields[key]
      ) {
        fieldChanges[key] = { from: serviceRequest[key], to: otherFields[key] };
        serviceRequest[key] = otherFields[key];
      }
    });

    // Track status change (always push to timeline, even if same status)
    serviceRequest.statusTimeline.push({
      status,
      changedAt: getISTDate(),
      changedBy,
    });
    serviceRequest.status = status;
    let statusChanged = true;

    // ✅ TAT Calculation: If status is "Resolved", calculate TAT from latest "Assigned" to latest "Resolved"
    if (status.toLowerCase() === "resolved") {
      const timeline = serviceRequest.statusTimeline;
      const assignedEntry = [...timeline]
        .reverse()
        .find((e) => e.status?.toLowerCase() === "assigned");
      const resolvedEntry = [...timeline]
        .reverse()
        .find((e) => e.status?.toLowerCase() === "resolved");
      if (assignedEntry && resolvedEntry) {
        const tat = calculateTAT(
          assignedEntry.changedAt,
          resolvedEntry.changedAt
        );
        serviceRequest.tat = tat;
      } else {
        serviceRequest.tat = "N/A";
      }
      serviceRequest.isResolved = true;
    } else {
      serviceRequest.isResolved = false;
    }

    // Push field changes if any
    if (Object.keys(fieldChanges).length > 0) {
      serviceRequest.fieldChangeHistory.push({
        changes: fieldChanges,
        changedAt: getISTDate(),
        changedBy,
      });
    }

    await serviceRequest.save();
    res
      .status(200)
      .json({
        success: true,
        data: serviceRequest,
        message: "Service Request updated and lifecycle recorded",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while updating service request",
        error: error.message,
      });
  }
};

export const deleteServiceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedServiceRequest = await ServiceRequestModel.findByIdAndDelete(
      id
    );

    if (!deletedServiceRequest) {
      return res
        .status(404)
        .json({ success: false, message: "Service Request Id not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Service Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "An error occurred while deleting service request",
        error: error.message,
      });
  }
};

export const approveServiceRequest = async (req, res) => {
  try {
    const { id } = req.params; // ServiceRequest ID
    const { action, remarks } = req.body; // action: "Approved" or "Rejected"
    const approver = req.user.emailAddress;

    const serviceRequest = await ServiceRequestModel.findById(id);
    if (!serviceRequest) {
      return res.status(404).json({ message: "Service Request not found" });
    }

    // Find current pending approval
    const currentApproval = serviceRequest.approvalStatus.find(a => a.status === "Pending");
    if (!currentApproval || currentApproval.approver !== approver) {
      return res.status(400).json({ message: "Not authorized or already acted" });
    }

    // Update status
    currentApproval.status = action;
    currentApproval.actionAt = new Date();
    currentApproval.remarks = remarks;

    // If approved and next approver exists, set next to Pending
    if (action === "Approved") {
      const nextLevel = currentApproval.level + 1;
      const nextApproverField = `approver${nextLevel}`;
      const nextApprover = serviceRequest[nextApproverField];
      if (nextApprover) {
        serviceRequest.approvalStatus.push({
          approver: nextApprover,
          level: nextLevel,
          status: "Pending"
        });
      } else {
        // All approvals done
        serviceRequest.approval = true;
      }
    } else if (action === "Rejected") {
      serviceRequest.approval = false;
    }

    await serviceRequest.save();
    res.json({ success: true, data: serviceRequest });
  } catch (error) {
    res.status(500).json({ message: "Error in approval", error: error.message });
  }
};

export const getServiceRequestStatusCounts = async (req, res) => {
  try {
    const statusList = [
      "New",
      "Approval Pending",
      "Provisioning",
      "Assigned",
      "In-Progress",
      "Hold",
      "Cancelled",
      "Rejected",
      "Resolved",
      "Closed",
      "Waiting for Update",
      "Coverte to Incident"
    ];

    // Aggregate to get latest status from statusTimeline
    const pipeline = [
      {
        $addFields: {
          latestStatus: { $arrayElemAt: ["$statusTimeline.status", -1] }
        }
      },
      {
        $group: {
          _id: "$latestStatus",
          count: { $sum: 1 }
        }
      }
    ];

    const results = await ServiceRequestModel.aggregate(pipeline);

    // Map results to statusList
    const counts = {};
    statusList.forEach(status => {
      const found = results.find(r => r._id === status);
      counts[status] = found ? found.count : 0;
    });

    // Total count
    counts["Total"] = await ServiceRequestModel.countDocuments();

    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status counts", error: error.message });
  }
};

export const getMyPendingApprovals = async (req, res) => {
  try {
    const myEmail = req.user.emailAddress;

    const requests = await ServiceRequestModel.aggregate([
      {
        $addFields: {
          lastApproval: { $arrayElemAt: ["$approvalStatus", -1] }
        }
      },
      {
        $match: {
          "lastApproval": { $ne: null },
          "lastApproval.approver": myEmail,
          "lastApproval.status": "Pending"
        }
      }
    ]);

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching my pending approvals", error: error.message });
  }
};