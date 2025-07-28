import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import { approveServiceRequest, createServiceRequest, deleteServiceRequest, getAllServiceRequests, getAllServiceSla, getAllServicesTat, getMyPendingApprovals, getServiceRequestById, getServiceRequestStatusCounts, updateServiceRequest } from '../controllers/serviceRequestController.js';

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
router.get('/status-counts', authMiddleware, getServiceRequestStatusCounts);
router.get('/my-approvals', authMiddleware, getMyPendingApprovals);
router.get('/', authMiddleware, getAllServiceRequests)
router.get('/:id', authMiddleware, getServiceRequestById)
router.put('/:id', authMiddleware, updateServiceRequest)
router.delete('/:id', authMiddleware, deleteServiceRequest)
router.post('/:id/approve', authMiddleware, approveServiceRequest)


export default router