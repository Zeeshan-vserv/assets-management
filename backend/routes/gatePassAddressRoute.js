import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createGatePassAddress, deleteGatePassAddress, getAllGatePassAddress, getGatePassAddressById, updateGatePassAddress } from '../controllers/GatePassAddressController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('gatePassAddress', 'isEdit'), createGatePassAddress);
router.get('/', authMiddleware, requirePagePermission('gatePassAddress', 'isView'), getAllGatePassAddress);
router.get('/:id', authMiddleware, requirePagePermission('gatePassAddress', 'isView'), getGatePassAddressById);
router.put('/:id', authMiddleware, requirePagePermission('gatePassAddress', 'isEdit'), updateGatePassAddress);
router.delete('/:id', authMiddleware, requirePagePermission('gatePassAddress', 'isDelete'), deleteGatePassAddress);

export default router;