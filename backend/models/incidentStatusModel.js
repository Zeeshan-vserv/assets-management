import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    statusName: { type: String, required: true }, 
    description: String,                          
    clockHold: { type: String },                 
    reason: String,                             
    changedAt: { type: Date, default: Date.now }, 
    changedBy: String
});

export const IncidentStatusModel = mongoose.model("IncidentStatus", statusSchema);

