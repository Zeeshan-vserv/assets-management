import IncidentCounterModel from "../models/incidentCounterModel.js";
import IncidentModel from "../models/incidentModel.js";

export const createIncident = async(req, res) => {
    try {
        const { userId, ...incidentData } = req.body;

        if(!userId){
            return res.status(404).json({message:'User not found'});
        }

        // Atomically increment the incident counter
        const counter = await IncidentCounterModel.findOneAndUpdate(
            { name: "incident" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newIncidentId = `INC${counter.seq}`;

        const newIncident = new IncidentModel({
            userId,
            incidentId: newIncidentId,
            ...incidentData
        });

        await newIncident.save();

        res.status(201).json({ success: true, data: newIncident, message: 'Incident created successfully' });
    } catch (error) {
        res.status(400).json({message:'An error has been occured while creating incident', error: error.message});
    }
}

export const getAllIncident = async(req, res) => {
    try {
        const incident = await IncidentModel.find()
        res.status(200).json({ success: true, data: incident})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching incidents' });
    }
}

export const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params
        const incident = await IncidentModel.findById(id)

        if(!incident){
            return res.status(404).json({success:false, message:'Incident Id not found'})
        }
        res.status(200).json({success:true, data: incident})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching incident' });
    }
}

export const updateIncident = async (req, res) => {
    try {
        const { id } = req.params
        const updatedIncident = await IncidentModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updatedIncident){
            return res.status(404).json({success: false, message:'Incident Id not found'})
        }
        res.status(201).json({success: true, data:updatedIncident, message:'Incident updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating incident'})
    }
}

export const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params
        const deletedIncident = await IncidentModel.findByIdAndDelete(id)

        if(!deletedIncident){
            return res.status(404).json({success: false, message:'Incident Id not found'})
        }
        res.status(200).json({success: true, message:'Incident deleted successfullly'})
    } catch (error) {
        res.status(500).json({message:'An error occurred while deleting incident'})
    }
}