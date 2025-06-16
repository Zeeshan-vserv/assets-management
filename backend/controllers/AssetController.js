import AssetModel from "../models/assetModel.js";
import xlsx from 'xlsx';
import fs from 'fs';

export const createAsset = async (req, res) => {
    try {
        const { userId, ...assetData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID not found' });
        }

        const lastAsset = await AssetModel.findOne().sort({ assetId: -1 });
        const nextAssetId = lastAsset ? lastAsset.assetId + 1 : 1;

        
        if (req.file) {
            if (!assetData.assetInformation) assetData.assetInformation = {};
            assetData.assetInformation.assetImage = req.file.path;
        }

        const newAsset = new AssetModel({
            userId,
            ...assetData,
            assetId: nextAssetId,
        });

        const asset = await newAsset.save();
        res.status(201).json({ asset, message: "Asset Created" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

export const getAllAssets = async (req, res) => {
    try{
        const assets = await AssetModel.find().populate('userId', 'emailAddrress')
        res.status(200).json({success: true,data: assets})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

export const getAssetById = async (req, res) => {
    try{
        const { id } = req.params
        const asset = await AssetModel.findById(id).populate('userId', 'emailAddrress')
        if(!asset){
            return res.status(404).json({success:false, message: 'Asset not found'})
        }
        res.status(200).json({success: true, data: asset})
        
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

export const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // If assetImage is uploaded, add its path
        if (req.file) {
            if (!updateData.assetInformation) updateData.assetInformation = {};
            updateData.assetInformation.assetImage = req.file.path;
        }

        // If using FormData, nested fields come as strings, so parse them
        // Convert fields like "assetInformation[category]": "Laptop" to nested objects
        const nestedFields = [
            "assetInformation",
            "assetState",
            "locationInformation",
            "warrantyInformation",
            "financeInformation",
            "preventiveMaintenance"
        ];
        nestedFields.forEach(section => {
            const sectionObj = {};
            Object.keys(updateData).forEach(key => {
                if (key.startsWith(section + "[")) {
                    const subKey = key.substring(section.length + 1, key.length - 1);
                    sectionObj[subKey] = updateData[key];
                    delete updateData[key];
                }
            });
            if (Object.keys(sectionObj).length > 0) {
                updateData[section] = sectionObj;
            }
        });

        const updatedAsset = await AssetModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedAsset) {
            return res.status(404).json({ success: false, message: "Asset not found" });
        }
        res.status(200).json({ success: true, data: updatedAsset, message: 'Asset updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating asset" });
    }
}

// export const updateAsset = async (req, res) => {
//     try {
//         const { id } = req.params;
//         let updateData = req.body;

//         // If assetImage is uploaded, add its path
//         if (req.file) {
//             if (!updateData.assetInformation) updateData.assetInformation = {};
//             updateData.assetInformation.assetImage = req.file.path;
//         }

//         const updatedAsset = await AssetModel.findByIdAndUpdate(id, updateData, { new: true });

//         if (!updatedAsset) {
//             return res.status(404).json({ success: false, message: "Asset not found" });
//         }
//         res.status(200).json({ success: true, data: updatedAsset, message: 'Asset updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: "An error occurred while updating asset" });
//     }
// };

export const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params
        const deleteAsset = await AssetModel.findByIdAndDelete(id)

        if(!deleteAsset){
            return res.status(404).json({success:false, message:'Asset Id not found'})
        }
        res.status(200).json({ success:true, data: deleteAsset, message:"Asset deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting Asset' });
    }
}

export const uploadAssetFromExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const assets = xlsx.utils.sheet_to_json(sheet);

        // Get the last assetId in the collection
        let lastAsset = await AssetModel.findOne().sort({ assetId: -1 });
        let nextAssetId = lastAsset ? lastAsset.assetId + 1 : 1;

        // Prepare assets for insertion
        const assetsToInsert = assets.map((asset) => {
            // Map flat Excel fields to nested schema if needed
            const assetInformation = {
                category: asset.category,
                assetTag: asset.assetTag,
                criticality: asset.criticality,
                make: asset.make,
                model: asset.model,
                serialNumber: asset.serialNumber,
                expressServiceCode: asset.expressServiceCode,
                ipAddress: asset.ipAddress,
                operatingSystem: asset.operatingSystem,
                cpu: asset.cpu,
                hardDisk: asset.hardDisk,
                ram: asset.ram,
                assetImage: asset.assetImage,
            };
            const locationInformation = {
                location: asset.location,
                subLocation: asset.subLocation,
                storeLocation: asset.storeLocation,
            };
            const warrantyInformation = {
                vendor: asset.vendor,
                assetType: asset.assetType,
                supportType: asset.supportType,
            };
            const financeInformation = {
                poNo: asset.poNo,
                poDate: asset.poDate,
                invoiceNo: asset.invoiceNo,
                invoiceDate: asset.invoiceDate,
                assetCost: asset.assetCost,
                residualCost: asset.residualCost,
                assetLife: asset.assetLife,
                depreciation: asset.depreciation,
                hsnCode: asset.hsnCode,
                costCenter: asset.costCenter,
            };
            const preventiveMaintenance = {
                pmCycle: asset.pmCycle,
                schedule: asset.schedule,
                istPmDate: asset.istPmDate,
            };

            // Assign assetId and increment for next
            const doc = {
                userId: asset.userId,
                assetId: nextAssetId++,
                assetInformation,
                locationInformation,
                warrantyInformation,
                financeInformation,
                preventiveMaintenance,
            };
            return doc;
        });

        // Insert assets into DB
        await AssetModel.insertMany(assetsToInsert);

        // Remove the uploaded file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ success: true, message: 'Assets uploaded successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to upload assets', error: error.message });
    }
}
