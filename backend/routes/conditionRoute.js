import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createCondition, deleteCondition, getAllConditions, getConditionById, updateCondition } from '../controllers/ConditionController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('condition', 'isEdit'), createCondition);
router.get('/', authMiddleware, requirePagePermission('condition', 'isView'), getAllConditions);
router.get('/:id', authMiddleware, requirePagePermission('condition', 'isView'), getConditionById);
router.put('/:id', authMiddleware, requirePagePermission('condition', 'isEdit'), updateCondition);
router.delete('/:id', authMiddleware, requirePagePermission('condition', 'isDelete'), deleteCondition);

export default router;