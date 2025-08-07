import express from 'express'
import { createPublisher, createSoftware, createSoftwareCategory, deletePublisher, deleteSoftware, deleteSoftwareCategory, getAllPublisher, getAllSoftware, getAllSoftwareCategory, getPublisherById, getSoftwareById, getSoftwareCategoryById, updatePublisher, updateSoftware, updateSoftwareCategory } from '../controllers/SoftwareCategoryController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'

const router = express.Router()
router.get('/softwareCategory', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getAllSoftwareCategory)
router.get('/softwareCategory/:id', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getSoftwareCategoryById)
router.get('/publisher', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getAllPublisher)
router.get('/publisher/:id', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getPublisherById)
router.get('/', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getAllSoftware)
router.get('/:id', authMiddleware, requirePagePermission('softwareCategory', 'isView'), getSoftwareById)
// Software
router.post('/', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), createSoftware)

router.put('/:id', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), updateSoftware)
router.delete('/:id', authMiddleware, requirePagePermission('softwareCategory', 'isDelete'), deleteSoftware)

// Publisher
router.post('/publisher', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), createPublisher)

router.put('/publisher/:id', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), updatePublisher)
router.delete('/publisher/:id', authMiddleware, requirePagePermission('softwareCategory', 'isDelete'), deletePublisher)

// Software Category
router.post('/softwareCategory', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), createSoftwareCategory)

router.put('/softwareCategory/:id', authMiddleware, requirePagePermission('softwareCategory', 'isEdit'), updateSoftwareCategory)
router.delete('/softwareCategory/:id', authMiddleware, requirePagePermission('softwareCategory', 'isDelete'), deleteSoftwareCategory)

export default router