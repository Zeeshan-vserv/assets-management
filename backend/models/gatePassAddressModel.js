import mongoose from "mongoose";

const gatePassAddressSchema = new mongoose.Schema({
    userId: String,
    addressId: Number,
    addressName: String
}, {timestamps: true})

const GatePassAddressModel = mongoose.model('GatePassAddress', gatePassAddressSchema)
export default GatePassAddressModel