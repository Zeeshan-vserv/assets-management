import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createServiceRequest, deleteServiceRequest, getAllServiceRequests, getAllServiceSla, getAllServicesTat, getServiceRequestById, updateServiceRequest } from '../controllers/serviceRequestController.js';

const router = express.Router()

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/serviceRequests/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('attachment'), createServiceRequest);
router.get("/sla-all", getAllServiceSla);
router.get("/tat-all", getAllServicesTat);
router.get('/', authMiddleware, getAllServiceRequests)
router.get('/:id', authMiddleware, getServiceRequestById)
router.put('/:id', authMiddleware, updateServiceRequest)
router.delete('/:id', authMiddleware, deleteServiceRequest)


export default router