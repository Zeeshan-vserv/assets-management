import express from 'express';
import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from '../controllers/AssetController.js';

const router = express.Router()

router.post('/', createAsset)
router.get('/', getAllAssets)
router.get('/:id', getAssetById)
router.put('/:id', updateAsset)
router.delete('/:id', deleteAsset)

export default router