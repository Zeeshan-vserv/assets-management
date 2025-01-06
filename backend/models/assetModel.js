import mongoose from "mongoose";

const assetSchema = mongoose.Schema(
    {
        businessUnit : String,
        category : String,
        assetTag : String,
        criticality : String,
        make: String,
        model: String,
        serialNumber: String,
        expressServiceCode : String,
        ipAddress: String,
        operatingSystem : String,
        cpu: String,
        hardDisk: String,
        ram: String,
        assetImage: String,
        location: String,
        subLocation: String,
        storeLocation: String,
        vendor: String,
        assetType: String,
        supportType: String,
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
        pmCycle: String,
        schedule: String,
        istPmDate: Date
},
    { timestamps: true}
)

const AssetModel = mongoose.model('Asset', assetSchema)

export default AssetModel;