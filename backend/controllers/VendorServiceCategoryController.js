import VendorServiceCategoryModel from "../models/vendorServiceCategoryModel.js";

export const createVendorServiceCategory = async (req, res) =>{
    try {
        const { userId, vendorServiceCategoryName } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!vendorServiceCategoryName){
            return res.status(400).json({ message: 'Vendor service category name is required'})
        }

        // Get next Vendor Category Id
                const lastVedorServiceCategory = await VendorServiceCategoryModel.findOne().sort({ vendorServiceCategoryId: -1 });
                const nextVendorServiceCategoryId = lastVedorServiceCategory ? lastVedorServiceCategory.vendorServiceCategoryId + 1 : 1;

        const newVendorServiceCategory = new VendorCategoryModel({
            userId,
            vendorServiceCategoryId: nextVendorServiceCategoryId,
            vendorServiceCategoryName
        })

        await newVendorServiceCategory.save();
        res.status(201).json({ success: true, data: newVendorServiceCategory, message: 'Vendor Service Category created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllVendorServiceCategory = async (req, res) => {
    try {
        const vendorServiceCategory = await VendorServiceCategoryModel.find()
        res.status(200).json({ success: true, data: vendorServiceCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getVendorServiceCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const vendorServiceCategory = await VendorServiceCategoryModel.findById(id);
        if(!vendorServiceCategory){
            return res.status(404).json({ success: false, message: 'Vendor service category not found'})
        }
        res.status(200).json({ success:true, data: vendorServiceCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching vendor service category'})
    }
}

export const updateVendorServiceCategory = async (req, res) => {
    try {
        const { id } = req.params
        const vendorServiceCategoryData = await VendorServiceCategoryModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!vendorServiceCategoryData) {
            return res.status(40).json({ success: false, message: 'Vendor service category not found'})
        }
        res.status(200).json({ success: true, data: vendorServiceCategoryData, message: 'Vendor service category updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching vendor service category'})
    }
}

export const deleteVendorServiceCategory = async (req, res) => {
    try {
        const { id }= req.params
        const deletedVendorServiceCategory = await VendorServiceCategoryModel.findByIdAndDelete(id)
        if (!deletedVendorServiceCategory){
            return res.status(404).json({ success: false, message: 'Vendor service category not found'})
        }
        res.status(200).json({ success: true, message: 'Vendor service category deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting vendor service category'})
    }
}