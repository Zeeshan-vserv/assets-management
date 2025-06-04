import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { createComponent, getAllComponent } from "../controllers/ComponentController.js";

const router = express.Router()

router.post('/', authMiddleware, createComponent)
router.get('/', getAllComponent)

export default router