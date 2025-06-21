import express from 'express';
import { createStoreLocation, deleteStoreLocation, getAllStoreLocations, getStoreLocationById, updateStoreLocation } from '../controllers/StoreLocationController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createStoreLocation)
router.get('/', authMiddleware, getAllStoreLocations)
router.get('/:id', authMiddleware, getStoreLocationById)
router.put('/:id', authMiddleware, updateStoreLocation)
router.delete('/:id', authMiddleware, deleteStoreLocation)

export default router;