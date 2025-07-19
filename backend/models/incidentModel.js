import mongoose from "mongoose";

const statusEntrySchema = new mongoose.Schema({
    status: { type: String, required: true },
    closingSummary: String,
closeRemarks: String,
closureCategory: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: String
}, { _id: false });

const fieldChangeEntrySchema = new mongoose.Schema({
    changes: Object, 
    changedAt: { type: Date, default: Date.now },
    changedBy: String
}, { _id: false });

const incidentSchema = mongoose.Schema({
    userId: String,
    incidentId: String,
    subject: String,
    category: String,
    subCategory: String,
    loggedVia: String,
    description: String,
    status: {type: String, default:"New"},
    sla: { type: Date },
    isSla: {type: Boolean, default: true},
    tat: String,
    feedback: { type: String, default: "N/A"},
    attachment: String,
    submitter:{
        user: String,
        userId: String,
        userContactNumber: Number,
        userEmail: String,
        userDepartment: String,
        loggedBy: String,
        loggedInTime: { type: Date, default: Date.now }
    },
    assetDetails: {
        asset: String,
        make: String,
        model: String,
        serialNo: String
    },
    locationDetails: {
        location: String,
        subLocation: String,
        floor: String,
        roomNo: String
    },
    classificaton: {
        excludeSLA: {type: Boolean, default: false},
        severityLevel: { type: String, default: "Severity-3" },
        priorityLevel: { type: String, default: "Priority-3" },
        supportDepartmentName: String,
        supportGroupName: String,
        technician: String
    },
    statusTimeline: [statusEntrySchema],
    fieldChangeHistory: [fieldChangeEntrySchema]
}, { timestamps: true})

const IncidentModel = mongoose.model('Incident', incidentSchema)

export default IncidentModel