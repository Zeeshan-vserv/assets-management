import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createCondition, deleteCondition, getAllConditions, getConditionById, updateCondition } from '../controllers/ConditionController.js';

const router = express.Router()

router.post('/', authMiddleware, createCondition )
router.get('/', authMiddleware, getAllConditions)
router.get('/:id', authMiddleware, getConditionById)
router.put('/:id', authMiddleware, updateCondition)
router.delete('/:id', authMiddleware, deleteCondition)

export default router;