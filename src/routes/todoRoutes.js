import express from 'express';
import TodoController from '../controllers/todoController.js';

const router = express.Router();

// Endpoint untuk mengambil daftar task milik user
router.get('/', TodoController.getTodos);

// Endpoint untuk membuat task baru
router.post('/', TodoController.createTodo);

// Endpoint untuk mengubah status task (selesai/belum)
router.patch('/:id', TodoController.toggleTodo);

// Endpoint untuk menghapus task
router.delete('/:id', TodoController.deleteTodo);

export default router;