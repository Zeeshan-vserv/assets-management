import express from 'express'
import { createVendorServiceCategory, deleteVendorServiceCategory, getAllVendorServiceCategory, getVendorServiceCategoryById, updateVendorServiceCategory } from '../controllers/VendorServiceCategoryController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createVendorServiceCategory)
router.get('/', authMiddleware, getAllVendorServiceCategory)
router.get('/:id', authMiddleware, getVendorServiceCategoryById)
router.put('/:id', authMiddleware, updateVendorServiceCategory)
router.delete('/:id', authMiddleware, deleteVendorServiceCategory)

export default router