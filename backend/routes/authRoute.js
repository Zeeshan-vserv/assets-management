import express from 'express';
import multer from 'multer'
import { signup, login, getUser, updateUser, deleteUser, getAllUsers, uploadUsersFromExcel } from '../controllers/AuthController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const upload = multer({ dest: 'uploads/' })

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/:id", authMiddleware, getUser)
router.get("/", getAllUsers)
router.put('/:id', authMiddleware , updateUser)
router.delete('/:id', authMiddleware, deleteUser)
router.post('/upload-excel', upload.single('file'), uploadUsersFromExcel)

export default router;


