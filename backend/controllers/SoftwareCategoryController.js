import SoftwareCategoryModel from "../models/softwareCategoryModel.js";

export const createSoftware = async (req, res) => {
    try {
        const { softwareName, publishers = [], softwareCategory = [] } = req.body;

        if (!softwareName) {
            return res.status(400).json({ message: 'Software name required' });
        }

        // Get next softwareNameId
        const lastSoftware = await SoftwareCategoryModel.findOne().sort({ softwareNameId: -1 });
        const nextSoftwareNameId = lastSoftware ? lastSoftware.softwareNameId + 1 : 1;

        // Generate publisherId for each publisher
        let lastPublisherId = 0;
        publishers.forEach((pub, idx) => {
            pub.publisherId = ++lastPublisherId;
        });

        // Generate softwareCategoryId for each category
        let lastCategoryId = 0;
        softwareCategory.forEach((cat, idx) => {
            cat.softwareCategoryId = ++lastCategoryId;
        });

        const newSoftware = new SoftwareCategoryModel({
            softwareNameId: nextSoftwareNameId,
            softwareName,
            publishers,
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
        const { softwareId } = req.params
        const { publisherName } = req.body
        if(!publisherName){
            return res.status(400).json({ success: false, message: 'Publisher name required'})
        }

        const software = await SoftwareCategoryModel.findById(softwareId)
        if(!software){
            return res.status(404).json({ success: false, message: 'Software Id not found'})
        }

        // Find the next serial publisherId
        const lastPub = software.publishers.length > 0
            ? Math.max(...software.publishers.map(pub => pub.publisherId))
            : 0;
        const nextPubId = lastPub + 1;

        software.publishers.push({
            publisherId: nextPubId,
            publisherName
        })
        await software.save()
        
        res.status(201).json({success:true, data:software, message:'Publisher created successfullly'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding publisher', error: error.message });

    }
}

export const createSoftwareCategory = async (req, res) => {
    try {
        const { softwareId } = req.params
        const { softwareCategoryName } = req.body
        if(!softwareCategoryName){
            return res.status(400).json({ success: false, message: 'Software category name required'})
        }

        const software = await SoftwareCategoryModel.findById(softwareId)
        if(!software){
            return res.status(404).json({ success: false, message: 'Software Id not found'})
        }

        // Find the next serial publisherId
        const lastPub = software.softwareCategory.length > 0
            ? Math.max(...software.softwareCategory.map(pub => pub.softwareCategoryId))
            : 0;
        const nextPubId = lastPub + 1;

        software.softwareCategory.push({
            softwareCategoryId: nextPubId,
            softwareCategoryName
        })
        await software.save()
        
        res.status(201).json({success:true, data:software, message:'Software Category created successfullly'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding software category', error: error.message });

    }
}

export const getAllPublisher = async (req, res) => {
    try {
        const software = await SoftwareCategoryModel.find()
        const AllPublishers = software.flatMap(soft => soft.publishers)
        res.status(200).json({ success: true, data: AllPublishers })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching publishers' })
    }
}

export const getAllSoftwareCategory = async (req, res) => {
    try {
        const software = await SoftwareCategoryModel.find()
        const allSoftwareCategory = software.flatMap(soft => soft.softwareCategory)
        res.status(200).json({ success: true, data: allSoftwareCategory })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching software category' })
    }
}

export const getAllSoftware = async (req, res) => {
    try {
        const software = await SoftwareCategoryModel.find()
        res.status(200).json({ success: true, data: software })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching software' })

    }
}

export const getPublisherById = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareCategoryModel.find()
        for (const soft of software) {
            const pub = soft.publishers.id(id)
            if (pub) {
                return res.status(200).json({ success: true, data: pub })
            }
        }
        res.status(404).json({ success: false, message: 'Publisher Id not found' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching publisher' })

    }
}

export const getSoftwareCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareCategoryModel.find()
        for (const cat of software) {
            const softCat = cat.softwareCategory.id(id)
            if (softCat) {
                return res.status(200).json({ success: true, data: softCat })
            }
        }
        res.status(404).json({ success: false, message: 'Software Category Id not found' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching software category' })

    }
}

export const getSoftwareById = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareCategoryModel.findById(id)

        if (!software) {
            return res.status(404).json({ success: false, message: 'Software id not found' })
        }
        res.status(200).json({ success: true, data: software })

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching software' })

    }
}

export const updatePublisher = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareCategoryModel.find()
        for (const soft of software) {
            const pub = soft.publishers.id(id)
            if (pub) {
                Object.assign(pub, req.body)
                await soft.save()
                return res.status(200).json({ success: true, data: pub, message: 'Publisher updated successfully' })
            }
        }
        res.status(404).json({ success: false, message: 'Publisher Id not found' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating publisher' });
    }
}

export const updateSoftwareCategory = async (req, res) => {
    try {
        const { id } = req.params
        const software = await SoftwareCategoryModel.find()
        for (const soft of software) {
            const cat = soft.softwareCategory.id(id)
            if (cat) {
                Object.assign(cat, req.body)
                await soft.save()
                return res.status(200).json({ success: true, data: cat, message: 'Software category updated successfully' })
            }
        }
        res.status(404).json({ success: false, message: 'Software category Id not found' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating software category' });
    }
}

export const updateSoftware = async (req, res) => {
    try {
        const { id } = req.params
        const updateSoftware = await SoftwareCategoryModel.findByIdAndUpdate(id, req.body, { new: true })

        if (!updateSoftware) {
            return res.status(404).json({ success: false, message: 'Software Id not found' })
        }

        res.status(200).json({ success: true, data: updateSoftware, message: 'Software updated successfully' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating Software' })

    }
}

export const deletePublisher = async (req, res) => {
    try {
        const { softwareId, publisherId } = req.params

        const software = await SoftwareCategoryModel.findById(softwareId)
        if (!software) {
            return res.status(400).json({ success: false, message: 'Software Id not found' })
        }
        const subIndex = software.publishers.findIndex(
            (sub) => sub._id.toString() === publisherId
        )
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'Publisher Id not found' })
        }
        software.publishers.splice(subIndex, 1)
        await software.save()
        res.status(200).json({ success: true, message: 'Publisher deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting publisher' });

    }
}

export const deleteSoftwareCategory = async (req, res) => {
    try {
        const { softwareId, softwareCategoryId } = req.params
        const software = await SoftwareCategoryModel.findById(softwareId)
        if (!software) {
            return res.status(400).json({ success: false, message: 'Software Id not found' })
        }
        const subIndex = software.softwareCategory.findIndex(
            (sub) => sub._id.toString() === softwareCategoryId
        )
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'Software category Id not found' })
        }
        software.softwareCategory.splice(subIndex, 1)
        await software.save()
        res.status(200).json({ success: true, message: 'Software category deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting software category' });

    }
}

export const deleteSoftware = async (req, res) => {
    try {
        const { id } = req.params
        const deleteSoftware = await SoftwareCategoryModel.findByIdAndDelete(id)

        if(!deleteSoftware){
            return res.status(404).json({ success: false, message:'Software id not found'})
        }
        res.status(200).json({ success:true, message:'Software deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting software' });
    }
}
