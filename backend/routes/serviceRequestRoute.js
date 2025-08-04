import express from 'express'
import multer from "multer";
import path from "path";
import authMiddleware from '../middleware/AuthMiddleware.js'
import { approveServiceRequest, createServiceRequest, deleteServiceRequest, getAllServiceRequests, getAllServiceSla, getAllServicesTat, getMyPendingApprovals, getServiceRequestById, getServiceRequestByUserId, getServiceRequestStatusCounts, updateServiceRequest } from '../controllers/serviceRequestController.js';
import { requirePagePermission } from '../middleware/roleMiddleware.js';

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

router.post('/', authMiddleware, requirePagePermission('serviceRequest', 'isEdit'), upload.single('attachment'), createServiceRequest);
router.get("/sla-all", authMiddleware, requirePagePermission('serviceRequest', 'isView'), getAllServiceSla);
router.get("/tat-all", authMiddleware, requirePagePermission('serviceRequest', 'isView'), getAllServicesTat);
router.get('/status-counts', authMiddleware, requirePagePermission('serviceRequest', 'isView'), getServiceRequestStatusCounts);
router.get('/my-approvals', authMiddleware, requirePagePermission('serviceRequest', 'isView'), getMyPendingApprovals);
router.get('/', authMiddleware, requirePagePermission('serviceRequest', 'isView'), getAllServiceRequests);
router.get('/user/:userId', authMiddleware, requirePagePermission('serviceRequest', 'isView'), getServiceRequestByUserId);
router.get('/:id', authMiddleware, requirePagePermission('serviceRequest', 'isView'), getServiceRequestById);
router.put('/:id', authMiddleware, requirePagePermission('serviceRequest', 'isEdit'), updateServiceRequest);
router.delete('/:id', authMiddleware, requirePagePermission('serviceRequest', 'isDelete'), deleteServiceRequest);
router.post('/:id/approve', authMiddleware, requirePagePermission('serviceRequest', 'isEdit'), approveServiceRequest);

export default router