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

function getChanges(oldObj, newObj, prefix = '') {
    let changes = {};
    for (const key in newObj) {
        const oldVal = oldObj ? oldObj[key] : undefined;
        const newVal = newObj[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof newVal === 'object' && newVal !== null && !Array.isArray(newVal)) {
            const nestedChanges = getChanges(oldVal || {}, newVal, path);
            Object.assign(changes, nestedChanges);
        } else if (oldVal !== newVal) {
            changes[path] = { from: oldVal, to: newVal };
        }
    }
    return changes;
}

export const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        const updatedBy = updateData.updatedBy; // Extract before deleting
        delete updateData.updatedBy;
        delete updateData.updateHistory;

        const asset = await AssetModel.findById(id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        // Find changed fields (deep diff)
        const changes = getChanges(asset.toObject(), updateData);

        // Update asset fields
        Object.assign(asset, updateData);

        // Push to updateHistory if there are changes
        if (Object.keys(changes).length > 0) {
            asset.updateHistory.push({
                updatedBy,
                updatedAt: new Date(),
                changes
            });
        }

        await asset.save();
        res.status(200).json({ success: true, data: asset, message: 'Asset updated and history recorded' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating asset', error: error.message });
    }
};

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
        const { userId } = req.body;
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
                userId: userId || asset.userId,
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

export const getAssetStatusCounts = async (req, res) => {
  try {
    const assetList = [
      "Total",
      "In Store",
      "Allocated",
      "In Repair",
      "Theft/Lost",
      "Discard/Replaced",
      "Disposed/Scrapped",
      "Sold"
    ];

    const pipeline = [
      {
        $group: {
          _id: "$assetState.assetIsCurrently",
          count: { $sum: 1 }
        }
      }
    ];

    const results = await AssetModel.aggregate(pipeline);

    const counts = {};
    assetList.forEach(status => {
      const found = results.find(r => r._id === status);
      counts[status] = found ? found.count : 0;
    });

    // Total count
    counts["Total"] = await AssetModel.countDocuments();

    res.json({ success: true, data: counts });
  } catch (error) {
    console.error("Error fetching asset counts:", error);
    res.status(500).json({ message: "Error fetching asset counts", error: error.message });
  }
};

