import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createIncident, deleteIncident, getAllIncident, getIncidentById, updateIncident } from '../controllers/IncidentController.js'

const router = express.Router()

router.post('/', authMiddleware, createIncident)
router.get('/', authMiddleware, getAllIncident)
router.get('/:id', authMiddleware, getIncidentById)
router.put('/:id', authMiddleware, updateIncident)
router.delete('/:id', authMiddleware, deleteIncident)

export default router