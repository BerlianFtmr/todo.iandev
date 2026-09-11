import express from 'express';
import TodoController from '../controllers/todoController.js';
import CommitLogController from '../controllers/commitLogController.js';

const router = express.Router();

// Endpoint untuk mengambil daftar task milik user
router.get('/', TodoController.getTodos);

// Endpoint untuk membuat task baru
router.post('/', TodoController.createTodo);

// Endpoint nested untuk riwayat log per task
router.get('/:id/logs', CommitLogController.getLogs);
router.post('/:id/logs', CommitLogController.createLog);

// Endpoint untuk mengubah status task (selesai/belum)
router.patch('/:id/status', TodoController.toggleTodo);
router.patch('/:id', TodoController.toggleTodo);

// Endpoint untuk mengubah detail task
router.put('/:id', TodoController.updateTodo);

// Endpoint untuk menghapus task
router.delete('/:id', TodoController.deleteTodo);

export default router;
