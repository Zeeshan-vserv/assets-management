import express from "express";
import { getAllByTechnician } from "../controllers/reportController.js";

const router = express.Router();

router.get("/by-technician/:technicianId", getAllByTechnician);

export default router;