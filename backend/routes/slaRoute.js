import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';
import { createHolidayCalender, createHolidayList, createPriorityMatrix, createSLA, createSLAMapping, createSLATimeline, deleteHolidayCalender, deleteHolidayList, deletePriorityMatrix, deleteSLA, deleteSLAMapping, deleteSLATimeline, getAllHolidayCalender, getAllHolidayList, getAllPriorityMatrices, getAllSLAMappings, getAllSLAs, getAllSLATimelines, getHolidayCalenderById, getHolidayListById, getPriorityMatrixById, getSLAById, getSLAMappingById, getSLATimelineById, updateHolidayCalender, updateHolidayList, updatePriorityMatrix, updateSLA, updateSLAMapping, updateSLATimeline } from '../controllers/SLAController.js';

const router = express.Router();

// Routes for SLA Mapping
router.post('/slaMapping', authMiddleware, requirePagePermission('sla', 'isEdit'), createSLAMapping)
router.get('/slaMapping', authMiddleware, requirePagePermission('sla', 'isView'), getAllSLAMappings)
router.get('/slaMapping/:id', authMiddleware, requirePagePermission('sla', 'isView'), getSLAMappingById)
router.put('/slaMapping/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updateSLAMapping)
router.delete('/slaMapping/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deleteSLAMapping)

router.post('/slaTimeline', authMiddleware, requirePagePermission('sla', 'isEdit'), createSLATimeline)
router.get('/slaTimeline', authMiddleware, requirePagePermission('sla', 'isView'), getAllSLATimelines)
router.get('/slaTimeline/:id', authMiddleware, requirePagePermission('sla', 'isView'), getSLATimelineById)
router.put('/slaTimeline/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updateSLATimeline)
router.delete('/slaTimeline/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deleteSLATimeline)

// Routes for Priority Matrix
router.post('/priorityMatrix', authMiddleware, requirePagePermission('sla', 'isEdit'), createPriorityMatrix)
router.get('/priorityMatrix', authMiddleware, requirePagePermission('sla', 'isView'), getAllPriorityMatrices)
router.get('/priorityMatrix/:id', authMiddleware, requirePagePermission('sla', 'isView'), getPriorityMatrixById)
router.put('/priorityMatrix/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updatePriorityMatrix)
router.delete('/priorityMatrix/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deletePriorityMatrix)

// Routes for Holiday Calender
router.post('/holidayCalender', authMiddleware, requirePagePermission('sla', 'isEdit'), createHolidayCalender)
router.get('/holidayCalender', authMiddleware, requirePagePermission('sla', 'isView'), getAllHolidayCalender)
router.get('/holidayCalender/:id', authMiddleware, requirePagePermission('sla', 'isView'), getHolidayCalenderById)
router.put('/holidayCalender/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updateHolidayCalender)
router.delete('/holidayCalender/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deleteHolidayCalender)

// Routes for Holiday List
router.post('/holidayList', authMiddleware, requirePagePermission('sla', 'isEdit'), createHolidayList)
router.get('/holidayList', authMiddleware, requirePagePermission('sla', 'isView'), getAllHolidayList)
router.get('/holidayList/:id', authMiddleware, requirePagePermission('sla', 'isView'), getHolidayListById)
router.put('/holidayList/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updateHolidayList)
router.delete('/holidayList/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deleteHolidayList)

// Routes for SLA
router.post('/', authMiddleware, requirePagePermission('sla', 'isEdit'), createSLA)
router.get('/', authMiddleware, requirePagePermission('sla', 'isView'), getAllSLAs)
router.get('/:id', authMiddleware, requirePagePermission('sla', 'isView'), getSLAById)
router.put('/:id', authMiddleware, requirePagePermission('sla', 'isEdit'), updateSLA)
router.delete('/:id', authMiddleware, requirePagePermission('sla', 'isDelete'), deleteSLA)

export default router;