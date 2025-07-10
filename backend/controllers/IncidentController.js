import AuthModel from "../models/authModel.js";
import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";
import { SLACreationModel, SLATimelineModel } from "../models/slaModel.js";


// ✅ Utility: Get IST Time
// Convert date to IST
function getISTDate(date = new Date()) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
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

    let attachmentPath = "";
    if (req.file) {
      attachmentPath = req.file.path;
    }

    const counter = await IncidentCounterModel.findOneAndUpdate(
      { name: "incident" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const now = getISTDate();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}${now.getFullYear()}`;
    const newIncidentId = `INC${dateStr}${counter.seq}`;

    let submitter = typeof incidentData.submitter === "string" ? JSON.parse(incidentData.submitter) : incidentData.submitter;
    let assetDetails = typeof incidentData.assetDetails === "string" ? JSON.parse(incidentData.assetDetails) : incidentData.assetDetails;
    let locationDetails = typeof incidentData.locationDetails === "string" ? JSON.parse(incidentData.locationDetails) : incidentData.locationDetails;
    let classificaton = typeof incidentData.classificaton === "string" ? JSON.parse(incidentData.classificaton) : incidentData.classificaton;

    const loggedInTime = submitter?.loggedInTime ? getISTDate(new Date(submitter.loggedInTime)) : now;

    submitter = {
      user: submitter?.user || user?.employeeName || "",
      userContactNumber: submitter?.userContactNumber || user?.mobileNumber || "",
      userId: submitter?.userId || user?.userId || "",
      userEmail: submitter?.userEmail || user?.emailAddress || "",
      userDepartment: submitter?.userDepartment || user?.department || "",
      loggedBy: submitter?.loggedBy || user?.employeeName || "",
      loggedInTime: loggedInTime,
    };

    locationDetails = {
      location: locationDetails?.location || user?.location || "",
      subLocation: locationDetails?.subLocation || user?.subLocation || "",
      floor: locationDetails?.floor || user?.floor || "",
      roomNo: locationDetails?.roomNo || user?.roomNo || "",
    };

    // ✅ SLA Calculation
    const severity = classificaton?.severityLevel || "";
    let resolutionHours = 24; // default
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

    const slaDeadline = calculateSLADeadline(loggedInTime, resolutionHours, slaTimeline, serviceWindow);

    // Save Incident
    const newIncident = new IncidentModel({
      userId,
      incidentId: newIncidentId,
      subject: incidentData.subject,
      category: incidentData.category,
      subCategory: incidentData.subCategory,
      loggedVia: incidentData.loggedVia,
      description: incidentData.description,
      status: incidentData.status || "New",
      sla: slaDeadline,
      isSla: true,
      tat: incidentData.tat || "",
      feedback: incidentData.feedback || "",
      attachment: attachmentPath,
      submitter,
      assetDetails,
      locationDetails,
      classificaton,
      statusTimeline: [
        {
          status: "New",
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

        // Track status change0
        let statusChanged = false;
        if (incident.status !== status) {
            statusChanged = true;
            incident.statusTimeline.push({
                status,
                changedAt: new Date(),
                changedBy
            });
            incident.status = status;
        }

        // Push field changes if any
        if (Object.keys(fieldChanges).length > 0) {
            incident.fieldChangeHistory.push({
                changes: fieldChanges,
                changedAt: new Date(),
                changedBy
            });
        }

        // If nothing changed, do not save
        if (!statusChanged && Object.keys(fieldChanges).length === 0) {
            return res.status(200).json({ success: true, data: incident, message: 'No changes detected' });
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