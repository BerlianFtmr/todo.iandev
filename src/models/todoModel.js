import db from '../config/db.js';

const TodoModel = {
  // Ambil semua task milik user
  async getAllByUser(userId) {
    const [rows] = await db.execute(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    return rows;
  },

  // Tambah task baru
  async create(userId, folderId, title, description, priority, icon, dueDate) {
    const [result] = await db.execute(
      'INSERT INTO todos (user_id, folder_id, title, description, priority, icon, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        folderId || null,
        title,
        description || '',
        priority || 'Sedang',
        icon || 'fa-list-check',
        dueDate || null
      ]
    );
    return result.insertId;
  },

  // Update status (pending <-> completed)
  async updateStatus(id, status) {
    await db.execute(
      'UPDATE todos SET status = ? WHERE id = ?',
      [status, id]
    );
  },

  // Hapus task
  async delete(id) {
    await db.execute('DELETE FROM todos WHERE id = ?', [id]);
  }
};

export default TodoModel;