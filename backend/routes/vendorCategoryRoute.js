import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'
import { createVedorCategory, deleteVendorCategory, getAllVendorCategory, getVendorCategoryById, updateVendorCategory } from '../controllers/vendorCategoryController.js'

const router = express.Router()

router.post('/', authMiddleware, requirePagePermission('vendorCategory', 'isEdit'), createVedorCategory)
router.get('/', authMiddleware, requirePagePermission('vendorCategory', 'isView'), getAllVendorCategory)
router.get('/:id', authMiddleware, requirePagePermission('vendorCategory', 'isView'), getVendorCategoryById)
router.put('/:id', authMiddleware, requirePagePermission('vendorCategory', 'isEdit'), updateVendorCategory)
router.delete('/:id', authMiddleware, requirePagePermission('vendorCategory', 'isDelete'), deleteVendorCategory)

export default router