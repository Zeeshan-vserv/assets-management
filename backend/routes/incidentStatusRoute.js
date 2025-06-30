import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createIncidentStatus, deleteIncidentStatus, getAllIncidentStatus, getIncidentStatusById, updateIncidentStatus } from '../controllers/IncidentStatusController.js';

const router = express.Router();

router.post('/', authMiddleware, createIncidentStatus)
router.get('/', authMiddleware, getAllIncidentStatus)
router.get('/:id', authMiddleware, getIncidentStatusById)
router.put('/:id', authMiddleware, updateIncidentStatus)
router.delete('/:id', authMiddleware, deleteIncidentStatus)

export default router;