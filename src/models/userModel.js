import db from '../config/db.js';

const UserModel = {
  // Tambah user baru (Register)
  async create(displayName, email, password) {
    const [result] = await db.execute(
      'INSERT INTO users (display_name, email, password) VALUES (?, ?, ?)',
      [displayName, email, password]
    );
    return result.insertId;
  },

  // Cari user berdasarkan email (Login)
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }
};

export default UserModel;