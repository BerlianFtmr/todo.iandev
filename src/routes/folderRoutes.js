import express from 'express';
import FolderController from '../controllers/folderController.js';

const router = express.Router();

// Endpoint untuk mengambil daftar folder milik user
router.get('/', FolderController.getFolders);

// Endpoint untuk membuat folder baru
router.post('/', FolderController.createFolder);

// Endpoint untuk menghapus folder berdasarkan ID
router.delete('/:id', FolderController.deleteFolder);

export default router;