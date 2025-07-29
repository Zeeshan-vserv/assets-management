import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { requireRole, requirePagePermission } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/admin-data", authMiddleware, requireRole(["Admin", "Super Admin"]), (req, res) => {
  // Only Admin/Super Admin can access
  res.json({ message: "Admin data" });
});

router.get("/assets", authMiddleware, requirePagePermission("assets", "isView"), (req, res) => {
  // Only users with assets.isView permission can access
  res.json({ message: "Assets data" });
});

router.get("/tickets", authMiddleware, requirePagePermission("tickets", "isView"), (req, res) => {
  // Only users with tickets.isView permission can access
  res.json({ message: "Tickets data" });
});

export default router;