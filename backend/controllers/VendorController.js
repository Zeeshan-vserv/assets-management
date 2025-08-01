import VendorModel from "../models/vendorModel.js";

export const createVendor = async (req, res) => {
    try {
        const { userId, ...vendorData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }

        const newVendor = new VendorModel({
            userId,
            ...vendorData
        });

        const vendor = await newVendor.save();
        res.status(201).json({ vendor, message: "Vendor Created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllVendors = async (req, res) => {
    try {
        const vendors = await VendorModel.find();
        res.status(200).json({ success: true, data: vendors });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await VendorModel.findById(id).populate('userId', 'emailAddress');
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }
        res.status(200).json({ success: true, data: vendor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVendor = await VendorModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }
        res.status(200).json({ success: true, data: updatedVendor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await VendorModel.findByIdAndDelete(id);
        if (!deletedVendor) {
            return res.status(404).json({ success: false, message: 'Vendor not found' });
        }
        res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
