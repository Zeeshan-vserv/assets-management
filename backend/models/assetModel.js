import mongoose from "mongoose";

const assetSchema = mongoose.Schema(
    {
        userId: String,
        assetId: Number,
        assetInformation: {
            category: String,
            assetTag: String,
            criticality: String,
            make: String,
            model: String,
            serialNumber: String,
            expressServiceCode: String,
            ipAddress: String,
            operatingSystem: String,
            cpu: String,
            hardDisk: String,
            ram: String,
            assetImage: String,
            loggedTime: { type: Date, default: Date.now },
        },
        assetState: {
            assetIsCurrently: String,
            user: String,
            department: String,
            subDepartment: String,
            comment: String
        },
        locationInformation: {
            location: String,
            subLocation: String,
            storeLocation: String,
        },
        warrantyInformation: {
            vendor: String,
            assetType: String,
            supportType: String,
        },
        financeInformation: {
            poNo: String,
            poDate: Date,
            invoiceNo: String,
            invoiceDate: Date,
            assetCost: String,
            residualCost: String,
            assetLife: String,
            depreciation: String,
            hsnCode: String,
            costCenter: String,
        },
        preventiveMaintenance: {
            pmCycle: String,
            schedule: String,
            istPmDate: Date
        },
        updateHistory: [
            {
                updatedBy: String,     
                updatedAt: { type: Date, default: Date.now },
                changes: Object   
            }
        ],

    },
    { timestamps: true }
)

const AssetModel = mongoose.model('Asset', assetSchema)

export default AssetModel;