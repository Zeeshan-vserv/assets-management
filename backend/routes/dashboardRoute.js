import express from "express";
import { getOpenIncidentsBySeverity, getOpenIncidentsByStatus, getResolutionSlaStatus, getResponseSlaStatus, getTechnicianIncidentStatusSummary, getTotalIncidentsByDateRange } from "../controllers/DashboardController.js";
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

export default router;