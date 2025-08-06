import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { requirePagePermission } from "../middleware/roleMiddleware.js";
import { addSubCategory, createIncidentCategory, deleteCategory, deleteSubCategory, getAllCategory, getAllSubCategory, getCategoryById, getSubCategoryById, updateCategory, updateSubCategory } from "../controllers/IncidentCategoryController.js";

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('incidentCategory', 'isEdit'), createIncidentCategory);
router.post('/:categoryId/subCategory', authMiddleware, requirePagePermission('incidentCategory', 'isEdit'), addSubCategory);
router.get('/', authMiddleware, requirePagePermission('incidentCategory', 'isView'), getAllCategory);
router.get('/subCategory', authMiddleware, requirePagePermission('incidentCategory', 'isView'), getAllSubCategory);
router.get('/:id', authMiddleware, requirePagePermission('incidentCategory', 'isView'), getCategoryById);
router.get('/subCategory/:id', authMiddleware, requirePagePermission('incidentCategory', 'isView'), getSubCategoryById);
router.put('/:id', authMiddleware, requirePagePermission('incidentCategory', 'isEdit'), updateCategory);
router.put('/subCategory/:id', authMiddleware, requirePagePermission('incidentCategory', 'isEdit'), updateSubCategory);
router.delete('/:id', authMiddleware, requirePagePermission('incidentCategory', 'isDelete'), deleteCategory);
router.delete('/:categoryId/subCategory/:subCategoryId', authMiddleware, requirePagePermission('incidentCategory', 'isDelete'), deleteSubCategory);

export default router;