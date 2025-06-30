import { PriorityMatrixModel, SLACreationModel, SLAMappingModel, SLATimelineModel } from "../models/slaModel.js";

// Controller for SLA Creation
export const createSLA = async (req, res) => {
    try {
        const { userId, ...slaData} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }


        const newSLA = new SLACreationModel({
            userId,
            ...slaData
        })

        await newSLA.save();
        res.status(201).json({ success: true, data: newSLA, message: 'SLA created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating SLA'})
    }
}

export const getAllSLAs = async (req, res) => {
    try {
        const sla = await SLACreationModel.find()
        res.status(200).json({ success: true, data: sla})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLAs'})
    }
}

export const getSLAById = async (req, res) => {
    try {
        const { id } = req.params
        const sla = await SLACreationModel.findById(id);
        if(!sla){
            return res.status(404).json({ success: false, message: 'SLA not found'})
        }
        res.status(200).json({ success:true, data: sla})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA'})
    }
}

export const updateSLA = async (req, res) => {
    try {
        const { id } = req.params
        const slaData = await SLACreationModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!slaData) {
            return res.status(40).json({ success: false, message: 'SLA not found'})
        }
        res.status(200).json({ success: true, data: slaData, message: 'SLA updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA'})
    }
}

export const deleteSLA = async (req, res) => {
    try {
        const { id }= req.params
        const deletedSLA = await SLACreationModel.findByIdAndDelete(id)
        if (!deletedSLA){
            return res.status(404).json({ success: false, message: 'SLA not found'})
        }
        res.status(200).json({ success: true, message: 'SLA deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting SLA'})
    }
}

// Controller for SLA Mapping
export const createSLAMapping = async (req, res) => {
    try {
        const { userId, supportDepartment, slaName } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if ( !supportDepartment && !slaName) {
            return res.status(400).json({ message: 'Support Department and SLA name are required'})
        }

        const newSLAMapping = new SLAMappingModel({
            userId,
            supportDepartment,
            slaName
        })

        await newSLAMapping.save();
        res.status(201).json({ success: true, data: newSLAMapping, message: 'SLA Mapping created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating SLA Mapping'})
    }
}

export const getAllSLAMappings = async (req, res) => {
    try {
        const slaMapping = await SLAMappingModel.find()
        res.status(200).json({ success: true, data: slaMapping})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA Mappings'})
    }
}

export const getSLAMappingById = async (req, res) => {
    try {
        const { id } = req.params
        const slaMapping = await SLAMappingModel.findById(id);
        if(!slaMapping){
            return res.status(404).json({ success: false, message: 'SLA Mapping not found'})
        }
        res.status(200).json({ success:true, data: slaMapping})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA Mapping'})
    }
}

export const updateSLAMapping = async (req, res) => {
    try {
        const { id } = req.params
        const slaMappingData = await SLAMappingModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!slaMappingData) {
            return res.status(40).json({ success: false, message: 'SLA not found'})
        }
        res.status(200).json({ success: true, data: slaMappingData, message: 'SLA Mapping updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA Mapping'})
    }
}

export const deleteSLAMapping = async (req, res) => {
    try {
        const { id }= req.params
        const deletedSLAMapping = await SLAMappingModel.findByIdAndDelete(id)
        if (!deletedSLAMapping){
            return res.status(404).json({ success: false, message: 'SLA Mapping not found'})
        }
        res.status(200).json({ success: true, message: 'SLA Mapping deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting SLA Mapping'})
    }
}

// Controller for SLA Timeline
export const createSLATimeline = async (req, res) => {
    try {
        const { userId, ...slaTimelineData} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }


        const newSLATimeline = new SLATimelineModel({
            userId,
            ...slaTimelineData
        })

        await newSLATimeline.save();
        res.status(201).json({ success: true, data: newSLATimeline, message: 'SLA Timeline created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating SLA Timeline'})
    }
}

export const getAllSLATimelines = async (req, res) => {
    try {
        const slaTimeline = await SLATimelineModel.find()
        res.status(200).json({ success: true, data: slaTimeline})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA timeline'})
    }
}

export const getSLATimelineById = async (req, res) => {
    try {
        const { id } = req.params
        const slaTimeline = await SLATimelineModel.findById(id);
        if(!slaTimeline){
            return res.status(404).json({ success: false, message: 'SLA timeline not found'})
        }
        res.status(200).json({ success:true, data: slaTimeline})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA timeline'})
    }
}

export const updateSLATimeline = async (req, res) => {
    try {
        const { id } = req.params
        const slaTimelineData = await SLATimelineModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!slaTimelineData) {
            return res.status(40).json({ success: false, message: 'SLA timeline not found'})
        }
        res.status(200).json({ success: true, data: slaTimelineData, message: 'SLA timeline updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching SLA timeline'})
    }
}

export const deleteSLATimeline = async (req, res) => {
    try {
        const { id }= req.params
        const deletedSLATimeline = await SLATimelineModel.findByIdAndDelete(id)
        if (!deletedSLATimeline){
            return res.status(404).json({ success: false, message: 'SLA timeline not found'})
        }
        res.status(200).json({ success: true, message: 'SLA timeline deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting SLA timeline'})
    }
}

// Controller for Priority Matrix
export const createPriorityMatrix = async (req, res) => {
    try {
        const { userId, urgency, impact, priority } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if ( !urgency && !impact && !priority) {
            return res.status(400).json({ message: 'Urgency, Impact and Priority are required'})
        }

        const newPriorityMatrix = new PriorityMatrixModel({
            userId,
            urgency,
            impact,
            priority
        })

        await newPriorityMatrix.save();
        res.status(201).json({ success: true, data: newPriorityMatrix, message: 'Priority matrix created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating priority matrix'})
    }
}

export const getAllPriorityMatrices = async (req, res) => {
    try {
        const priorityMatrix = await PriorityMatrixModel.find()
        res.status(200).json({ success: true, data: priorityMatrix})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching priority matrices'})
    }
}

export const getPriorityMatrixById = async (req, res) => {
    try {
        const { id } = req.params
        const priorityMatrix = await PriorityMatrixModel.findById(id);
        if(!priorityMatrix){
            return res.status(404).json({ success: false, message: 'Priority matrix not found'})
        }
        res.status(200).json({ success:true, data: priorityMatrix})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching priority matrix'})
    }
}

export const updatePriorityMatrix = async (req, res) => {
    try {
        const { id } = req.params
        const priorityMatrixData = await PriorityMatrixModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!priorityMatrixData) {
            return res.status(40).json({ success: false, message: 'Priority matrix not found'})
        }
        res.status(200).json({ success: true, data: priorityMatrixData, message: 'Priority matrix updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching priority matrix'})
    }
}

export const deletePriorityMatrix = async (req, res) => {
    try {
        const { id }= req.params
        const deletedPriorityMatrix = await PriorityMatrixModel.findByIdAndDelete(id)
        if (!deletedPriorityMatrix){
            return res.status(404).json({ success: false, message: 'Priority matrix not found'})
        }
        res.status(200).json({ success: true, message: 'Priority matrix deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting priority matrix'})
    }
}