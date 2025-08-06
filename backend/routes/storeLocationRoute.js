import express from 'express';
import { createStoreLocation, deleteStoreLocation, getAllStoreLocations, getStoreLocationById, updateStoreLocation } from '../controllers/StoreLocationController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('storeLocation', 'isEdit'), createStoreLocation)
router.get('/', authMiddleware, requirePagePermission('storeLocation', 'isView'), getAllStoreLocations)
router.get('/:id', authMiddleware, requirePagePermission('storeLocation', 'isView'), getStoreLocationById)
router.put('/:id', authMiddleware, requirePagePermission('storeLocation', 'isEdit'), updateStoreLocation)
router.delete('/:id', authMiddleware, requirePagePermission('storeLocation', 'isDelete'), deleteStoreLocation)

export default router;