import mongoose, { mongo } from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: String,
    statusId: Number,
    statusName: String
}, {timestamps: true})

const StatusModel = mongoose.model('Status', statusSchema);
export default StatusModel;