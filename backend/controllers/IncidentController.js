import AuthModel from "../models/authModel.js";
import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";

// Utility: Get IST Time
function getISTDate(date = new Date()) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
}

// --- CONTROLLERS ---

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