import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import commitLogRoutes from './routes/commitLogRoutes.js';
import pool from '../src/config/db.js';

const app = express();

// Menentukan __dirname untuk ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Setup EJS Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/api/auth', userRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/commit-logs', commitLogRoutes);

// Test Route Utama
app.get('/', (req, res) => {
  res.render('index');
});

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database MySQL berhasil terhubung!');
    connection.release(); // Kembalikan koneksi ke pool
  } catch (error) {
    console.error('Gagal konek ke database MySQL:', error.message);
  }
}

testConnection();