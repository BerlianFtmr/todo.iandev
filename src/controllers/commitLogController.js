import CommitLogModel from '../models/commitLogModel.js';

const CommitLogController = {
  async getLogs(req, res) {
    try {
      const { todo_id } = req.query;
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
      const { user_id, todo_id, message } = req.body;
      if (!user_id || !todo_id || !message) {
        return res.status(400).json({ error: 'user_id, todo_id, dan message wajib diisi.' });
      }

      const id = await CommitLogModel.create(user_id, todo_id, message);
      res.status(201).json({ id, user_id, todo_id, message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default CommitLogController;