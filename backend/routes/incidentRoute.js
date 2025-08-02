import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import {
  createIncident,
  deleteIncident,
  getAllIncident,
  getIncidentById,
  getIncidentByUserId,
  getIncidentStatusCounts,
  updateIncident
} from '../controllers/IncidentController.js'

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

router.post('/', authMiddleware, upload.single('attachment'), createIncident);
router.get('/status-counts', authMiddleware, getIncidentStatusCounts);
router.get('/', authMiddleware, getAllIncident);
router.get('/:id', authMiddleware, getIncidentById);
router.get('/user/:userId', getIncidentByUserId);
router.put('/:id', authMiddleware, updateIncident);
router.delete('/:id', authMiddleware, deleteIncident);


export default router;