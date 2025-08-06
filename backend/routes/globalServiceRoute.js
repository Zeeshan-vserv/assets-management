import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { addServiceSubCategory, createAutoCloseTime, createServiceCategory, deleteAutoCloseTime, deleteServiceCategory, deleteServiceSubCategory, getAllAutoCloseTimes, getAllServiceCategory, getAllServiceSubCategory, getAutoCloseTimeById, getServiceCategoryById, getServiceSubCategoryById, updateAutoCloseTime, updateServiceCategory, updateServiceSubCategory } from '../controllers/globalServiceController.js';

const router = express.Router();

// Auto Close Time
router.post('/autoCloseTime', authMiddleware, requirePagePermission('globalService', 'isEdit'), createAutoCloseTime)
router.get('/autoCloseTime', authMiddleware, requirePagePermission('globalService', 'isView'), getAllAutoCloseTimes)
router.get('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalService', 'isView'), getAutoCloseTimeById)
router.put('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalService', 'isEdit'), updateAutoCloseTime)
router.delete('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalService', 'isDelete'), deleteAutoCloseTime)

// Service Category Route
router.post('/', authMiddleware, requirePagePermission('globalService', 'isEdit'), createServiceCategory)
router.post('/:categoryId/subCategory', authMiddleware, requirePagePermission('globalService', 'isEdit'), addServiceSubCategory)
router.get('/', authMiddleware, requirePagePermission('globalService', 'isView'), getAllServiceCategory)
router.get('/subCategory', authMiddleware, requirePagePermission('globalService', 'isView'), getAllServiceSubCategory)
router.get('/:id', authMiddleware, requirePagePermission('globalService', 'isView'), getServiceCategoryById)
router.get('/subCategory/:id', authMiddleware, requirePagePermission('globalService', 'isView'), getServiceSubCategoryById)
router.put('/:id', authMiddleware, requirePagePermission('globalService', 'isEdit'), updateServiceCategory)
router.put('/subCategory/:id', authMiddleware, requirePagePermission('globalService', 'isEdit'), updateServiceSubCategory)
router.delete('/:id', authMiddleware, requirePagePermission('globalService', 'isDelete'), deleteServiceCategory)
router.delete('/:categoryId/subCategory/:subCategoryId', authMiddleware, requirePagePermission('globalService', 'isDelete'), deleteServiceSubCategory)

export default router;