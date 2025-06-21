import GatePass from "../models/gatePassModel.js";

// export const createGatePass = async (req, res) => {
//     try {
//         const { userId, ...gatePassData } = req.body
        
//         if(!userId){
//             return res.status(404).json({message:'User not found'})
//         }

//         if (req.file) {
//             gatePassData.attachment = req.file.path;
//         }

//         const newGatePass = new GatePass({
//             userId,
//             ...gatePassData
//         })
//         await newGatePass.save()

//         res.status(201).json({success:true, data:newGatePass, message:'Gate Pass created successfully'})
//     } catch (error) {
//         res.status(500).json({message:'An error occurred while crearig gate pass'})
//     }
// }

export const createGatePass = async (req, res) => {
    try {
        const { userId, ...gatePassData } = req.body

        if(!userId){
            return res.status(404).json({message:'User not found'})
        }

        // Parse JSON fields if they exist
        if (gatePassData.consumables && typeof gatePassData.consumables === "string") {
            gatePassData.consumables = JSON.parse(gatePassData.consumables);
        }
        if (gatePassData.others && typeof gatePassData.others === "string") {
            gatePassData.others = JSON.parse(gatePassData.others);
        }

        // Convert approvalRequired to Boolean
        if (typeof gatePassData.approvalRequired === "string") {
            gatePassData.approvalRequired = gatePassData.approvalRequired === "true";
        }

        if (req.file) {
            gatePassData.attachment = req.file.path;
        }

        const newGatePass = new GatePass({
            userId,
            ...gatePassData
        })
        await newGatePass.save()

        res.status(201).json({success:true, data:newGatePass, message:'Gate Pass created successfully'})
    } catch (error) {
        console.error(error); // <--- Add this for debugging
        res.status(500).json({message:'An error occurred while creating gate pass'})
    }
}

export const getAllGatePass = async (req, res) => {
    try {
        const gatePass = await GatePass.find()
        res.status(200).json({success: true, data: gatePass})
    } catch (error) {
        res.status(500).json({message:'An error occurred while fetchig gate pass'})
    }
}

export const getGatePassById = async (req, res) => {
    try {
        const { id } = req.params
        const gatePass = await GatePass.findById(id)
        if(!gatePass){
            return res.status(404).json({success:false, message:'Gate Pass not found'})
        }
        res.status(200).json({success: true, data: gatePass})
    } catch (error) {
        res.status(500).json({message:'An errr occurred while fetchig gate pass'})
    }
}

export const updateGatePass  = async (req, res) => {
    try {
       const { id } = req.params
       let updateData = { ...req.body };

       // Handle file upload
        if (req.file) {
            updateData.attachment = req.file.path;
        }

       const updatedGatePass = await GatePass.findByIdAndUpdate(id, updateData, {new: true})
       if(!updatedGatePass){
        return res.status(404).json({success:false, message:'Gate Pass Id not found'})
       } 
       res.status(201).json({success:true, data: updatedGatePass, message:'Gate Pass updated successfully'})
    } catch (error) {
        res.status(500).json({message:'An error occurred while updating gate pass'})
    }
}

export const deleteGatePass = async (req, res) => {
    try {
        const { id } = req.params
        const deletedGatePass = await GatePass.findByIdAndDelete(id)
        if(!deletedGatePass){
            return res.status(404).json({success:false, message:'Gate Pass Id not found'})
        }
        res.status(200).json({success:true, message:'Gate Pass deleted successfully'})
    } catch (error) {
        res.status(500).json({message:'An error occurred while deleting gate pass'})
    }
}