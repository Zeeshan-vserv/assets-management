import mongoose from "mongoose";

const incidentSchema = mongoose.Schema({
    userId: String,
    incidentId: String,
    subject: String,
    category: String,
    subCategory: String,
    loggedVia: String,
    description: String,
    submitter:{
        user: String,
        userContactNumber: Number,
        userEmail: String,
        loggedBy: String
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
    }
}, { timestamps: true})

const IncidentModel = mongoose.model('Incident', incidentSchema)

export default IncidentModel