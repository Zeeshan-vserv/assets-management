import AuthModel from "../models/authModel.js";
import { IncidentAutoCloseModel } from "../models/globalIncidentModels.js";
import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";
import { HolidayListModel } from "../models/slaModel.js";
import { getEmailById, getEmailsByRole, sendAssignedIncidentMail, sendNewIncidentMail, sendIncidentStatusChangeMail } from "../utils/mailSystem.js";
import { addIncidentToUserHistory } from "./AuthController.js";
import { calculateIncidentSLA } from "../utils/slaUtils.js";

// --- CONTROLLERS ---

export const getAllIncidentsSla = async (req, res) => {
  try {
    const incidents = await IncidentModel.find();
    const results = await Promise.all(
      incidents.map(async (incident) => {
        const slaResult = await calculateIncidentSLA(incident);
        return {
          _id: incident._id,
          incidentId: incident.incidentId,
          sla: slaResult.sla,
          slaRawMinutes: slaResult.slaRemainingMinutes,
        };
      })
    );
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

    const slaResult = await calculateIncidentSLA(incident);

    res.json({
      success: true,
      sla: slaResult.sla,
      slaRawMinutes: slaResult.slaRemainingMinutes,
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
function getISTDate(date = new Date()) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
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
    const dateStr = `${String(now.getDate()).padStart(2, "0")}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${now.getFullYear()}`;
    const newIncidentId = `INC${dateStr}${counter.seq}`;

    // Fill submitter defaults
    submitter = {
      user: submitter?.user || user?.employeeName || "",
      userContactNumber:
        submitter?.userContactNumber || user?.mobileNumber || "",
      userId: submitter?.userId || user?.userId || user?._id.toString() || "",
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
    await addIncidentToUserHistory(userId, newIncident._id, newIncident.status);

    // ...after saving newIncident and updating user history...
    const adminEmails = await getEmailsByRole("Admin");
    const superAdminEmails = await getEmailsByRole("SuperAdmin");
    let technicianEmail = "";
    if (classificaton?.technician && classificaton.technician.trim() !== "") {
      technicianEmail = await getEmailById(classificaton.technician);
    }

    // Always send "New Incident" mail
    await sendNewIncidentMail({
      incident: newIncident,
      adminEmails,
      superAdminEmails,
      technicianEmail,
    });

    // If technician assigned, also send "Assigned" mail
    if (technicianEmail) {
      await sendAssignedIncidentMail({
        incident: newIncident,
        adminEmails,
        superAdminEmails,
        technicianEmail,
      });
    }

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
    const incident = await IncidentModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching incidents" });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await IncidentModel.findById(id).sort({ createdAt: -1 });

    if (!incident) {
      return res
        .status(404)
        .json({ success: false, message: "Incident Id not found" });
    }
    res.status(200).json({ success: true, data: incident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching incident" });
  }
};

export const getIncidentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const incidents = await IncidentModel.find({ userId }).sort({ createdAt: -1 });

    if (!incidents || incidents.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No incident related to this user" });
    }

    res.status(200).json({ success: true, data: incidents });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching incidents" });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, changedBy, ...otherFields } = req.body;

    const incident = await IncidentModel.findById(id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident Id not found' });
    }

    // Store previous technician for comparison
    const previousTechnician = incident.classificaton?.technician || "";

    // Track changes in other fields
    const fieldChanges = {};
    Object.keys(otherFields).forEach((key) => {
      if (incident[key] !== undefined && incident[key] !== otherFields[key]) {
        fieldChanges[key] = { from: incident[key], to: otherFields[key] };
        incident[key] = otherFields[key];
      }
    });

    // Get current technician after update
    const currentTechnician = incident.classificaton?.technician || "";
    let technicianJustAssigned = false;

    // If technician is newly assigned and status is "New" or not provided, set status to "Assigned"
    if (
      (!previousTechnician || previousTechnician.trim() === "") &&
      currentTechnician &&
      currentTechnician.trim() !== "" &&
      (!status || incident.status === "New")
    ) {
      incident.statusTimeline.push({
        status: "Assigned",
        changedAt: getISTDate(),
        changedBy,
      });
      incident.status = "Assigned";
      technicianJustAssigned = true;
    }

    // Only update status and timeline if status is provided (other than the above auto-assignment)
    if (status) {
      incident.statusTimeline.push({
        status,
        changedAt: getISTDate(),
        changedBy,
      });
      incident.status = status;
    }

    // Push field changes if any
    if (Object.keys(fieldChanges).length > 0) {
      incident.fieldChangeHistory.push({
        changes: fieldChanges,
        changedAt: getISTDate(),
        changedBy,
      });
    }

    await incident.save();

    // Prepare emails (do not await, send in background)
    const adminEmailsPromise = getEmailsByRole("Admin");
    const superAdminEmailsPromise = getEmailsByRole("SuperAdmin");

    // Respond to client immediately
    res.status(200).json({ success: true, data: incident, message: 'Incident updated and lifecycle recorded' });

    // Send emails in background
    (async () => {
      try {
        const adminEmails = await adminEmailsPromise;
        const superAdminEmails = await superAdminEmailsPromise;

        // Send mail only if technician is newly assigned or changed
        if (
          technicianJustAssigned &&
          currentTechnician &&
          currentTechnician.trim() !== ""
        ) {
          const technicianEmail = await getEmailById(currentTechnician);
          await sendAssignedIncidentMail({
            incident,
            adminEmails,
            superAdminEmails,
            technicianEmail,
          });
        }

        // Always send status change mail
        await sendIncidentStatusChangeMail({
          incident,
          adminEmails,
          superAdminEmails,
        });
      } catch (mailError) {
        console.error("Mail sending failed:", mailError);
      }
    })();
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating incident', error: error.message });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIncident = await IncidentModel.findByIdAndDelete(id);

    if (!deletedIncident) {
      return res
        .status(404)
        .json({ success: false, message: "Incident Id not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Incident deleted successfullly" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting incident" });
  }
};

export const getIncidentStatusCounts = async (req, res) => {
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
      "Coverte to SR"
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

    const results = await IncidentModel.aggregate(pipeline);

    // Map results to statusList
    const counts = {};
    statusList.forEach(status => {
      const found = results.find(r => r._id === status);
      counts[status] = found ? found.count : 0;
    });

    // Total count
    counts["Total"] = await IncidentModel.countDocuments();

    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status counts", error: error.message });
  }
};

export const autoCloseResolvedIncidents = async () => {
  try {
    // Fetch autoClosedTime from config model (default to 60 if not set)
    const config = await IncidentAutoCloseModel.findOne({ active: true });
    const autoClosedTimeMinutes = config?.autoClosedTime || 60;

    const now = new Date();
    // Find all incidents with status "Resolved"
    const incidents = await IncidentModel.find({ status: "Resolved" });

    for (const incident of incidents) {
      // Find the last resolved time from statusTimeline
      const resolvedEntry = [...incident.statusTimeline].reverse().find(
        (t) => t.status?.toLowerCase() === "resolved"
      );
      if (!resolvedEntry) continue;

      const resolvedTime = new Date(resolvedEntry.changedAt);
      const diffMinutes = Math.floor((now - resolvedTime) / (1000 * 60));

      if (diffMinutes >= autoClosedTimeMinutes) {
        // Add "Closed" status to timeline and update status
        incident.statusTimeline.push({
          status: "Closed",
          changedAt: now,
          changedBy: "system", // or any system user id
        });
        incident.status = "Closed";
        await incident.save();
      }
    }
    return { success: true, message: "Auto-close job completed." };
  } catch (error) {
    return { success: false, message: "Error in auto-close job", error: error.message };
  }
};