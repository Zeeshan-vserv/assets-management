import ComponentModel from "../models/componentModel.js";

export const createComponent = async (req, res) => {
    try {
        const { userId, componentName } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }

        // Find the latest componentId
        const lastComponent = await ComponentModel.findOne().sort({ componentId: -1 });
        const nextComponentId = lastComponent ? lastComponent.componentId + 1 : 1;

        const newComponent = new ComponentModel({
            userId,
            componentName,
            componentId: nextComponentId
        });
        await newComponent.save();

        res.status(201).json({ success: true, data: newComponent, message: 'Component created Successfully' });
    } catch (error) {
        console.error('Error creating component:', error);
        res.status(500).json({ message: 'An error occurred while creating component' });
    }
}

export const getAllComponent = async (req, res) => {
    try {
        const component = await ComponentModel.find()
        res.status(200).json({success:true, data: component});
    } catch (error) {
        res.status(500).json({message: "An error occurred while fetching component"})
    }
}

export const getComponentById = async (req, res) => {
    try {
        const { id } = req.params
        const component = await ComponentModel.findById(id)

        if(!component){
            return res.status(404).json({success:false, message:"Component not found"})
        }
        res.status(200).json({success:true, data:component})
    } catch (error) {
        res.status(500).json({message: 'An error occurred while fetching component'})
    }
}

export const updateComponent = async (req, res) => {
    try {
        const { id } = req.params
        const updateComponent = await ComponentModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateComponent){
            return res.status(404).json({success:false, message:"Component not found"})
        }
        res.status(200).json({success:true, data: updateComponent, message:'Component updated successfully'})
    } catch (error) {
        res.status(500).json({message: "An error occurred while updating component"})
    }
}

export const deleteComponent = async(req, res) => {
    try {
        const { id } = req.params
        const deleteComponent = await ComponentModel.findByIdAndDelete(id)

        if(!deleteComponent){
            return res.status(404).json({success:false, message:'Component not found'})
        }
        res.status(200).json({success:true, data: deleteComponent, message:"Component deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting component' });
    }
}