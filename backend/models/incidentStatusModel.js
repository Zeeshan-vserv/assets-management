import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
    statusName: { type: String, required: true }, 
    description: String,                          
    clockHold: { type: String },                 
    reason: String,                             
    changedAt: { type: Date, default: Date.now }, 
    changedBy: String
});

const incidentStatusSchema = new mongoose.Schema({
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident", required: true },
    statusTimeline: [statusHistorySchema]
}, { timestamps: true });

export const IncidentStatusModel = mongoose.model("IncidentStatus", incidentStatusSchema);

