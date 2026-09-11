import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Endpoint Registrasi
router.post('/register', UserController.register);

// Endpoint Login
router.post('/login', UserController.login);

export default router;