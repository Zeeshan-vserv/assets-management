import GatePass from "../models/gatePassModel.js";

export const createGatePass = async (req, res) => {
    try {
        const { userId, ...gatePassData } = req.body

        if (!userId) {
            return res.status(404).json({ message: 'User not found' })
        }

       // Generate gatePassId with prefix GTP and leading zeros
        const lastGatePass = await GatePass.findOne().sort({ gatePassId: -1 });
        let nextNumber = 1;
        if (lastGatePass && lastGatePass.gatePassId) {
            const match = lastGatePass.gatePassId.match(/^GTP0*(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }
        // Pad the number to 4 digits
        const newGatePassId = `GTP${String(nextNumber).padStart(4, '0')}`;

        // Parse JSON fields if they exist
        if (gatePassData.asset && typeof gatePassData.asset === "string") {
            gatePassData.asset = JSON.parse(gatePassData.asset);
        }
         if (gatePassData.assetComponent && typeof gatePassData.assetComponent === "string") {
            gatePassData.assetComponent = JSON.parse(gatePassData.assetComponent);
        }
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
            gatePassId: newGatePassId,
            ...gatePassData
        })
        await newGatePass.save()

        res.status(201).json({ success: true, data: newGatePass, message: 'Gate Pass created successfully' })
    } catch (error) {
        console.error(error); // <--- Add this for debugging
        res.status(500).json({ message: 'An error occurred while creating gate pass' })
    }
}

export const getAllGatePass = async (req, res) => {
    try {
        const gatePass = await GatePass.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, data: gatePass })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetchig gate pass' })
    }
}

export const getGatePassById = async (req, res) => {
    try {
        const { id } = req.params
        const gatePass = await GatePass.findById(id)
        if (!gatePass) {
            return res.status(404).json({ success: false, message: 'Gate Pass not found' })
        }
        res.status(200).json({ success: true, data: gatePass })
    } catch (error) {
        res.status(500).json({ message: 'An errr occurred while fetchig gate pass' })
    }
}

export const updateGatePass = async (req, res) => {
    try {
        const { id } = req.params
        let updateData = { ...req.body };

        // Parse JSON fields if they exist
        if (updateData.consumables && typeof updateData.consumables === "string") {
            updateData.consumables = JSON.parse(updateData.consumables);
        }
        if (updateData.others && typeof updateData.others === "string") {
            updateData.others = JSON.parse(updateData.others);
        }

        // Convert approvalRequired to Boolean
        if (typeof updateData.approvalRequired === "string") {
            updateData.approvalRequired = updateData.approvalRequired === "true";
        }

        if (req.file) {
            updateData.attachment = req.file.path;
        }

        const updatedGatePass = await GatePass.findByIdAndUpdate(id, updateData, { new: true })
        if (!updatedGatePass) {
            return res.status(404).json({ success: false, message: 'Gate Pass Id not found' })
        }
        res.status(201).json({ success: true, data: updatedGatePass, message: 'Gate Pass updated successfully' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating gate pass' })
    }
}

export const deleteGatePass = async (req, res) => {
    try {
        const { id } = req.params
        const deletedGatePass = await GatePass.findByIdAndDelete(id)
        if (!deletedGatePass) {
            return res.status(404).json({ success: false, message: 'Gate Pass Id not found' })
        }
        res.status(200).json({ success: true, message: 'Gate Pass deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting gate pass' })
    }
}

export const approveGatePass = async (req, res) => {
  try {
    const { id } = req.params; 
    const { action, remarks } = req.body; 
    const approver = req.user.emailAddress;

    const gatePass = await GatePass.findById(id);
    if (!gatePass) {
      return res.status(404).json({ message: "Gate Pass not found" });
    }

    // Ensure approvalStatus exists
    if (!Array.isArray(gatePass.approvalStatus)) {
      gatePass.approvalStatus = [];
    }

    // Find current pending approval
    const currentApproval = gatePass.approvalStatus.find(a => a.status === "Pending");
    if (!currentApproval || currentApproval.approver !== approver) {
      return res.status(403).json({ message: "Not authorized or already acted" });
    }

    // Update status
    currentApproval.status = action;
    currentApproval.actionAt = new getISTDate();
    currentApproval.remarks = remarks;

    // If approved and next approver exists, set next to Pending
    if (action === "Approved") {
      const nextLevel = currentApproval.level + 1;
      const nextApproverField = `approverLevel${nextLevel}`;
      const nextApprover = gatePass[nextApproverField];
      if (nextApprover) {
        gatePass.approvalStatus.push({
          approver: nextApprover,
          level: nextLevel,
          status: "Pending"
        });
      } else {
        // All approvals done
        gatePass.approval = true;
      }
    } else if (action === "Rejected") {
      gatePass.approval = false;
    }

    await gatePass.save();
    res.json({ success: true, data: gatePass });
  } catch (error) {
    res.status(500).json({ message: "Error in approval", error: error.message });
  }
};