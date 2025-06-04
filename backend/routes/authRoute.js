import express from 'express';
import { signup, login, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/:id", getUser)
router.get("/", getAllUsers)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;


