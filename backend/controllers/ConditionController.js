import ConditionModel from "../models/conditionModel.js";

export const createCondition = async (req, res) =>{
    try {
        const { userId, conditionName } = req.body;
        if(!userId){
            return res.status(404).json({ message: 'User not found'})
        }

        const lastCondition = await ConditionModel.findOne().sort({ conditionId: -1})
        const nextConditionId = lastCondition ? lastCondition.conditionId + 1 : 1;

        const newCondition = new ConditionModel({
            userId,
            conditionId: nextConditionId,
            conditionName
        })
        await newCondition.save();
        res.status(201).json({ success: true, data: newCondition, message: 'Condition created successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while creating condition'})
    }   
}

export const getAllConditions = async (req, res) => {
    try {
        const conditions = await ConditionModel.find()
        res.status(200).json({ success: true, data: conditions})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching conditions'})
    }
}

export const getConditionById = async (req, res) => {
    try {
        const { id } = req.params;
        const condition = await ConditionModel.findById(id);
        if(!condition){
            return res.status(404).json({ success: false, message: 'Condition not found'})
        }
        res.status(200).json({ success: true, data: condition})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching condition'})
    }
}

export const updateCondition = async (req, res ) => {
    try {
        const { id } = req.params
        const conditionData = await ConditionModel.findByIdAndUpdate(id, req.body, { new: true})
        if(!conditionData){
            return res.status(40).json({ success: false, message: 'Condition not found'})
        }
        res.status(200).json({ success: true, data: conditionData, message: 'Condition updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating condition'})
    }
}

export const deleteCondition = async (req, res) =>{
    try {
        const { id } = req.params
        const conditionData = await ConditionModel.findByIdAndDelete(id)
        if(!conditionData){
            return res.status(40).json({ success: false, message: 'Condition not found'})
        }
        res.status(200).json({ success: true, message: 'Condition deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating condition'})
    }
}