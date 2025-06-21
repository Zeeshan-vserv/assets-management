import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { addSubConsumable, createConsumable, deleteConsumable, deleteSubConsumable, getAllConsumables, getConsumableById, getSubConsumableById, updateConsumable, updateSubConsumable } from '../controllers/ConsumableController.js';

const router = express.Router()

router.post('/', authMiddleware, createConsumable)
router.post('/:consumableId/subConsumable', authMiddleware, addSubConsumable)
router.get('/', authMiddleware, getAllConsumables)
router.get('/subConsumables', authMiddleware, getAllConsumables)
router.get('/:id', authMiddleware, getConsumableById)
router.get('/subConsumable/:id', authMiddleware, getSubConsumableById)
router.put('/:id', authMiddleware, updateConsumable)
router.put('/subConsumable/:id', authMiddleware, updateSubConsumable)
router.delete('/:id', authMiddleware, deleteConsumable)
router.delete('/:consumableId/subConsumable/:subConsumableId', authMiddleware, deleteSubConsumable)

export default router;