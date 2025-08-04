import express from 'express'
import { createVendorServiceCategory, deleteVendorServiceCategory, getAllVendorServiceCategory, getVendorServiceCategoryById, updateVendorServiceCategory } from '../controllers/VendorServiceCategoryController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, requirePagePermission('vendorServiceCategory', 'isEdit'), createVendorServiceCategory)
router.get('/', authMiddleware, requirePagePermission('vendorServiceCategory', 'isView'), getAllVendorServiceCategory)
router.get('/:id', authMiddleware, requirePagePermission('vendorServiceCategory', 'isView'), getVendorServiceCategoryById)
router.put('/:id', authMiddleware, requirePagePermission('vendorServiceCategory', 'isEdit'), updateVendorServiceCategory)
router.delete('/:id', authMiddleware, requirePagePermission('vendorServiceCategory', 'isDelete'), deleteVendorServiceCategory)

export default router