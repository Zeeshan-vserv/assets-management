import mongoose from "mongoose";

const statusEntrySchema = new mongoose.Schema({
    status: { type: String, required: true },
    closingSummary: String,
    closeRemarks: String,
    closureCategory: String,
    attachment: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: String
}, { _id: false });

const fieldChangeEntrySchema = new mongoose.Schema({
    changes: Object, 
    changedAt: { type: Date, default: Date.now },
    changedBy: String
}, { _id: false });

const approvalEntrySchema = new mongoose.Schema({
  approver: String, // email or userId
  level: Number,
  status: { type: String, default: "Pending" },
  remarks: String
}, { _id: false });

const serviceRequestSchema = new mongoose.Schema({
    userId: String,
    serviceId: String,
    subject: String,
    loggedVia: String,
    category: String,
    subCategory: String,
    requestDescription: String,
    catalogueDescription: String,
    purchaseRequest: { type: Boolean, default: false },
    cost: Number,
    approval: { type: Boolean, default: false },
    approver1: String,
    approver2: String,
    approver3: String,
    submitter:{
        user: String,
        userEmail: String,
        loggedBy: String,
        loggedInTime: { type: Date, default: Date.now }
    },
    asset: {
        asset: String,
        make: String,
        model: String,
        serialNo: String
    },
    location: {
        location: String,
        subLocation: String,
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
    fieldChangeHistory: [fieldChangeEntrySchema],
    approvalStatus: [approvalEntrySchema]
}, { timestamps: true})

const ServiceRequestModel = mongoose.model('ServiceRequest', serviceRequestSchema)

export default ServiceRequestModel