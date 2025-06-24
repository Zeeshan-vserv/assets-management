import StatusModel from "../models/statusModel.js";

export const createStatus = async (req, res) => {
    try {
        const { userId, statusName } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!statusName){
            return res.status(400).json({ message: 'Status name is required'})
        }

        // Get next Vendor Category Id
                const lastStatus = await StatusModel.findOne().sort({ statusId: -1 });
                const nextStatusId = lastStatus ? lastStatus.statusId + 1 : 1;

        const newStatus = new StatusModel({
            userId,
            statusId: nextStatusId,
            statusName
        })

        await newStatus.save();
        res.status(201).json({ success: true, data: newStatus, message: 'Status created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllStatus = async (req, res) => {
    try {
        const statusData = await StatusModel.find()
        res.status(200).json({ success: true, data: statusData})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getStatusById = async (req, res) => {
    try {
        const { id } = req.params
        const statusData = await StatusModel.findById(id);
        if(!statusData){
            return res.status(404).json({ success: false, message: 'Status not found'})
        }
        res.status(200).json({ success:true, data: statusData})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching status'})
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const statusData = await StatusModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!statusData) {
            return res.status(40).json({ success: false, message: 'Status not found'})
        }
        res.status(200).json({ success: true, data: statusData, message: 'Status updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching status'})
    }
}

export const deleteStatus = async (req, res) => {
    try {
        const { id }= req.params
        const deletedStatus = await StatusModel.findByIdAndDelete(id)
        if (!deletedStatus){
            return res.status(404).json({ success: false, message: 'Status not found'})
        }
        res.status(200).json({ success: true, message: 'Status deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting status'})
    }
}