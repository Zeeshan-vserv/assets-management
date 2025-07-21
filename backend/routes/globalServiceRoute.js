import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { addServiceSubCategory, createAutoCloseTime, createServiceCategory, deleteAutoCloseTime, deleteServiceCategory, deleteServiceSubCategory, getAllAutoCloseTimes, getAllServiceCategory, getAllServiceSubCategory, getAutoCloseTimeById, getServiceCategoryById, getServiceSubCategoryById, updateAutoCloseTime, updateServiceCategory, updateServiceSubCategory } from '../controllers/globalServiceController.js';

const router = express.Router();

// Auto Close Time
router.post('/autoCloseTime', authMiddleware, createAutoCloseTime)
router.get('/autoCloseTime', authMiddleware, getAllAutoCloseTimes)
router.get('/autoCloseTime/:id', authMiddleware, getAutoCloseTimeById)
router.put('/autoCloseTime/:id', authMiddleware, updateAutoCloseTime)
router.delete('/autoCloseTime/:id', authMiddleware, deleteAutoCloseTime)

//Sservice Category Route
router.post('/', authMiddleware, createServiceCategory)
router.post('/:categoryId/subCategory', addServiceSubCategory)
router.get('/', getAllServiceCategory)
router.get('/subCategory', getAllServiceSubCategory)
router.get('/:id', getServiceCategoryById)
router.get('/subCategory/:id', getServiceSubCategoryById)
router.put('/:id', updateServiceCategory)
router.put('/subCategory/:id', updateServiceSubCategory)
router.delete('/:id', deleteServiceCategory)
router.delete('/:categoryId/subCategory/:subCategoryId', deleteServiceSubCategory)

export default router;
