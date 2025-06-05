import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { createComponent, deleteComponent, getAllComponent, getComponentById, updateComponent } from "../controllers/ComponentController.js";

const router = express.Router()

router.post('/', authMiddleware, createComponent)
router.get('/', getAllComponent)
router.get('/:id', getComponentById)
router.put('/:id', updateComponent)
router.delete('/:id', deleteComponent)

export default router