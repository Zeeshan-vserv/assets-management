import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createStatus, deleteStatus, getAllStatus, getStatusById, updateStatus } from '../controllers/statusController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('status', 'isEdit'), createStatus)
router.get('/', authMiddleware, requirePagePermission('status', 'isView'), getAllStatus)
router.get('/:id', authMiddleware, requirePagePermission('status', 'isView'), getStatusById)
router.put('/:id', authMiddleware, requirePagePermission('status', 'isEdit'), updateStatus)
router.delete('/:id', authMiddleware, requirePagePermission('status', 'isDelete'), deleteStatus)

export default router;