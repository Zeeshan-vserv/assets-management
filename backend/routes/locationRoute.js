import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createLocation, deleteLocation, deleteSubLocation, getAllLocation, getAllSubLocation, getLocationById, getSubLocationById, updateLocation, updateSubLocation } from '../controllers/LocationController.js'

const router = express.Router()

router.post('/', authMiddleware, createLocation)
router.get('/', getAllLocation)
router.get('/sublocation', getAllSubLocation)
router.get('/:id', getLocationById)
router.get('/sublocation/:id', getSubLocationById)
router.put('/', updateLocation)
router.put('/sublocation/:id', updateSubLocation)
router.delete('/:id', deleteLocation)
router.delete('/:locationId/sublocation/:id', deleteSubLocation)

export default router