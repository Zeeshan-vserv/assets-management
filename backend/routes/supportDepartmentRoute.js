import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'
import { addSupportGroup, createSupportDepartment, deleteSupportDepartment, deleteSupportGroup, getAllSupportDepartment, getAllSupportGroup, getSupportDepartmentById, getSupportGroupById, updateSupportDepartment, updateSupportGroup } from '../controllers/SupportDepartmentController.js'

const router = express.Router()

router.post('/', authMiddleware, requirePagePermission('supportDepartment', 'isEdit'), createSupportDepartment)
router.post('/:supportDepartmentId/supportGroup', authMiddleware, requirePagePermission('supportDepartment', 'isEdit'), addSupportGroup)
router.get('/', authMiddleware, requirePagePermission('supportDepartment', 'isView'), getAllSupportDepartment)
router.get('/supportGroup', authMiddleware, requirePagePermission('supportDepartment', 'isView'), getAllSupportGroup)
router.get('/:id', authMiddleware, requirePagePermission('supportDepartment', 'isView'), getSupportDepartmentById)
router.get('/supportGroup/:id', authMiddleware, requirePagePermission('supportDepartment', 'isView'), getSupportGroupById)
router.put('/:id', authMiddleware, requirePagePermission('supportDepartment', 'isEdit'), updateSupportDepartment)
router.put('/supportGroup/:id', authMiddleware, requirePagePermission('supportDepartment', 'isEdit'), updateSupportGroup)
router.delete('/:id', authMiddleware, requirePagePermission('supportDepartment', 'isDelete'), deleteSupportDepartment)
router.delete('/:supportDepartmentId/supportGroup/:supportGroupId', authMiddleware, requirePagePermission('supportDepartment', 'isDelete'), deleteSupportGroup)

export default router