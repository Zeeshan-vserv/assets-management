import mongoose from "mongoose";

const vendorServiceCategorySchema = new mongoose.Schema({
    userId: String,
    vendorServiceCategoryId: Number,
    vendorServiceCategoryName: String
}, {timestamps: true})

const VendorServiceCategoryModel = mongoose.model('VendorServiceCategory', vendorServiceCategorySchema)
export default VendorServiceCategoryModel