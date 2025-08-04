import express from 'express'
import { addSubDepartment, createDepartment, deleteDepartment, deleteSubDepartment, getAllDepartment, getAllSubDepartment, getDepartmentById, getSubDepartmentById, updateDepartment, updateSubDepartment } from '../controllers/DepartmentController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, requirePagePermission('department', 'isEdit'), createDepartment)
router.post('/:departmentId/subdepartment', authMiddleware, requirePagePermission('department', 'isEdit'), addSubDepartment)
router.get('/', authMiddleware, requirePagePermission('department', 'isView'), getAllDepartment)
router.get('/subdepartment', authMiddleware, requirePagePermission('department', 'isView'), getAllSubDepartment)
router.get('/:id', authMiddleware, requirePagePermission('department', 'isView'), getDepartmentById)
router.get('/subdepartment/:id', authMiddleware, requirePagePermission('department', 'isView'), getSubDepartmentById)
router.put('/:id', authMiddleware, requirePagePermission('department', 'isEdit'), updateDepartment)
router.put('/subdepartment/:id', authMiddleware, requirePagePermission('department', 'isEdit'), updateSubDepartment)
router.delete('/:id', authMiddleware, requirePagePermission('department', 'isDelete'), deleteDepartment)
router.delete('/:departmentId/subdepartment/:subdepartmentId', authMiddleware, requirePagePermission('department', 'isDelete'), deleteSubDepartment)

export default router