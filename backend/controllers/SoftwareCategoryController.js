import { PublisherModel, SoftwareCategoryModel, SoftwareModel } from "../models/softwareCategoryModel.js";

export const createSoftware = async (req, res) => {
    try {
        const { softwareName, publisher, softwareCategory } = req.body;

        if (!softwareName) {
            return res.status(400).json({ message: 'Software name required' });
        }

        // Get next softwareNameId
        const lastSoftware = await SoftwareModel.findOne().sort({ softwareNameId: -1 });
        const nextSoftwareNameId = lastSoftware ? lastSoftware.softwareNameId + 1 : 1;


        const newSoftware = new SoftwareModel({
            softwareNameId: nextSoftwareNameId,
            softwareName,
            publisher,
            softwareCategory
        });

        await newSoftware.save();
        res.status(201).json({ success: true, data: newSoftware, message: 'Software created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating software', error: error.message });
    }
};

export const createPublisher = async (req, res) => {
    try {
        const { userId, publisherName } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!publisherName){
            return res.status(400).json({ message: 'Publisher name is required'})
        }

        // Get next storeLocationId
                const lastPublisher = await PublisherModel.findOne().sort({ publisherId: -1 });
                const nextPublisherId = lastPublisher ? lastPublisher.publisherId + 1 : 1;

        const newPublisher = new PublisherModel({
            userId,
            publisherId: nextPublisherId,
            publisherName
        })

        await newPublisher.save();
        res.status(201).json({ success: true, data: newPublisher, message: 'Publisher created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const createSoftwareCategory = async (req, res) => {
    try {
        const { userId, softwareCategoryName} = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!softwareCategoryName){
            return res.status(400).json({ message: 'Software Category name is required'})
        }

        // Get next storeLocationId
                const lastSoftwareCategory = await SoftwareCategoryModel.findOne().sort({ softwareCategoryId: -1 });
                const nextSoftwareCategoryId = lastSoftwareCategory ? lastSoftwareCategory.softwareCategoryId + 1 : 1;

        const newSoftwareCategory = new SoftwareCategoryModel({
            userId,
            softwareCategoryId: nextSoftwareCategoryId,
            softwareCategoryName
        })

        await newSoftwareCategory.save();
        res.status(201).json({ success: true, data: newSoftwareCategory, message: 'Software category created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllPublisher = async (req, res) => {
    try {
        const publisher = await PublisherModel.find()
        res.status(200).json({ success: true, data: publisher})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllSoftwareCategory = async (req, res) => {
    try {
        const softwareCategory = await SoftwareCategoryModel.find()
        res.status(200).json({ success: true, data: softwareCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllSoftware = async (req, res) => {
    try {
        const software = await SoftwareModel.find()
        res.status(200).json({ success: true, data: software })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching software' })

    }
}

export const getPublisherById = async (req, res) => {
    try {
        const { id } = req.params
        const publisher = await PublisherModel.findById(id);
        if(!publisher){
            return res.status(404).json({ success: false, message: 'Publisher not found'})
        }
        res.status(200).json({ success:true, data: publisher})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching publisher'})
    }
}

export const getSoftwareCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const softwareCategory = await SoftwareCategoryModel.findById(id);
        if(!softwareCategory){
            return res.status(404).json({ success: false, message: 'Software Category not found'})
        }
        res.status(200).json({ success:true, data: softwareCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching Software Category'})
    }
}

export const getSoftwareById = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareModel.findById(id);
        if(!software){
            return res.status(404).json({ success: false, message: 'Software not found'})
        }
        res.status(200).json({ success:true, data: software})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching software'})
    }
}

export const updatePublisher = async (req, res) => {
    try {
        const { id } = req.params
        const publisherData = await PublisherModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!publisherData) {
            return res.status(40).json({ success: false, message: 'Publisher location not found'})
        }
        res.status(200).json({ success: true, data: publisherData, message: 'Publisher updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching publisher'})
    }
}

export const updateSoftwareCategory = async (req, res) => {
    try {
        const { id } = req.params
        const softwareCategoryData = await SoftwareCategoryModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!softwareCategoryData) {
            return res.status(40).json({ success: false, message: 'Software category not found'})
        }
        res.status(200).json({ success: true, data: softwareCategoryData, message: 'Software category updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching Software category'})
    }
}

export const updateSoftware = async (req, res) => {
    try {
        const { id } = req.params
        const softwareData = await SoftwareModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!softwareData) {
            return res.status(40).json({ success: false, message: 'Software not found'})
        }
        res.status(200).json({ success: true, data: softwareData, message: 'Software updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while updating software'})
    }
}

export const deletePublisher = async (req, res) => {
    try {
        const { id }= req.params
        const deletedPublisher = await PublisherModel.findByIdAndDelete(id)
        if (!deletedPublisher){
            return res.status(404).json({ success: false, message: 'Publisher not found'})
        }
        res.status(200).json({ success: true, message: 'Publisher deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting publisher'})
    }
}

export const deleteSoftwareCategory = async (req, res) => {
    try {
        const { id }= req.params
        const deletedSoftwareCategory = await SoftwareCategoryModel.findByIdAndDelete(id)
        if (!deletedSoftwareCategory){
            return res.status(404).json({ success: false, message: 'Software catrgory not found'})
        }
        res.status(200).json({ success: true, message: 'Software category deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting software category'})
    }
}

export const deleteSoftware = async (req, res) => {
    try {
        const { id }= req.params
        const deletedSoftware = await SoftwareModel.findByIdAndDelete(id)
        if (!deletedSoftware){
            return res.status(404).json({ success: false, message: 'Software not found'})
        }
        res.status(200).json({ success: true, message: 'Software deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting software'})
    }
}
