import IncidentModel from "../models/incidentModel.js";
import ServiceRequestModel from "../models/serviceRequestModel.js";

// Fetch all incidents and service requests by technician id
export const getAllByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;

    // Find incidents where classificaton.technician matches technicianId
    const incidents = await IncidentModel.find({
      "classificaton.technician": technicianId,
    });

    // Find service requests where classificaton.technician matches technicianId
    const serviceRequests = await ServiceRequestModel.find({
      "classificaton.technician": technicianId,
    });

    res.status(200).json({
      success: true,
      incidents,
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching records by technician",
      error: error.message,
    });
  }
};