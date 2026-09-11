import CommitLogModel from '../models/commitLogModel.js';

const CommitLogController = {
  async getLogs(req, res) {
    try {
      // Bisa dari query (?todo_id=) atau dari params (/api/todos/:id/logs)
      const todo_id = req.query.todo_id || req.params.id;
      if (!todo_id) {
        return res.status(400).json({ error: 'todo_id wajib disertakan.' });
      }

      const logs = await CommitLogModel.getByTodo(todo_id);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createLog(req, res) {
    try {
      const { user_id, message } = req.body;
      // todo_id bisa dari body atau dari params nested route
      const todo_id = req.body.todo_id || req.params.id;

      if (!user_id || !todo_id || !message) {
        return res.status(400).json({ error: 'user_id, todo_id, dan message wajib diisi.' });
      }

      const id = await CommitLogModel.create(user_id, todo_id, message);
      res.status(201).json({ id, user_id, todo_id, message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteLog(req, res) {
    try {
      const { id } = req.params;
      const affected = await CommitLogModel.delete(id);
      if (!affected) {
        return res.status(404).json({ error: 'Catatan log tidak ditemukan.' });
      }
      res.json({ message: 'Catatan log berhasil dihapus.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default CommitLogController;
