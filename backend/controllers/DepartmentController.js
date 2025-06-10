import DepartmentModel from "../models/departmentModel.js";

export const createDepartment = async (req, res) => {
    try {
        const { userId, departmentName, departmentHead, subdepartments = [] } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User Id not found' });
        }
        if (!departmentName) {
            return res.status(400).json({ message: 'Department name is required' });
        }

        // Get next departmentId
        const lastDepartment = await DepartmentModel.findOne().sort({ departmentId: -1 });
        const nextDepartmentId = lastDepartment ? lastDepartment.departmentId + 1 : 1;

        // Assign serial subdepartmentId to each subdepartment
        const subdepartmentsWithIds = subdepartments.map((sub, idx) => ({
            subdepartmentId: idx + 1,
            subdepartmentName: sub.subdepartmentName
        }));

        const newDepartment = new DepartmentModel({
            userId,
            departmentId: nextDepartmentId,
            departmentName,
            departmentHead,
            subdepartments: subdepartmentsWithIds
        });

        await newDepartment.save();

        res.status(201).json({ success: true, data: newDepartment, message: 'Department created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating department', error: error.message });
    }
};

export const getAllDepartment = async (req, res) => {
    try {
        const department = await DepartmentModel.find()
        res.status(200).json({ success: true, data: department})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching departments'})
    }
}

export const getAllSubDepartment = async (req, res) => {
    try {
        const departments = await DepartmentModel.find();
        const allSubDepartments = departments.flatMap(dep => dep.subdepartments);
        res.status(200).json({ success: true, data: allSubDepartments });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching subdepartments' });
    }
}

export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params
        const department = await DepartmentModel.findById(id)

        if(!department){
            return res.status(404).json({ success: false, message:'Department id not found'})
        }

        res.status(200).json({ success: true, data: department})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetching Department'})
    }
}

export const getSubDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const departments = await DepartmentModel.find();
        for (const dep of departments) {
            const sub = dep.subdepartments.id(id);
            if (sub) {
                return res.status(200).json({ success: true, data: sub });
            }
        }
        res.status(404).json({ success: false, message: 'SubDepartment id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching SubDepartment' });
    }
}

// export const getSubDepartmentById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const departments = await DepartmentModel.find();
//         for (const dep of departments) {
//             const sub = dep.subdepartments.id(id);
//             if (sub) {
//                 return res.status(200).json({
//                     success: true,
//                     data: {
//                         departmentId: dep.departmentId,
//                         departmentName: dep.departmentName,
//                         subdepartment: sub
//                     }
//                 });
//             }
//         }
//         res.status(404).json({ success: false, message: 'SubDepartment id not found' });
//     } catch (error) {
//         res.status(500).json({ message: 'An error occurred while fetching SubDepartment' });
//     }
// }

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const updateDepartment = await DepartmentModel.findByIdAndUpdate(id, req.body, {new:true})

        if(!updateDepartment){
            return res.status(404).json({ success: false, message:'Department Id not found'})
        }
        res.status(200).json({ success:true, data: updateDepartment, message:'Department updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating department'})
    }
}

export const updateSubDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const departments = await DepartmentModel.find();
        for (const dep of departments) {
            const sub = dep.subdepartments.id(id);
            if (sub) {
                Object.assign(sub, req.body);
                await dep.save();
                return res.status(200).json({ success: true, data: sub, message: 'SubDepartment updated successfully' });
            }
        }
        res.status(404).json({ success: false, message: 'SubDepartment Id not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating subdepartment' });
    }
}

export const addSubDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { subdepartmentName } = req.body;

        if (!subdepartmentName) {
            return res.status(400).json({ success: false, message: 'SubDepartment name is required' });
        }

        const department = await DepartmentModel.findById(departmentId);
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        // Find the next serial subdepartmentId
        const lastSub = department.subdepartments.length > 0
            ? Math.max(...department.subdepartments.map(sub => sub.subdepartmentId))
            : 0;
        const nextSubId = lastSub + 1;

        // Add the new subdepartment
        department.subdepartments.push({
            subdepartmentId: nextSubId,
            subdepartmentName
        });

        await department.save();

        res.status(201).json({
            success: true,
            data: department,
            message: 'SubDepartment added successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding subdepartment', error: error.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params
        const deletedDepartment = await DepartmentModel.findByIdAndDelete(id)

        if(!deletedDepartment){
            return res.status(404).json({success:false, message:'Department Id not found'})
        }
        res.status(200).json({ success:true, data: deletedDepartment, message:"Department deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting department' });
    }
}

// Delete a subdepartment by its id (from a department)
export const deleteSubDepartment = async (req, res) => {
    try {
        const { departmentId, subdepartmentId } = req.params
        const department = await DepartmentModel.findById(departmentId)
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' })
        }
        const subIndex = department.subdepartments.findIndex(
            (sub) => sub._id.toString() === subdepartmentId
        )
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'SubDepartment not found' })
        }
        department.subdepartments.splice(subIndex, 1)
        await department.save()
        res.status(200).json({ success: true, data: department, message: "SubDepartment deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting subdepartment' });
    }
}