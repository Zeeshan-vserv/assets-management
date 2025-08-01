import express from "express";
import { getAssetsByCategory, getAssetsByLocation, getAssetsByStatus, getAssetsBySubLocation, getAssetsBySupportType, getAssetsByWarrantyExpiry, getIncidentOpenClosedByField, getOpenIncidentsBySeverity, getOpenIncidentsByStatus, getResolutionSlaStatus, getResponseSlaStatus, getServiceOpenByField, getServiceRequestStatusSummary, getTechnicianIncidentStatusSummary, getTotalIncidentsByDateRange, getTotalServicesByDateRange } from "../controllers/DashboardController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.get(
  "/technician-incident-status-summary",
  
  getTechnicianIncidentStatusSummary
);

//Incident Dashboard Routes
router.get("/total-incidents-bar", getTotalIncidentsByDateRange);
router.get("/open-incidents-by-status", getOpenIncidentsByStatus);
router.get("/open-incidents-by-severity", getOpenIncidentsBySeverity);
router.get("/response-sla-status", getResponseSlaStatus);
router.get("/resolution-sla-status", getResolutionSlaStatus);
router.get("/incident-open-closed-by-field", getIncidentOpenClosedByField);

//Service Dashboard Routes
router.get("/service-request-status-summary", getServiceRequestStatusSummary);
router.get("/total-services-bar", getTotalServicesByDateRange);
router.get("/service-open-by-field", getServiceOpenByField);

// Asset Dashboard Routes
router.get("/assets-by-status", getAssetsByStatus);
router.get("/assets-by-support-type", getAssetsBySupportType);
router.get("/assets-by-warranty-expiry", getAssetsByWarrantyExpiry);
router.get("/assets-by-category", getAssetsByCategory);
router.get("/assets-by-location", getAssetsByLocation);
router.get("/assets-by-sub-location", getAssetsBySubLocation);
// router.get("/assets-by-business-unit", getAssetsByBusinessUnit);

export default router;