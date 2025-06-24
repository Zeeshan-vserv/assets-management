import ConsumableModel from "../models/consumableModel.js";

// Create Consumable
export const createConsumable = async (req, res) => {
    try {
        const { userId, consumableName, subConsumables = [] } = req.body;
        if (!userId) return res.status(400).json({ message: 'User not found' });
        if (!consumableName) return res.status(400).json({ message: 'Consumable name is required' });

        const lastConsumable = await ConsumableModel.findOne().sort({ consumableId: -1 });
        const nextConsumableId = lastConsumable ? lastConsumable.consumableId + 1 : 1;

        const subConsumableWithIds = subConsumables.map((sub, idx) => ({
            subConsumableId: idx + 1,
            subConsumableName: sub.subConsumableName
        }));

        const newConsumable = new ConsumableModel({
            userId,
            consumableId: nextConsumableId,
            consumableName,
            subConsumables: subConsumableWithIds
        });

        await newConsumable.save();
        res.status(201).json({ success: true, data: newConsumable, message: 'Consumable created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating consumable' });
    }
};

// Add SubConsumable
export const addSubConsumable = async (req, res) => {
    try {
        const { consumableId } = req.params;
        const { subConsumableName } = req.body;

        if (!subConsumableName) {
            return res.status(400).json({ success: false, message: 'SubConsumable name is required' });
        }

        const consumable = await ConsumableModel.findOne(consumableId);
        if (!consumable) {
            return res.status(404).json({ success: false, message: 'Consumable not found' });
        }

        const lastSub = consumable.subConsumables.length > 0
            ? Math.max(...consumable.subConsumables.map(sub => sub.subConsumableId))
            : 0;
        const nextSubId = lastSub + 1;

        consumable.subConsumables.push({
            subConsumableId: nextSubId,
            subConsumableName
        });

        await consumable.save();
        res.status(201).json({ success: true, data: consumable, message: 'Sub Consumable added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding sub consumable' });
    }
};

// Get All Consumables
export const getAllConsumables = async (req, res) => {
    try {
        const consumable = await ConsumableModel.find();
        res.status(200).json({ success: true, data: consumable });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching consumables' });
    }
};

// Get All SubConsumables
export const getAllSubConsumables = async (req, res) => {
    try {
        const consumable = await ConsumableModel.find();
        const allSubConsumables = consumable.flatMap(con => con.subConsumables);
        res.status(200).json({ success: true, data: allSubConsumables });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching sub consumables' });
    }
};

// Get Consumable By Id
export const getConsumableById = async (req, res) => {
    try {
        const { id } = req.params;
        const consumable = await ConsumableModel.findById(id);
        if (!consumable) {
            return res.status(404).json({ success: false, message: 'Consumable not found' });
        }
        res.status(200).json({ success: true, data: consumable });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching consumable' });
    }
};

// Get SubConsumable By Id (by subConsumableId)
export const getSubConsumableById = async (req, res) => {
    try {
        const { id } = req.params;
        const consumables = await ConsumableModel.find();
        for (const con of consumables) {
            const sub = con.subConsumables.find(sub => sub.subConsumableId === Number(id));
            if (sub) {
                return res.status(200).json({ success: true, data: sub });
            }
        }
        res.status(404).json({ success: false, message: 'Sub Consumable not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching sub consumables' });
    }
};

// Update Consumable
export const updateConsumable = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedConsumable = await ConsumableModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedConsumable) {
            return res.status(404).json({ success: false, message: 'Consumable not found' });
        }
        res.status(200).json({ success: true, data: updatedConsumable, message: 'Consumable updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating consumables' });
    }
};

// Update SubConsumable (by subConsumableId)
export const updateSubConsumable = async (req, res) => {
    try {
        const { id } = req.params;
        const consumables = await ConsumableModel.find();
        for (const con of consumables) {
            const sub = con.subConsumables.id(id)
            if (sub) {
                Object.assign(sub, req.body);
                await con.save();
                return res.status(200).json({ success: true, data: sub, message: 'Sub Consumable updated successfully' });
            }
        }
        res.status(404).json({ success: false, message: 'Sub Consumable not found' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating sub consumables' });
    }
};

// Delete Consumable
export const deleteConsumable = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedConsumables = await ConsumableModel.findByIdAndDelete(id);
        if (!deletedConsumables) {
            return res.status(404).json({ success: false, message: 'Consumable not found' });
        }
        res.status(200).json({ success: true, message: 'Consumable deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting consumable' });
    }
};

// Delete SubConsumable (by subConsumableId)
export const deleteSubConsumable = async (req, res) => {
    try {
        const { consumableId, subConsumableId } = req.params;
        const consumable = await ConsumableModel.findById(consumableId);
        if (!consumable) {
            return res.status(404).json({ success: false, message: 'Consumable not found' });
        }
        const subIndex = consumable.subConsumables.findIndex(
            (sub) => sub._id.toString() === subConsumableId
        );
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'Sub consumable not found' });
        }
        consumable.subConsumables.splice(subIndex, 1);
        await consumable.save();
        res.status(200).json({ success: true, message: "SubConsumable deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting sub consumables' });
    }
};