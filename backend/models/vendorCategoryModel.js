import mongoose from "mongoose";

const vendorCategorySchema = new mongoose.Schema({
    userId: String,
    categoryId: Number,
    categoryName: String
}, {timestamps: true})

const VendorCategoryModel = mongoose.model('VendorCategory', vendorCategorySchema)
export default VendorCategoryModel;