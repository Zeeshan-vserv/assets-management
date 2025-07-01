import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import { createHolidayCalender, createHolidayList, createPriorityMatrix, createSLA, createSLAMapping, createSLATimeline, deleteHolidayCalender, deleteHolidayList, deletePriorityMatrix, deleteSLA, deleteSLAMapping, deleteSLATimeline, getAllHolidayCalender, getAllHolidayList, getAllPriorityMatrices, getAllSLAMappings, getAllSLAs, getAllSLATimelines, getHolidayCalenderById, getHolidayListById, getPriorityMatrixById, getSLAById, getSLAMappingById, getSLATimelineById, updateHolidayCalender, updateHolidayList, updatePriorityMatrix, updateSLA, updateSLAMapping, updateSLATimeline } from '../controllers/SLAController.js';

const router = express.Router();



// Routes for SLA Mapping
router.post('/slaMapping', authMiddleware, createSLAMapping)
router.get('/slaMapping', authMiddleware, getAllSLAMappings)
router.get('/slaMapping/:id', authMiddleware, getSLAMappingById)
router.put('/slaMapping/:id', authMiddleware, updateSLAMapping)
router.delete('/slaMapping/:id', authMiddleware, deleteSLAMapping)

router.post('/slaTimeline', authMiddleware, createSLATimeline)
router.get('/slaTimeline', authMiddleware, getAllSLATimelines)
router.get('/slaTimeline/:id', authMiddleware, getSLATimelineById)
router.put('/slaTimeline/:id', authMiddleware, updateSLATimeline)
router.delete('/slaTimeline/:id', authMiddleware, deleteSLATimeline)

// Routes for Priority Matrix
router.post('/priorityMatrix', authMiddleware, createPriorityMatrix)
router.get('/priorityMatrix', authMiddleware, getAllPriorityMatrices)
router.get('/priorityMatrix/:id', authMiddleware, getPriorityMatrixById)
router.put('/priorityMatrix/:id', authMiddleware, updatePriorityMatrix)
router.delete('/priorityMatrix/:id', authMiddleware, deletePriorityMatrix)

// Routes for Holiday Calender
router.post('/holidayCalender', authMiddleware, createHolidayCalender)
router.get('/holidayCalender', authMiddleware, getAllHolidayCalender)
router.get('/holidayCalender/:id', authMiddleware, getHolidayCalenderById)
router.put('/holidayCalender/:id', authMiddleware, updateHolidayCalender)
router.delete('/holidayCalender/:id', authMiddleware, deleteHolidayCalender)

// Routes for Holiday List
router.post('/holidayList', authMiddleware, createHolidayList)
router.get('/holidayList', authMiddleware, getAllHolidayList)
router.get('/holidayList/:id', authMiddleware, getHolidayListById)
router.put('/holidayList/:id', authMiddleware, updateHolidayList)
router.delete('/holidayList/:id', authMiddleware, deleteHolidayList)

// Routes for SLA
router.post('/', authMiddleware, createSLA)
router.get('/', authMiddleware, getAllSLAs)
router.get('/:id', authMiddleware, getSLAById)
router.put('/:id', authMiddleware, updateSLA)
router.delete('/:id', authMiddleware, deleteSLA)

export default router;