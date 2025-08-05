import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    userId: String,
    vendorCode: String,
    vendorName: String,
    contactPerson: String,
    contactNumber: Number,
    emailAddress: String,
    city: String,
    address: String,
    vendorCategory: String,
    vendorStatus: {type: String},
    serviceCategory: String,
    notes: String
}, {timestamps: true})

const VendorModel = mongoose.model('Vendor', vendorSchema)
export default VendorModel;