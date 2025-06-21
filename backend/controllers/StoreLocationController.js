import StoreLocationModel from "../models/storeLocationModel.js";

export const createStoreLocation = async (req, res) => {
    try {
        const { userId, locationName, storeLocationName} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!locationName){
            return res.status(400).json({ message: 'Location name is required'})
        }

        // Get next storeLocationId
                const lastStoreLocation = await StoreLocationModel.findOne().sort({ storeLocationId: -1 });
                const nextStoreLocationId = lastStoreLocation ? lastStoreLocation.storeLocationId + 1 : 1;

        const newStoreLocation = new StoreLocationModel({
            userId,
            storeLocationId: nextStoreLocationId,
            locationName,
            storeLocationName
        })

        await newStoreLocation.save();
        res.status(201).json({ success: true, data: newStoreLocation, message: 'Store Location created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllStoreLocations = async (req, res) => {
    try {
        const storeLocations = await StoreLocationModel.find()
        res.status(200).json({ success: true, data: storeLocations})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getStoreLocationById = async (req, res) => {
    try {
        const { id } = req.params
        const storeLocation = await StoreLocationModel.findById(id);
        if(!storeLocation){
            return res.status(404).json({ success: false, message: 'Store location not found'})
        }
        res.status(200).json({ success:true, data: storeLocation})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching store location'})
    }
}

export const updateStoreLocation =  async (req, res) => {
    try {
        const { id } = req.params
        const storeLocationData = await StoreLocationModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!storeLocationData) {
            return res.status(40).json({ success: false, message: 'Store location not found'})
        }
        res.status(200).json({ success: true, data: storeLocationData, message: 'Store location updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching store location'})
    }
}

export const deleteStoreLocation = async(req, res) => {
    try {
        const { id }= req.params
        const deletedStoreLocation = await StoreLocationModel.findByIdAndDelete(id)
        if (!deletedStoreLocation){
            return res.status(404).json({ success: false, message: 'Store location not found'})
        }
        res.status(200).json({ success: true, message: 'Store locaton deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting store location'})
    }
}