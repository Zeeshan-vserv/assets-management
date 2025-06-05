import express from 'express';
import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from '../controllers/AssetController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router()

router.post('/', authMiddleware, createAsset)
router.get('/', authMiddleware, getAllAssets)
router.get('/:id', authMiddleware, getAssetById)
router.put('/:id', authMiddleware, updateAsset)
router.delete('/:id', authMiddleware, deleteAsset)

export default router