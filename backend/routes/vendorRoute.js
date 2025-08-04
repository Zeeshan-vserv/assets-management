import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createVendor, deleteVendor, getAllVendors, getVendorById, updateVendor } from '../controllers/VendorController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('vendor', 'isEdit'), createVendor);
router.get('/', authMiddleware, requirePagePermission('vendor', 'isView'), getAllVendors);
router.get('/:id', authMiddleware, requirePagePermission('vendor', 'isView'), getVendorById);
router.put('/:id', authMiddleware, requirePagePermission('vendor', 'isEdit'), updateVendor);
router.delete('/:id', authMiddleware, requirePagePermission('vendor', 'isDelete'), deleteVendor);

export default router;