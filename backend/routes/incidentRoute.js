import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import {
  createIncident,
  deleteIncident,
  getAllIncident,
  getAllIncidentsSla,
  getAllIncidentsTat,
  getIncidentById,
  getIncidentByUserId,
  getIncidentSla,
  getIncidentStatusCounts,
  getIncidentTat,
  updateIncident
} from '../controllers/IncidentController.js'
import { requirePagePermission } from '../middleware/roleMiddleware.js';

const router = express.Router()

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/incidents/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', authMiddleware, requirePagePermission('incident', 'isEdit'), upload.single('attachment'), createIncident);
router.get('/sla', authMiddleware, requirePagePermission('incident', 'isView'), getAllIncidentsSla);
router.get('/tat', authMiddleware, requirePagePermission('incident', 'isView'), getAllIncidentsTat);
router.get('/sla/:id', authMiddleware, requirePagePermission('incident', 'isView'), getIncidentSla);
router.get('/tat/:id', authMiddleware, requirePagePermission('incident', 'isView'), getIncidentTat);
router.get('/status-counts', authMiddleware, requirePagePermission('incident', 'isView'), getIncidentStatusCounts);
router.get('/', authMiddleware, requirePagePermission('incident', 'isView'), getAllIncident);
router.get('/user/:userId', authMiddleware, requirePagePermission('incident', 'isView'), getIncidentByUserId);
router.get('/:id', authMiddleware, requirePagePermission('incident', 'isView'), getIncidentById);
router.put('/:id', authMiddleware, requirePagePermission('incident', 'isEdit'), updateIncident);
router.delete('/:id', authMiddleware, requirePagePermission('incident', 'isDelete'), deleteIncident);
router.post('/autoclose', authMiddleware, requirePagePermission('incident', 'isEdit'), async (req, res) => {
  const result = await autoCloseResolvedIncidents();
  res.json(result);
});

export default router;