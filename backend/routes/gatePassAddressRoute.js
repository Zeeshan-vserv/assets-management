import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createGatePassAddress, deleteGatePassAddress, getAllGatePassAddress, getGatePassAddressById, updateGatePassAddress } from '../controllers/GatePassAddressController.js';

const router = express.Router()

router.post('/', authMiddleware, createGatePassAddress )
router.get('/', authMiddleware, getAllGatePassAddress)
router.get('/:id', authMiddleware, getGatePassAddressById)
router.put('/:id', authMiddleware, updateGatePassAddress)
router.delete('/:id', authMiddleware, deleteGatePassAddress)

export default router;