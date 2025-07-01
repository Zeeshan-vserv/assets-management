import { IncidentStatusModel } from "../models/incidentStatusModel.js";

// Create a new incident status timeline (for a new incident)
export const createIncidentStatus = async (req, res) => {
    try {
        const {statusName, description, clockHold, reason, changedBy } = req.body;

        if (!statusName) {
            return res.status(400).json({ message: 'statusName are required' });
        }

        const newIncidentStatus = new IncidentStatusModel({
                statusName,
                description,
                clockHold,
                reason,
                changedAt: new Date(),
                changedBy
        });

        await newIncidentStatus.save();
        res.status(201).json({ success: true, data: newIncidentStatus, message: 'Incident Status created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating incident status' });
    }
};

export const getAllIncidentStatus = async (req, res) => {
    try {
        const incidentStatus = await IncidentStatusModel.find()
        res.status(200).json({ success: true, data: incidentStatus})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getIncidentStatusById = async (req, res) => {
    try {
        const { id } = req.params
        const incidentStatus = await IncidentStatusModel.findById(id);
        if(!incidentStatus){
            return res.status(404).json({ success: false, message: 'Incident status not found'})
        }
        res.status(200).json({ success:true, data: incidentStatus})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching incident status'})
    }
}

// Add a new status entry to the timeline (update status)
export const updateIncidentStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const { statusName, description, clockHold, reason, changedBy } = req.body;

        if (!statusName) {
            return res.status(400).json({ message: 'statusName is required' });
        }

        const incidentStatusData = await IncidentStatusModel.findByIdAndUpdate(
            id,
            {
                statusName,
                description,
                clockHold,
                reason,
                changedAt: new Date(),
                changedBy
            },
            { new: true }
        );

        if (!incidentStatusData) {
            return res.status(404).json({ success: false, message: 'Incident status not found' });
        }
        res.status(200).json({ success: true, data: incidentStatusData, message: 'Incident status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating incident status' });
    }
};

export const deleteIncidentStatus = async(req, res) => {
    try {
        const { id }= req.params
        const deletedIncidentStatus = await IncidentStatusModel.findByIdAndDelete(id)
        if (!deletedIncidentStatus){
            return res.status(404).json({ success: false, message: 'Incident status not found'})
        }
        res.status(200).json({ success: true, message: 'Incident status deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting incident status'})
    }
}