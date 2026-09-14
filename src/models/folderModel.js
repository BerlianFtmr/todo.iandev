import db from '../config/db.js';

const FolderModel = {
  // Ambil semua folder milik user tertentu
  async getAllByUser(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM folders WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    return rows;
  },

  // Tambah folder baru
  async create(userId, name, icon, color) {
    const [result] = await db.execute(
      'INSERT INTO folders (user_id, name, icon, color) VALUES (?, ?, ?, ?)',
      [userId, name, icon || 'fa-folder', color || null]
    );
    return result.insertId;
  },

  // Update folder berdasarkan ID
  async update(id, userId, name, icon, color) {
    const [result] = await db.execute(
      'UPDATE folders SET name = ?, icon = ?, color = ? WHERE id = ? AND user_id = ?',
      [name, icon || 'fa-folder', color || null, id, userId]
    );
    return result.affectedRows;
  },

  // Hapus folder berdasarkan ID
  async delete(id) {
    await db.execute('DELETE FROM folders WHERE id = ?', [id]);
  }
};

export default FolderModel;