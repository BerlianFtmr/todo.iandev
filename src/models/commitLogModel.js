import db from '../config/db.js';

const CommitLogModel = {
  // Ambil riwayat commit khusus untuk 1 task
  async getByTodo(todoId) {
    const [rows] = await db.execute(
      'SELECT * FROM commit_logs WHERE todo_id = ? ORDER BY id DESC',
      [todoId]
    );
    return rows;
  },

  // Catat commit log baru
  async create(userId, todoId, message) {
    const [result] = await db.execute(
      'INSERT INTO commit_logs (user_id, todo_id, message) VALUES (?, ?, ?)',
      [userId, todoId, message]
    );
    return result.insertId;
  },

  // Hapus commit log berdasarkan ID
  async delete(id) {
    const [result] = await db.execute(
      'DELETE FROM commit_logs WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

export default CommitLogModel;