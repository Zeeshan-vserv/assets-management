import express from 'express';
import { createAsset, deleteAsset, getAllAssets, getAssetById, getAssetStatusCounts, updateAsset, uploadAssetFromExcel } from '../controllers/AssetController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js'; // <-- Add this
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

router.post(
    '/',
    authMiddleware,
    requirePagePermission('assets', 'isEdit'), // <-- Only users with assets.isEdit
    upload.single('assetImage'),
    createAsset
);

router.get(
    '/asset-counts',
    authMiddleware,
    requirePagePermission('assets', 'isView'), // <-- Only users with assets.isView
    getAssetStatusCounts
);

router.get(
    '/',
    authMiddleware,
    requirePagePermission('assets', 'isView'), // <-- Only users with assets.isView
    getAllAssets
);

router.get(
    '/:id',
    authMiddleware,
    requirePagePermission('assets', 'isView'), // <-- Only users with assets.isView
    getAssetById
);

router.put(
    '/:id',
    authMiddleware,
    requirePagePermission('assets', 'isEdit'), // <-- Only users with assets.isEdit
    upload.single('assetImage'),
    updateAsset
);

router.delete(
    '/:id',
    authMiddleware,
    requirePagePermission('assets', 'isEdit'), // <-- Only users with assets.isEdit
    deleteAsset
);

router.post(
    '/upload-excel',
    authMiddleware,
    requirePagePermission('assets', 'isEdit'), // <-- Only users with assets.isEdit
    upload.single('file'),
    uploadAssetFromExcel
);

export default router