import express from 'express';
import { getPermissions } from '../controllers/AccessController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/permissions', authMiddleware, getPermissions);

export default router;