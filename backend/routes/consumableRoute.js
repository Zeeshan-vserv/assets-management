import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { addSubConsumable, createConsumable, deleteConsumable, deleteSubConsumable, getAllConsumables, getAllSubConsumables, getConsumableById, getSubConsumableById, updateConsumable, updateSubConsumable } from '../controllers/ConsumableController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('consumable', 'isEdit'), createConsumable);
router.post('/:consumableId/subConsumable', authMiddleware, requirePagePermission('consumable', 'isEdit'), addSubConsumable);
router.get('/', authMiddleware, requirePagePermission('consumable', 'isView'), getAllConsumables);
router.get('/subConsumable', authMiddleware, requirePagePermission('consumable', 'isView'), getAllSubConsumables);
router.get('/:id', authMiddleware, requirePagePermission('consumable', 'isView'), getConsumableById);
router.get('/subConsumable/:id', authMiddleware, requirePagePermission('consumable', 'isView'), getSubConsumableById);
router.put('/:id', authMiddleware, requirePagePermission('consumable', 'isEdit'), updateConsumable);
router.put('/subConsumable/:id', authMiddleware, requirePagePermission('consumable', 'isEdit'), updateSubConsumable);
router.delete('/:id', authMiddleware, requirePagePermission('consumable', 'isDelete'), deleteConsumable);
router.delete('/:consumableId/subConsumable/:subConsumableId', authMiddleware, requirePagePermission('consumable', 'isDelete'), deleteSubConsumable);

export default router;