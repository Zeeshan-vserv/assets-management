import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createVendor, deleteVendor, getAllVendors, getVendorById, updateVendor } from '../controllers/VendorController.js';

const router = express.Router();

router.post('/', createVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router