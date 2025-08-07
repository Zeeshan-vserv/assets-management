import express from "express";
import { exportAssetReport, exportIncidentReport, exportServiceRequestReport, getAssetsByCategory, getAssetsByLocation, getAssetsByStatus, getAssetsBySubLocation, getAssetsBySupportType, getAssetsByWarrantyExpiry, getIncidentOpenClosedByField, getOpenIncidentsBySeverity, getOpenIncidentsByStatus, getResolutionSlaStatus, getResponseSlaStatus, getServiceOpenByField, getServiceRequestStatusSummary, getTechnicianIncidentStatusSummary, getTotalIncidentsByDateRange, getTotalServicesByDateRange } from "../controllers/DashboardController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { requirePagePermission } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.get(
  "/technician-incident-status-summary",
  authMiddleware,
  requirePagePermission('dashboard', 'isView'),
  getTechnicianIncidentStatusSummary
);

//Incident Dashboard Routes
router.get("/total-incidents-bar", authMiddleware, requirePagePermission('dashboard', 'isView'), getTotalIncidentsByDateRange);
router.get("/open-incidents-by-status", authMiddleware, requirePagePermission('dashboard', 'isView'), getOpenIncidentsByStatus);
router.get("/open-incidents-by-severity", authMiddleware, requirePagePermission('dashboard', 'isView'), getOpenIncidentsBySeverity);
router.get("/response-sla-status", authMiddleware, requirePagePermission('dashboard', 'isView'), getResponseSlaStatus);
router.get("/resolution-sla-status", authMiddleware, requirePagePermission('dashboard', 'isView'), getResolutionSlaStatus);
router.get("/incident-open-closed-by-field", authMiddleware, requirePagePermission('dashboard', 'isView'), getIncidentOpenClosedByField);

//Service Dashboard Routes
router.get("/service-request-status-summary", authMiddleware, requirePagePermission('dashboard', 'isView'), getServiceRequestStatusSummary);
router.get("/total-services-bar", authMiddleware, requirePagePermission('dashboard', 'isView'), getTotalServicesByDateRange);
router.get("/service-open-by-field", authMiddleware, requirePagePermission('dashboard', 'isView'), getServiceOpenByField);

// Asset Dashboard Routes
router.get("/assets-by-status", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsByStatus);
router.get("/assets-by-support-type", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsBySupportType);
router.get("/assets-by-warranty-expiry", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsByWarrantyExpiry);
router.get("/assets-by-category", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsByCategory);
router.get("/assets-by-location", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsByLocation);
router.get("/assets-by-sub-location", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsBySubLocation);
// router.get("/assets-by-business-unit", authMiddleware, requirePagePermission('dashboard', 'isView'), getAssetsByBusinessUnit);

router.post("/incidentsReport", exportIncidentReport);
router.post("/service-requests", exportServiceRequestReport);
router.post("/assets", exportAssetReport);

export default router;