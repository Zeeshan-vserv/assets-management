import { IncidentAutoCloseModel, IncidentAutoClosureCodeModel, IncidentPendingReasonModel, IncidentPredefinedResponseModel, IncidentRuleModel } from "../models/globalIncidentModels.js";

//Incident Auto Close Time
export const createAutoCloseTime = async (req, res) => {
    try {
        const { userId, autoCloseTime} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!autoCloseTime){
            return res.status(400).json({ message: 'Close time is required'})
        }

        // Get next auto close time Id
                const lastCloseTime = await IncidentAutoCloseModel.findOne().sort({ autoCloseTimeId: -1 });
                const nextCloseTimeId = lastCloseTime ? lastCloseTime.autoCloseTimeId + 1 : 1;

        const newAutoClose = new IncidentAutoCloseModel({
            userId,
            autoCloseTimeId: nextCloseTimeId,
            autoCloseTime
        })

        await newAutoClose.save();
        res.status(201).json({ success: true, data: newAutoClose, message: 'Auto close created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto close time'})
    }
}

export const getAllAutoCloseTimes = async (req, res) => {
    try {
        const autoCloseTime = await IncidentAutoCloseModel.find()
        res.status(200).json({ success: true, data: autoCloseTime})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAutoCloseTimeById = async (req, res) => {
    try {
        const { id } = req.params
        const autoCloseTime = await IncidentAutoCloseModel.findById(id);
        if(!autoCloseTime){
            return res.status(404).json({ success: false, message: 'Auto close not found'})
        }
        res.status(200).json({ success:true, data: autoCloseTime})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto close time'})
    }
}

export const updateAutoCloseTime = async (req, res) => {
    try {
        const { id } = req.params
        const autoCloseTimeData = await IncidentAutoCloseModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!autoCloseTimeData) {
            return res.status(40).json({ success: false, message: 'Auto close time not found'})
        }
        res.status(200).json({ success: true, data: autoCloseTimeData, message: 'Auto close time updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto close time'})
    }
}

export const deleteAutoCloseTime = async (req, res) => {
    try {
        const { id }= req.params
        const deletedAutoCloseTime = await IncidentAutoCloseModel.findByIdAndDelete(id)
        if (!deletedAutoCloseTime){
            return res.status(404).json({ success: false, message: 'Auto close time not found'})
        }
        res.status(200).json({ success: true, message: 'Auto close time deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting auto close time'})
    }
}

// Incident Closure Code 
export const createClosureCode = async (req, res) => {
    try {
        const { userId, closureCodeValue} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!closureCodeValue){
            return res.status(400).json({ message: 'Closure time is required'})
        }

        // Get next auto close time Id
                const lastClosureCode = await IncidentAutoClosureCodeModel.findOne().sort({ closureCodeId: -1 });
                const nextClosureCodeId = lastClosureCode ? lastClosureCode.closureCodeId + 1 : 1;

        const newClosureCode = new IncidentAutoClosureCodeModel({
            userId,
            closureCodeId: nextClosureCodeId,
            closureCodeValue
        })

        await newClosureCode.save();
        res.status(201).json({ success: true, data: newClosureCode, message: 'Closure code created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto closure code'})
    }
}

export const getAllClosureCodes = async (req, res) => {
    try {
        const closureCode = await IncidentAutoClosureCodeModel.find()
        res.status(200).json({ success: true, data: closureCode})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getClosureCodeById = async (req, res) => {
    try {
        const { id } = req.params
        const closureCode = await IncidentAutoClosureCodeModel.findById(id);
        if(!closureCode){
            return res.status(404).json({ success: false, message: 'Closure code not found'})
        }
        res.status(200).json({ success:true, data: closureCode})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto closure code'})
    }
}

export const updateClosureCode = async (req, res) => {
    try {
        const { id } = req.params
        const autoClosureCodeData = await IncidentAutoClosureCodeModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!autoClosureCodeData) {
            return res.status(40).json({ success: false, message: 'Auto closure code time not found'})
        }
        res.status(200).json({ success: true, data: autoClosureCodeData, message: 'Closure code time updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto closure code'})
    }
}

export const deleteClosureCode = async (req, res) => {
    try {
        const { id }= req.params
        const deletedAutoClosureCode = await IncidentAutoClosureCodeModel.findByIdAndDelete(id)
        if (!deletedAutoClosureCode){
            return res.status(404).json({ success: false, message: 'Closure code time not found'})
        }
        res.status(200).json({ success: true, message: 'Closure code time deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting auto closure code'})
    }
}

// Incident Predefined Response 

export const createPredefinedResponse = async (req, res) => {
    try {
        const { userId, predefinedTitle, predefinedContent} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!predefinedTitle){
            return res.status(400).json({ message: 'Predefined title is required'})
        }
        if(!predefinedContent){
            return res.status(400).json({ message: 'Predefined content is required'})
        }

        // Get next auto predefined responseid
                const lastPredefinedResponse = await IncidentPredefinedResponseModel.findOne().sort({ predefinedResponseId: -1 });
                const nextPredefinedResponseId = lastPredefinedResponse ? lastPredefinedResponse.predefinedResponseId + 1 : 1;

        const newPredefinedResponse = new IncidentPredefinedResponseModel({
            userId,
            predefinedResponseId: nextPredefinedResponseId,
            predefinedTitle,
            predefinedContent
        })

        await newPredefinedResponse.save();
        res.status(201).json({ success: true, data: newPredefinedResponse, message: 'Predefined response created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto predefined response'})
    }
}

export const getAllPredefinedResponses = async (req, res) => {
    try {
        const predefinedResponse = await IncidentPredefinedResponseModel.find()
        res.status(200).json({ success: true, data: predefinedResponse})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getPredefinedResponseById = async (req, res) => {
    try {
        const { id } = req.params
        const predefineResponse = await IncidentPredefinedResponseModel.findById(id);
        if(!predefineResponse){
            return res.status(404).json({ success: false, message: 'Predefined response not found'})
        }
        res.status(200).json({ success:true, data: predefineResponse})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto predefined response'})
    }
}

export const updatePredefinedResponse = async (req, res) => {
    try {
        const { id } = req.params
        const predefineResponse = await IncidentPredefinedResponseModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!predefineResponse) {
            return res.status(40).json({ success: false, message: 'Predefined response time not found'})
        }
        res.status(200).json({ success: true, data: predefineResponse, message: 'Predefined response updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto predefined response'})
    }
}

export const deletePredefinedResponse = async (req, res) => {
    try {
        const { id }= req.params
        const deletedPredefinedResponse = await IncidentPredefinedResponseModel.findByIdAndDelete(id)
        if (!deletedPredefinedResponse){
            return res.status(404).json({ success: false, message: 'Predefined response not found'})
        }
        res.status(200).json({ success: true, message: 'Predefined response time deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting predefined response'})
    }
}

// Incident Pending Reason

export const createPendingReason = async (req, res) => {
    try {
        const { userId, pendingReason} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!pendingReason){
            return res.status(400).json({ message: 'Pending reason is required'})
        }

        // Get next auto pending reason id
                const lastPendingReason = await IncidentPendingReasonModel.findOne().sort({ pendingReasonId: -1 });
                const nextPendingReasonId = lastPendingReason ? lastPendingReason.pendingReasonId + 1 : 1;

        const newPendingResponse = new IncidentPendingReasonModel({
            userId,
            pendingReasonId: nextPendingReasonId,
            pendingReason
        })

        await newPendingResponse.save();
        res.status(201).json({ success: true, data: newPendingResponse, message: 'Pending reason created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto pending reason'})
    }
}

export const getAllPendingReasons = async (req, res) => {
    try {
        const pendingReason = await IncidentPendingReasonModel.find()
        res.status(200).json({ success: true, data: pendingReason})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getPendingReasonById = async (req, res) => {
    try {
        const { id } = req.params
        const pendingReason = await IncidentPendingReasonModel.findById(id);
        if(!pendingReason){
            return res.status(404).json({ success: false, message: 'Pending reason not found'})
        }
        res.status(200).json({ success:true, data: pendingReason})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto pending reason'})
    }
}

export const updatePendingReason = async (req, res) => {
    try {
        const { id } = req.params
        const pendingReason = await IncidentPendingReasonModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!pendingReason) {
            return res.status(40).json({ success: false, message: 'Pending reason time not found'})
        }
        res.status(200).json({ success: true, data: pendingReason, message: 'Pending reason updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto pending reason'})
    }
}

export const deletePendingReason = async (req, res) => {
    try {
        const { id }= req.params
        const deletedPendingReason = await IncidentPendingReasonModel.findByIdAndDelete(id)
        if (!deletedPendingReason){
            return res.status(404).json({ success: false, message: 'Pending reason not found'})
        }
        res.status(200).json({ success: true, message: 'Pending reason time deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting pending reason'})
    }
}

// Incident Rule

export const createRule = async (req, res) => {
    try {
        const { userId, ...ruleData} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        const newRule = new IncidentRuleModel({
            userId,
            ...ruleData
        })

        await newRule.save();
        res.status(201).json({ success: true, data: newRule, message: 'Rule created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating auto rule'})
    }
}

export const getAllRules = async (req, res) => {
    try {
        const rule = await IncidentRuleModel.find()
        res.status(200).json({ success: true, data: rule})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getRuleById = async (req, res) => {
    try {
        const { id } = req.params
        const rule = await IncidentRuleModel.findById(id);
        if(!rule){
            return res.status(404).json({ success: false, message: 'Rule not found'})
        }
        res.status(200).json({ success:true, data: rule})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto rule'})
    }
}

export const updateRule = async (req, res) => {
    try {
        const { id } = req.params
        const ruleData = await IncidentRuleModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!ruleData) {
            return res.status(404).json({ success: false, message: 'Rule not found'})
        }
        res.status(200).json({ success: true, data: ruleData, message: 'Rule updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching auto rule'})
    }
}

export const deleteRule = async (req, res) => {
    try {
        const { id }= req.params
        const deleteRule = await IncidentRuleModel.findByIdAndDelete(id)
        if (!deleteRule){
            return res.status(404).json({ success: false, message: 'Rule not found'})
        }
        res.status(200).json({ success: true, message: 'Rule  deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting rule'})
    }
}