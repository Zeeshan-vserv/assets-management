import express from 'express';
import { signup, login, getUsers, updateUser, deleteUser } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/:id", getUsers)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;


