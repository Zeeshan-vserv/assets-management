import AssetModel from "../models/assetModel.js";

export const createAsset = async (req, res) => {

    const { ...assetData } = req.body

    try{
        const newAsset = new AssetModel({...assetData})

       const asset = await newAsset.save()
       res.status(201).json({asset, message: "Asset Created"}) 
    }
    catch(err){
        res.status(400).json({message: err.message})
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
    try{
        const { id } = req.params
        const updateAsset = await AssetModel.findByIdAndUpdate(id, req.body, {new: true})
        if(!updateAsset){
            return res.status(404).json({success:false, message: 'Asset not found'})
        }
        res.status(200).json({success: true, data: updateAsset, message:'Asset updated successfully'})
    }
    catch(err){
        res.status(400).json({success: false, message: "Failed to update Asset"})
    }
}

export const deleteAsset = async (req, res)=>{
    try{
        const { id } = req.params
        const deleteAsset = await AssetModel.findByIdAndDelete(id)
        if(!deleteAsset){
            return res.status(404).json({success:false, message: 'Asset not found'})
        }
        res.status(200).json({success: true, data: asset, message: 'Asset deleted successfully'})
    }
    catch(err){
        res.status(500).json({success: false, message: 'Failed to delete Asset'})
    }
}