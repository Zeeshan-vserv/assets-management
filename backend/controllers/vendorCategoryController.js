import VendorCategoryModel from "../models/vendorCategoryModel.js";

export const createVedorCategory = async (req, res) => {
    try {
        const { userId, categoryName } = req.body;

        if (!userId) {
            return res.status(404).json({ message: 'User not found'})
        }

        if(!categoryName){
            return res.status(400).json({ message: 'Category name is required'})
        }

        // Get next Vendor Category Id
                const lastVedorCategory = await VendorCategoryModel.findOne().sort({ categoryId: -1 });
                const nextVendorCategoryId = lastVedorCategory ? lastVedorCategory.categoryId + 1 : 1;

        const newVendorCategory = new VendorCategoryModel({
            userId,
            categoryId: nextVendorCategoryId,
            categoryName
        })

        await newVendorCategory.save();
        res.status(201).json({ success: true, data: newVendorCategory, message: 'Vendor Category created successfully'})

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getAllVendorCategory = async (req, res) => {
    try {
        const vendorCategory = await VendorCategoryModel.find()
        res.status(200).json({ success: true, data: vendorCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

export const getVendorCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const vendorCategory = await VendorCategoryModel.findById(id);
        if(!vendorCategory){
            return res.status(404).json({ success: false, message: 'Vendor category not found'})
        }
        res.status(200).json({ success:true, data: vendorCategory})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching vendor category'})
    }
}

export const updateVendorCategory = async (req, res) => {
    try {
        const { id } = req.params
        const vendorCategoryData = await VendorCategoryModel.findByIdAndUpdate(id, req.body, { new:true})

        if (!vendorCategoryData) {
            return res.status(40).json({ success: false, message: 'Vendor category not found'})
        }
        res.status(200).json({ success: true, data: vendorCategoryData, message: 'Vendor category updated successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while fetching vendor category'})
    }
}

export const deleteVendorCategory = async (req, res) => {
    try {
        const { id }= req.params
        const deletedVendorCategory = await VendorCategoryModel.findByIdAndDelete(id)
        if (!deletedVendorCategory){
            return res.status(404).json({ success: false, message: 'Vendor category not found'})
        }
        res.status(200).json({ success: true, message: 'Vendor category deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'Internal server error while deleting vendor category'})
    }
}