import db from '../config/db.js';

const FolderModel = {
  // Ambil semua folder milik user tertentu (folder utama + section).
  // Urutkan folder utama lebih dulu, lalu section berdasarkan parent-nya.
  async getAllByUser(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM folders WHERE user_id = ? ORDER BY parent_id IS NOT NULL, parent_id ASC, id DESC',
      [userId]
    );
    return rows;
  },

  // Ambil satu folder berdasarkan ID dan user (untuk validasi parent).
  async getById(id, userId) {
    const [rows] = await db.execute(
      'SELECT * FROM folders WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );
    return rows[0] || null;
  },

  // Tambah folder/section baru.
  // parentId null => folder utama, parentId <id> => section di dalam folder tsb.
  async create(userId, name, icon, color, parentId = null) {
    const [result] = await db.execute(
      'INSERT INTO folders (user_id, parent_id, name, icon, color) VALUES (?, ?, ?, ?, ?)',
      [userId, parentId || null, name, icon || 'fa-folder', color || null]
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

  // Hitung section yang menjadi anak dari sebuah folder
  async countChildren(id, userId) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS total FROM folders WHERE parent_id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0]?.total || 0;
  },

  // Hapus folder berdasarkan ID
  async delete(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM folders WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  }
};

export default FolderModel;
