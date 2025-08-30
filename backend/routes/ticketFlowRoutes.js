import express from "express";
import { saveFlow, getFlow } from "../controllers/ticketFlowController.js";

const router = express.Router();

// Save a new flow
router.post("/save", saveFlow);

// Get a flow by name
router.get("/:name", getFlow);

export default router;