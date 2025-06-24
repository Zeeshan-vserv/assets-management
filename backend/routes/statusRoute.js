import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createStatus, deleteStatus, getAllStatus, getStatusById, updateStatus } from '../controllers/statusController.js';

const router = express.Router();

router.post('/', authMiddleware, createStatus)
router.get('/', authMiddleware, getAllStatus)
router.get('/:id', authMiddleware, getStatusById)
router.put('/:id', authMiddleware, updateStatus)
router.delete('/:id', authMiddleware, deleteStatus)

export default router;