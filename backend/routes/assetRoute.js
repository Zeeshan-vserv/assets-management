import express from 'express';
import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from '../controllers/AssetController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/assets/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const router = express.Router()

router.post('/', authMiddleware, createAsset)
router.get('/', authMiddleware, getAllAssets)
router.get('/:id', authMiddleware, getAssetById)
router.put('/:id', authMiddleware, updateAsset)
router.delete('/:id', authMiddleware, deleteAsset)

export default router