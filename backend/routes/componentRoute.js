import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { requirePagePermission } from "../middleware/roleMiddleware.js";
import { createComponent, deleteComponent, getAllComponent, getComponentById, updateComponent } from "../controllers/ComponentController.js";

const router = express.Router();

router.post('/', authMiddleware, requirePagePermission('component', 'isEdit'), createComponent);
router.get('/', authMiddleware, requirePagePermission('component', 'isView'), getAllComponent);
router.get('/:id', authMiddleware, requirePagePermission('component', 'isView'), getComponentById);
router.put('/:id', authMiddleware, requirePagePermission('component', 'isEdit'), updateComponent);
router.delete('/:id', authMiddleware, requirePagePermission('component', 'isDelete'), deleteComponent);

export default router;