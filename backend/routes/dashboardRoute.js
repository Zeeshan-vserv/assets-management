import express from "express";
import { getIncidentOpenClosedByField, getOpenIncidentsBySeverity, getOpenIncidentsByStatus, getResolutionSlaStatus, getResponseSlaStatus, getServiceRequestStatusSummary, getTechnicianIncidentStatusSummary, getTotalIncidentsByDateRange, getTotalServicesByDateRange } from "../controllers/DashboardController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";
const router = express.Router();

router.get(
  "/technician-incident-status-summary",
  
  getTechnicianIncidentStatusSummary
);
router.get("/total-incidents-bar", getTotalIncidentsByDateRange);
router.get("/open-incidents-by-status", getOpenIncidentsByStatus);
router.get("/open-incidents-by-severity", getOpenIncidentsBySeverity);
router.get("/response-sla-status", getResponseSlaStatus);
router.get("/resolution-sla-status", getResolutionSlaStatus);
router.get("/incident-open-closed-by-field", getIncidentOpenClosedByField);
router.get("/service-request-status-summary", getServiceRequestStatusSummary);
router.get("/total-services-bar", getTotalServicesByDateRange);

export default router;