import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { addSupportGroup, createSupportDepartment, deleteSupportDepartment, deleteSupportGroup, getAllSupportDepartment, getAllSupportGroup, getSupportDepartmentById, getSupportGroupById, updateSupportDepartment, updateSupportGroup } from '../controllers/SupportDepartmentController.js'

const router = express.Router()

router.post('/', authMiddleware, createSupportDepartment)
router.post('/:supportDepartmentId/supportGroup', addSupportGroup)
router.get('/', getAllSupportDepartment)
router.get('/supportGroup', getAllSupportGroup)
router.get('/:id', getSupportDepartmentById)
router.get('/supportGroup/:id', getSupportGroupById)
router.put('/:id', updateSupportDepartment)
router.put('/supportGroup/:id', updateSupportGroup)
router.delete('/:id', deleteSupportDepartment)
router.delete('/:supportDepartmentId/supportGroup/:supportGroupId', deleteSupportGroup)

export default router