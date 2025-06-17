import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { addSubCategory, createIncidentCategory, deleteCategory, deleteSubCategory, getAllCategory, getAllSubCategory, getCategoryById, getSubCategoryById, updateCategory, updateSubCategory } from "../controllers/IncidentCategoryController.js";

const router = express.Router()

router.post('/', authMiddleware, createIncidentCategory)
router.post('/:categoryId/subCategory', addSubCategory)
router.get('/', getAllCategory)
router.get('/subCategory', getAllSubCategory)
router.get('/:id', getCategoryById)
router.get('/subCategory/:id', getSubCategoryById)
router.put('/:id', updateCategory)
router.put('/subCategory/:id', updateSubCategory)
router.delete('/:id', deleteCategory)
router.delete('/:categoryId/subCategory/:subCategoryId', deleteSubCategory)

export default router