import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const UserController = {
  // Proses Register User Baru
  async register(req, res) {
    try {
      // Terima 'display_name' (backend) maupun 'name' (frontend)
      const display_name = req.body.display_name || req.body.name;
      const { email, password } = req.body;

      // Validasi input
      if (!display_name || !email || !password) {
        return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email sudah terdaftar.' });
      }

      // Hash password demi keamanan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user ke database
      const userId = await UserModel.create(display_name, email, hashedPassword);

      res.status(201).json({
        message: 'Registrasi berhasil!',
        user: { id: userId, name: display_name, display_name, email }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Proses Login User
  async login(req, res) {
    try {
      const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: 'Email dan password wajib diisi.' });
        }

        // Cari user berdasarkan email
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Email atau kata sandi salah.' });
        }

        // Bandingkan password yang diinput dengan password terenkripsi di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Email atau kata sandi salah.' });
        }

        // Berhasil login
        res.json({
          message: 'Login berhasil!',
          user: {
            id: user.id,
            name: user.display_name,
            display_name: user.display_name,
            email: user.email
          }
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default UserController;