import express from 'express'
import { createPublisher, createSoftware, createSoftwareCategory, deletePublisher, deleteSoftware, deleteSoftwareCategory, getAllPublisher, getAllSoftware, getAllSoftwareCategory, getPublisherById, getSoftwareById, getSoftwareCategoryById, updatePublisher, updateSoftware, updateSoftwareCategory } from '../controllers/SoftwareCategoryController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'

const router = express.Router()

//Software
router.post('/',authMiddleware, createSoftware)
router.get('/software',authMiddleware, getAllSoftware)
router.get('/software/:id', authMiddleware, getSoftwareById)
router.put('/software/:id', authMiddleware, updateSoftware)
router.delete('/software/:id', authMiddleware, deleteSoftware)

//Publisher
router.post('/:softwareId/publisher', authMiddleware, createPublisher)
router.get('/publishers',authMiddleware, getAllPublisher)
router.get('/publisher/:id', authMiddleware, getPublisherById)
router.put('/publisher/:id', authMiddleware, updatePublisher)
router.delete('/:softwareId/publisher/:publisherId', deletePublisher)

//Software Category
router.post('/:softwareId/softwareCategory', authMiddleware, createSoftwareCategory)
router.get('/softwareCategory',authMiddleware, getAllSoftwareCategory)
router.get('/softwareCategory/:id', authMiddleware, getSoftwareCategoryById)
router.put('/softwareCategory/:id', authMiddleware, updateSoftwareCategory)
router.delete('/:softwareId/softwareCategory/:softwareCategoryId', deleteSoftwareCategory)
export default router