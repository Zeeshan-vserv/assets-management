import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { createGatePass, deleteGatePass, getAllGatePass, getGatePassById, updateGatePass } from '../controllers/GatePassController.js'
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/gatepass/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const router =  express.Router()

router.post('/', authMiddleware, upload.single('attachment'), createGatePass)
router.get('/', authMiddleware, getAllGatePass)
router.get('/:id', authMiddleware, getGatePassById)
router.put('/:id', authMiddleware, upload.single('attachment'), updateGatePass)
router.delete('/:id', authMiddleware, deleteGatePass)

export default router