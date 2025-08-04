import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'
import { addSubLOcation, createLocation, deleteLocation, deleteSubLocation, getAllLocation, getAllSubLocation, getLocationById, getSubLocationById, updateLocation, updateSubLocation } from '../controllers/LocationController.js'

const router = express.Router()

router.post('/', authMiddleware, requirePagePermission('location', 'isEdit'), createLocation)
router.post('/:locationId/sublocation', authMiddleware, requirePagePermission('location', 'isEdit'), addSubLOcation)
router.get('/', authMiddleware, requirePagePermission('location', 'isView'), getAllLocation)
router.get('/sublocation', authMiddleware, requirePagePermission('location', 'isView'), getAllSubLocation)
router.get('/:id', authMiddleware, requirePagePermission('location', 'isView'), getLocationById)
router.get('/sublocation/:id', authMiddleware, requirePagePermission('location', 'isView'), getSubLocationById)
router.put('/:id', authMiddleware, requirePagePermission('location', 'isEdit'), updateLocation)
router.put('/sublocation/:id', authMiddleware, requirePagePermission('location', 'isEdit'), updateSubLocation)
router.delete('/:id', authMiddleware, requirePagePermission('location', 'isDelete'), deleteLocation)
router.delete('/:locationId/sublocation/:subLocationId', authMiddleware, requirePagePermission('location', 'isDelete'), deleteSubLocation)

export default router