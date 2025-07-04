import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";

export const createIncident = async (req, res) => {
    try {
        const { userId, ...incidentData } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle attachment
        let attachmentPath = "";
        if (req.file) {
            attachmentPath = req.file.path;
        }

        // Atomically increment the incident counter
        const counter = await IncidentCounterModel.findOneAndUpdate(
            { name: "incident" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Get current date in DDMMYYYY format
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${day}${month}${year}`;

        const newIncidentId = `INC${dateStr}${counter.seq}`;

        const newIncident = new IncidentModel({
            userId,
            incidentId: newIncidentId,
            ...incidentData,
            attachment: attachmentPath,
            statusTimeline: [{
                status: "New",
                changedAt: new Date(),
                changedBy: userId
            }]
        });

        await newIncident.save();

        res.status(201).json({ success: true, data: newIncident, message: 'Incident created successfully' });
    } catch (error) {
        res.status(400).json({ message: 'An error has been occured while creating incident', error: error.message });
    }
}

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

        // Track status change
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