import StoreLocationModel from "../models/storeLocationModel.js";

export const createStoreLOcation = async (req, res) => {
    try {
        const { userId, locationName, storeLocationName} = re.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!locationName){
            return res.status(400).json({ message: 'Location name is required'})
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}