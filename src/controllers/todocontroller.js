import TodoModel from '../models/todoModel.js';

const TodoController = {
  async getTodos(req, res) {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib disertakan.' });
      }

      const todos = await TodoModel.getAllByUser(user_id);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createTodo(req, res) {
    try {
      const { user_id, folder_id, title, description, priority, icon, due_date } = req.body;
      if (!user_id || !title) {
        return res.status(400).json({ error: 'user_id dan title wajib diisi.' });
      }

      const id = await TodoModel.create(
        user_id,
        folder_id,
        title,
        description,
        priority,
        icon,
        due_date
      );

      res.status(201).json({
        id,
        user_id,
        folder_id,
        title,
        description: description || '',
        priority: priority || 'Sedang',
        status: 'pending',
        icon: icon || 'fa-list-check',
        due_date
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async toggleTodo(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'pending' atau 'completed'

      await TodoModel.updateStatus(id, status);
      res.json({ message: 'Status task berhasil diperbarui.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      await TodoModel.delete(id);
      res.json({ message: 'Task berhasil dihapus.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};



export default TodoController;