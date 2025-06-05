import express from 'express';
import { signup, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/AuthController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/:id", authMiddleware, getUser)
router.get("/", getAllUsers)
router.put('/:id', authMiddleware , updateUser)
router.delete('/:id', authMiddleware, deleteUser)

export default router;


