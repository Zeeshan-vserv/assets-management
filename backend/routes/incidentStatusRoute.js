import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createIncidentStatus, deleteIncidentStatus, getAllIncidentStatus, getIncidentStatusById, updateIncidentStatus } from '../controllers/IncidentStatusController.js';

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('incidentStatus', 'isEdit'), createIncidentStatus)
router.get('/', authMiddleware, requirePagePermission('incidentStatus', 'isView'), getAllIncidentStatus)
router.get('/:id', authMiddleware, requirePagePermission('incidentStatus', 'isView'), getIncidentStatusById)
router.put('/:id', authMiddleware, requirePagePermission('incidentStatus', 'isEdit'), updateIncidentStatus)
router.delete('/:id', authMiddleware, requirePagePermission('incidentStatus', 'isDelete'), deleteIncidentStatus)

export default router;