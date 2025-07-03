import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createIncident, deleteIncident, getAllIncident, getIncidentById, updateIncident } from '../controllers/IncidentController.js'

const router = express.Router()

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/incidents"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('attachment'), createIncident);
router.get('/', authMiddleware, getAllIncident)
router.get('/:id', authMiddleware, getIncidentById)
router.put('/:id', authMiddleware, updateIncident)
router.delete('/:id', authMiddleware, deleteIncident)

export default router