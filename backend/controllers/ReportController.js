import IncidentModel from "../models/incidentModel.js";
import ServiceRequestModel from "../models/serviceRequestModel.js";

// Fetch all incidents and service requests by technician id, merged in a single array
export const getAllByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;

    // Fetch incidents and service requests
    const incidents = await IncidentModel.find({
      "classificaton.technician": technicianId,
    }).lean().sort({ createdAt: -1 });

    const serviceRequests = await ServiceRequestModel.find({
      "classificaton.technician": technicianId,
    }).lean().sort({ createdAt: -1 });

    // Add type to each
    const incidentItems = incidents.map(item => ({ ...item, type: "incident" }));
    const serviceRequestItems = serviceRequests.map(item => ({ ...item, type: "serviceRequest" }));

    // Merge into a single array
    const merged = [...incidentItems, ...serviceRequestItems];

    res.status(200).json({
      success: true,
      data: merged,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching records by technician",
      error: error.message,
    });
  }
};