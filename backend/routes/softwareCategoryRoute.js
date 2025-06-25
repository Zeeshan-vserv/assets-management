import express from 'express'
import { createPublisher, createSoftware, createSoftwareCategory, deletePublisher, deleteSoftware, deleteSoftwareCategory, getAllPublisher, getAllSoftware, getAllSoftwareCategory, getPublisherById, getSoftwareById, getSoftwareCategoryById, updatePublisher, updateSoftware, updateSoftwareCategory } from '../controllers/SoftwareCategoryController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'

const router = express.Router()

//Software
router.post('/',authMiddleware, createSoftware)
router.get('/',authMiddleware, getAllSoftware)


//Publisher
router.post('/publisher', authMiddleware, createPublisher)
router.get('/publisher',authMiddleware, getAllPublisher)
router.get('/publisher/:id', authMiddleware, getPublisherById)
router.put('/publisher/:id', authMiddleware, updatePublisher)
router.delete('/publisher/:id', deletePublisher)

//Software Category
router.post('/softwareCategory', authMiddleware, createSoftwareCategory)
router.get('/softwareCategory',authMiddleware, getAllSoftwareCategory)
router.get('/softwareCategory/:id', authMiddleware, getSoftwareCategoryById)
router.put('/softwareCategory/:id', authMiddleware, updateSoftwareCategory)
router.delete('/softwareCategory/:id', deleteSoftwareCategory)

router.get('/:id', authMiddleware, getSoftwareById)
router.put('/:id', authMiddleware, updateSoftware)
router.delete('/:id', authMiddleware, deleteSoftware)

export default router