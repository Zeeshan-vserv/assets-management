import LocationModel from "../models/locationModel.js"

export const createLocation = async (req, res) => {
    try {
        const { userId, locationName, subLocations = [] } = req.body

        if (!userId){
            return res.status(400).json({ message:'User Id not found'})
        }

        if (!locationName){
            return res.status(400).json({ message: 'Location name is required'})
        }

        const lastLocation = await LocationModel.findOne().sort({ locationId: -1})
        const nextLocationId = lastLocation ? lastLocation.locationId + 1 : 1;

        const subLocationWithIds = subLocations.map((sub, idx)=> ({
            subLocationId: idx + 1,
            subLocationName: sub.subLocationName
        })) 

        const newLocation = new LocationModel({
            userId, 
            locationId: nextLocationId,
            locationName,
            subLocations: subLocationWithIds
        })

        await newLocation.save()

        res.status(201).json({ success: true, data: newLocation, message:'Location created successfully'})
    } catch (error) {
                res.status(500).json({ message: 'An error occurred while creating location', error: error.message });

    }
}

export const addSubLOcation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const { subLocationName } = req.body;

        if (!subLocationName) {
            return res.status(400).json({ success: false, message: 'SubLocation name is required' });
        }

        const location = await LocationModel.findById(locationId);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        // Find the next serial sublocationId
        const lastSub = location.subLocations.length > 0
            ? Math.max(...location.subLocations.map(sub => sub.subLocationId))
            : 0;
        const nextSubId = lastSub + 1;

        // Add the new subdepartment
        location.subLocations.push({
            subLocationId: nextSubId,
            subLocationName
        });

        await location.save();

        res.status(201).json({
            success: true,
            data: location,
            message: 'Sublocation added successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding sublocation', error: error.message });
    }
};

export const getAllLocation = async ( req, res) => {
    try {
        const location = await LocationModel.find()
        res.status(200).json({ success: true, data:location})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching location'})
    }
}

export const getAllSubLocation = async (req, res) => {
    try {
        const locations = await LocationModel.find();
        const allSubLocations = locations.flatMap(loc => loc.subLocations);
        res.status(200).json({ success: true, data: allSubLocations });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching sublocation' });
    }
}

export const getLocationById = async (req, res) => {
    try {
        const { id } = req.params
        const location = await LocationModel.findById(id)

        if(!location){
            return res.status(404).json({ success: false, message:'Location id not found'})
        }

        res.status(200).json({ success: true, data: location})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching Location'})
    }
}

export const getSubLocationById = async (req, res) => {
    try {
        const { id } = req.params;
        const locations = await LocationModel.find();
        for (const loc of locations) {
            const sub = loc.subLocations.id(id);
            if (sub) {
                return res.status(200).json({ success: true, data: sub });
            }
        }
        res.status(404).json({ success: false, message: 'Sublocation id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching SubLocation' });
    }
}

export const updateLocation = async (req, res) => {
    try {
        const { id } = req.params
        const updateLocation = await LocationModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateLocation){
            return res.status(404).json({ success: false, message:'Location Id not found'})
        }
        res.status(200).json({ success:true, data: updateLocation, message:'Location updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating location'})
    }
}

export const updateSubLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const locations = await LocationModel.find();
        for (const loc of locations) {
            const sub = loc.subLocations.id(id);
            if (sub) {
                Object.assign(sub, req.body);
                await loc.save();
                return res.status(200).json({ success: true, data: sub, message: 'SubLocation updated successfully' });
            }
        }
        res.status(404).json({ success: false, message: 'SubLocation Id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating sublocation' });
    }
}

export const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params
        const deletedLocation = await LocationModel.findByIdAndDelete(id)

        if(!deletedLocation){
            return res.status(404).json({success:false, message:'Location Id not found'})
        }
        res.status(200).json({ success:true, data: deletedLocation, message:"Location deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting location' });
    }
}

// Delete a sublocation by its id (from a location)
export const deleteSubLocation = async (req, res) => {
    try {
        const { locationId, subLocationId } = req.params
        const location = await LocationModel.findById(locationId)
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' })
        }
        const subIndex = location.subLocations.findIndex(
            (sub) => sub._id.toString() === subLocationId
        )
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'SubLocation not found' })
        }
        location.subLocations.splice(subIndex, 1)
        await location.save()
        res.status(200).json({ success: true, data: location, message: "SubLocation deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting sublocation' });
    }
}