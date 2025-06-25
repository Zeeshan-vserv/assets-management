import SupportDepartmentModel from "../models/supportDepartmentModel.js";

export const createSupportDepartment = async (req, res) => {
    try {
        const { userId, supportDepartmentName, supportGroups = [] } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User Id not found' });
        }
        if (!supportDepartmentName) {
            return res.status(400).json({ message: 'Support Department name is required' });
        }

        // Get next supportdepartmentId
        const lastSupportDepartment = await SupportDepartmentModel.findOne().sort({ supportDepartmentId: -1 });
        const nextSupportDepartmentId = lastSupportDepartment ? lastSupportDepartment.supportDepartmentId + 1 : 1;

        // Assign serial support groupId to each support department
        const supportDepartmentsWithIds = supportGroups.map((sub, idx) => ({
            supportDepartmentId: idx + 1,
            supportDepartmentName: sub.supportDepartmentName
        }));

        const newSupportDepartment = new SupportDepartmentModel({
            userId,
            supportDepartmentId: nextSupportDepartmentId,
            supportDepartmentName,
            supportGroups: supportDepartmentsWithIds
        });

        await newSupportDepartment.save();

        res.status(201).json({ success: true, data: newDepartment, message: 'Support Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating support department', error: error.message });
    }
};

export const getAllSupportDepartment = async (req, res) => {
    try {
        const supportDepartment = await SupportDepartmentModel.find()
        res.status(200).json({ success: true, data: supportDepartment})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching supporty departments'})
    }
}

export const getAllSupportGroup = async (req, res) => {
    try {
        const supportDepartments = await SupportDepartmentModel.find();
        const allSupportDepartments = supportDepartments.flatMap(dep => dep.supportGroups);
        res.status(200).json({ success: true, data: allSupportDepartments });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching support group' });
    }
}

export const getSupportDepartmentById = async (req, res) => {
    try {
        const { id } = req.params
        const supportDepartment = await SupportDepartmentModel.findById(id)

        if(!supportDepartment){
            return res.status(404).json({ success: false, message:'Support Department id not found'})
        }

        res.status(200).json({ success: true, data: supportDepartment})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching Support Department'})
    }
}

export const getSupportGroupById = async (req, res) => {
    try {
        const { id } = req.params;
        const supportDepartments = await SupportDepartmentModel.find();
        for (const dep of supportDepartments) {
            const sub = dep.supportGroups.id(id);
            if (sub) {
                return res.status(200).json({ success: true, data: sub });
            }
        }
        res.status(404).json({ success: false, message: 'Support group id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching support group' });
    }
}

export const updateSupportDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const updateSupportDepartment = await SupportDepartmentModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateSupportDepartment){
            return res.status(404).json({ success: false, message:'Support Department Id not found'})
        }
        res.status(200).json({ success:true, data: updateSupportDepartment, message:'Support Department updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating support department'})
    }
}

export const updateSupportGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const supportDepartments = await SupportDepartmentModel.find();
        for (const dep of supportDepartments) {
            const sub = dep.supportGroups.id(id);
            if (sub) {
                Object.assign(sub, req.body);
                await dep.save();
                return res.status(200).json({ success: true, data: sub, message: 'Support Group updated successfully' });
            }
        }
        res.status(404).json({ success: false, message: 'Support Group Id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating Support Group' });
    }
}

export const addSupportGroup = async (req, res) => {
    try {
        const { supportDepartmentId } = req.params;
        const { supportDepartmentName } = req.body;

        if (!supportDepartmentName) {
            return res.status(400).json({ success: false, message: 'Support Group name is required' });
        }

        const supportDepartment = await SupportDepartmentModel.findById(supportDepartmentId);
        if (!supportDepartment) {
            return res.status(404).json({ success: false, message: 'Support Department not found' });
        }

        // Find the next serial subdepartmentId
        const lastSub = supportDepartment.supportGroups.length > 0
            ? Math.max(...supportDepartment.supportGroups.map(sub => sub.supportGroupId))
            : 0;
        const nextSubId = lastSub + 1;

        // Add the new subdepartment
        supportDepartment.supportGroups.push({
            supportGroupId: nextSubId,
            supportGroupName
        });

        await supportDepartment.save();

        res.status(201).json({
            success: true,
            data: supportDepartment,
            message: 'Support group added successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding support group', error: error.message });
    }
};

export const deleteSupportDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const deletedSupportDepartment = await SupportDepartmentModel.findByIdAndDelete(id)

        if(!deletedSupportDepartment){
            return res.status(404).json({success:false, message:'Support Department Id not found'})
        }
        res.status(200).json({ success:true, data: deletedSupportDepartment, message:"Support Department deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting support department' });
    }
}

// Delete a support group by its id (from a support department)
export const deleteSupportGroup = async (req, res) => {
    try {
        const { supportDepartmentId, supportGroupId } = req.params
        const supportDepartment = await SupportDepartmentModel.findById(supportDepartmentId)
        if (!supportDepartment) {
            return res.status(404).json({ success: false, message: 'Support Department not found' })
        }
        const subIndex = supportDepartment.supportGroups.findIndex(
            (sub) => sub._id.toString() === supportGroupId
        )
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'Support group not found' })
        }
        supportDepartment.supportGroups.splice(subIndex, 1)
        await supportDepartment.save()
        res.status(200).json({ success: true, data: supportDepartment, message: "Support group deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting support group' });
    }
}