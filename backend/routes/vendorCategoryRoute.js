import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createVedorCategory, deleteVendorCategory, getAllVendorCategory, getVendorCategoryById, updateVendorCategory } from '../controllers/vendorCategoryController.js'

const router = express.Router()

router.post('/', authMiddleware, createVedorCategory)
router.get('/', authMiddleware, getAllVendorCategory)
router.get('/:id', authMiddleware, getVendorCategoryById)
router.put('/:id', authMiddleware, updateVendorCategory)
router.delete('/:id', authMiddleware, deleteVendorCategory)

export default router