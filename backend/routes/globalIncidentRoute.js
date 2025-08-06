import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js'
import { createAutoCloseTime, createClosureCode, createPendingReason, createPredefinedResponse, createRule, deleteAutoCloseTime, deleteClosureCode, deletePendingReason, deletePredefinedResponse, deleteRule, getAllAutoCloseTimes, getAllClosureCodes, getAllPendingReasons, getAllPredefinedResponses, getAllRules, getAutoCloseTimeById, getClosureCodeById, getPendingReasonById, getPredefinedResponseById, getRuleById, updateAutoCloseTime, updateClosureCode, updatePendingReason, updatePredefinedResponse, updateRule } from '../controllers/GlobalIncidentController.js';

const router = express.Router();

// Auto Close Time
router.post('/autoCloseTime', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), createAutoCloseTime)
router.get('/autoCloseTime', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAllAutoCloseTimes)
router.get('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAutoCloseTimeById)
router.put('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), updateAutoCloseTime)
router.delete('/autoCloseTime/:id', authMiddleware, requirePagePermission('globalIncident', 'isDelete'), deleteAutoCloseTime)

// Closure Code
router.post('/closureCode', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), createClosureCode)
router.get('/closureCode', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAllClosureCodes)
router.get('/closureCode/:id', authMiddleware, requirePagePermission('globalIncident', 'isView'), getClosureCodeById)
router.put('/closureCode/:id', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), updateClosureCode)
router.delete('/closureCode/:id', authMiddleware, requirePagePermission('globalIncident', 'isDelete'), deleteClosureCode)

// Predefined Response
router.post('/predefinedResponse', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), createPredefinedResponse)
router.get('/predefinedResponse', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAllPredefinedResponses)
router.get('/predefinedResponse/:id', authMiddleware, requirePagePermission('globalIncident', 'isView'), getPredefinedResponseById)
router.put('/predefinedResponse/:id', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), updatePredefinedResponse)
router.delete('/predefinedResponse/:id', authMiddleware, requirePagePermission('globalIncident', 'isDelete'), deletePredefinedResponse)

// Pending Reasons
router.post('/pendingReason', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), createPendingReason)
router.get('/pendingReason', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAllPendingReasons)
router.get('/pendingReason/:id', authMiddleware, requirePagePermission('globalIncident', 'isView'), getPendingReasonById)
router.put('/pendingReason/:id', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), updatePendingReason)
router.delete('/pendingReason/:id', authMiddleware, requirePagePermission('globalIncident', 'isDelete'), deletePendingReason)

// Rules 
router.post('/rule', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), createRule)
router.get('/rule', authMiddleware, requirePagePermission('globalIncident', 'isView'), getAllRules)
router.get('/rule/:id', authMiddleware, requirePagePermission('globalIncident', 'isView'), getRuleById)
router.put('/rule/:id', authMiddleware, requirePagePermission('globalIncident', 'isEdit'), updateRule)
router.delete('/rule/:id', authMiddleware, requirePagePermission('globalIncident', 'isDelete'), deleteRule)

export default router;