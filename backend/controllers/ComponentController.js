import ComponentModel from "../models/componentModel.js";

export const createComponent = async (req, res) => {
    try {
        const {userId, componentName} = req.body

        if(!userId){
            return res.status(400).json({message:"User ID not found"})
        }

        const newComponent = new ComponentModel({userId, componentName})
        await newComponent.save()

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