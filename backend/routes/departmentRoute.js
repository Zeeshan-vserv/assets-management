import express from 'express'
import { createDepartment, deleteDepartment, deleteSubDepartment, getAllDepartment, getAllSubDepartment, getDepartmentById, getSubDepartmentById, updateDepartment, updateSubDepartment } from '../controllers/DepartmentController.js'
import authMiddleware from '../middleware/AuthMiddleware.js'

const router = express.Router()

router.post('/', authMiddleware, createDepartment)
router.get('/department', getAllDepartment)
router.get('/subdepartment', getAllSubDepartment)
router.get('/department/:id', getDepartmentById)
router.get('/subdepartment/:id', getSubDepartmentById)
router.put('/department/:id', updateDepartment)
router.put('/subdepartment/:id', updateSubDepartment)
router.delete('/department/:id', deleteDepartment)
router.delete('/department/:departmentId/subdepartment/:subdepartmentId', deleteSubDepartment)

export default router