import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createAutoCloseTime, createClosureCode, createPendingReason, createPredefinedResponse, createRule, deleteAutoCloseTime, deleteClosureCode, deletePendingReason, deletePredefinedResponse, deleteRule, getAllAutoCloseTimes, getAllClosureCodes, getAllPendingReasons, getAllPredefinedResponses, getAllRules, getAutoCloseTimeById, getClosureCodeById, getPendingReasonById, getPredefinedResponseById, getRuleById, updateAutoCloseTime, updateClosureCode, updatePendingReason, updatePredefinedResponse, updateRule } from '../controllers/GlobalIncidentController.js';

const router = express.Router();

// Auto Close Time
router.post('/autoCloseTime', authMiddleware, createAutoCloseTime)
router.get('/autoCloseTime', authMiddleware, getAllAutoCloseTimes)
router.get('/autoCloseTime/:id', authMiddleware, getAutoCloseTimeById)
router.put('/autoCloseTime/:id', authMiddleware, updateAutoCloseTime)
router.delete('/autoCloseTime/:id', authMiddleware, deleteAutoCloseTime)

// Closure Code
router.post('/closureCode', authMiddleware, createClosureCode)
router.get('/closureCode', authMiddleware, getAllClosureCodes)
router.get('/closureCode/:id', authMiddleware, getClosureCodeById)
router.put('/closureCode/:id', authMiddleware, updateClosureCode)
router.delete('/closureCode/:id', authMiddleware, deleteClosureCode)

// Predefined Response
router.post('/predefinedResponse', authMiddleware, createPredefinedResponse)
router.get('/predefinedResponse', authMiddleware, getAllPredefinedResponses)
router.get('/predefinedResponse/:id', authMiddleware, getPredefinedResponseById)
router.put('/predefinedResponse/:id', authMiddleware, updatePredefinedResponse)
router.delete('/predefinedResponse/:id', authMiddleware, deletePredefinedResponse)

// Pending Reasons
router.post('/pendingReason', authMiddleware, createPendingReason)
router.get('/pendingReason', authMiddleware, getAllPendingReasons)
router.get('/pendingReason/:id', authMiddleware, getPendingReasonById)
router.put('/pendingReason/:id', authMiddleware, updatePendingReason)
router.delete('/pendingReason/:id', authMiddleware, deletePendingReason)

// Rules 
router.post('/rule', authMiddleware, createRule)
router.get('/rule', authMiddleware, getAllRules)
router.get('/rule/:id', authMiddleware, getRuleById)
router.put('/rule/:id', authMiddleware, updateRule)
router.delete('/rule/:id', authMiddleware, deleteRule)

export default router;