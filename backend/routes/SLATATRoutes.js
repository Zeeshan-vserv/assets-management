import express from "express";
import { getAllIncidentsSla, getAllIncidentsTat } from "../controllers/SLATATLController.js";

const router = express.Router();

router.get("/sla", getAllIncidentsSla);

router.get("/tat", getAllIncidentsTat);

export default router;