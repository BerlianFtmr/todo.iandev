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

  // Update data task (judul, deskripsi, folder, icon)
  async update(id, userId, payload) {
    const fields = [];
    const values = [];

    const allowed = {
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      icon: payload.icon,
      folder_id: payload.folder_id,
      due_date: payload.due_date
    };

    for (const [column, value] of Object.entries(allowed)) {
      if (value === undefined) continue;
      fields.push(`${column} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return 0;

    values.push(id, userId);
    const [result] = await db.execute(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return result.affectedRows;
  },

  // Update status (pending <-> completed)
  async updateStatus(id, userId, status) {
    const [result] = await db.execute(
      'UPDATE todos SET status = ? WHERE id = ? AND user_id = ?',
      [status, id, userId]
    );
    return result.affectedRows;
  },

  // Hapus task
  async delete(id, userId) {
    const [result] = await db.execute(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  }
};

export default TodoModel;