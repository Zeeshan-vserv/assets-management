import express from 'express'
import authMiddleware from '../middleware/AuthMiddleware.js'
import { approveGatePass, createGatePass, deleteGatePass, getAllGatePass, getGatePassById, updateGatePass } from '../controllers/GatePassController.js'
import multer from 'multer';
import { requirePagePermission } from '../middleware/roleMiddleware.js';

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

router.post('/', authMiddleware, requirePagePermission('gatePass', 'isEdit'), upload.single('attachment'), createGatePass)
router.get('/', authMiddleware, requirePagePermission('gatePass', 'isView'), getAllGatePass)
router.get('/:id', authMiddleware, requirePagePermission('gatePass', 'isView'), getGatePassById)
router.put('/:id', authMiddleware, requirePagePermission('gatePass', 'isEdit'), upload.single('attachment'), updateGatePass)
router.delete('/:id', authMiddleware, requirePagePermission('gatePass', 'isDelete'), deleteGatePass)
router.post('/:id/approve', authMiddleware, requirePagePermission('serviceRequest', 'isEdit'), approveGatePass);

export default router