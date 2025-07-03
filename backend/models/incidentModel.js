import mongoose from "mongoose";

const statusEntrySchema = new mongoose.Schema({
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: String
}, { _id: false });

const fieldChangeEntrySchema = new mongoose.Schema({
    changes: Object, // { fieldName: { from, to }, ... }
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
    sla: String,
    tat: String,
    feedback: String,
    attachment: String,
    submitter:{
        user: String,
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
        severityLevel: String,
        supportDepartmentName: String,
        supportGroupName: String,
        technician: String
    },
    statusTimeline: [statusEntrySchema],
    fieldChangeHistory: [fieldChangeEntrySchema]
}, { timestamps: true})

const IncidentModel = mongoose.model('Incident', incidentSchema)

export default IncidentModel