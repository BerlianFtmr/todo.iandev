import express from 'express';
import CommitLogController from '../controllers/commitLogController.js';

const router = express.Router();

// Endpoint untuk mengambil riwayat log aktivitas
router.get('/', CommitLogController.getLogs);

// Endpoint untuk mencatat log aktivitas
router.post('/', CommitLogController.createLog);

// Endpoint untuk menghapus log aktivitas
router.delete('/:id', CommitLogController.deleteLog);

export default router;
