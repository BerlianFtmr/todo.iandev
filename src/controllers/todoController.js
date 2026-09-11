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

  async updateTodo(req, res) {
    try {
      const { id } = req.params;
      const { user_id, folder_id, title, description, priority, icon, due_date } = req.body;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib diisi.' });
      }

      const affected = await TodoModel.update(id, user_id, {
        folder_id: folder_id ?? null,
        title,
        description,
        priority,
        icon,
        due_date
      });

      if (!affected) {
        return res.status(404).json({ error: 'Task tidak ditemukan.' });
      }

      res.json({ message: 'Task berhasil diperbarui.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async toggleTodo(req, res) {
    try {
      const { id } = req.params;
      const { status, user_id } = req.body; // 'pending' atau 'completed'

      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib diisi.' });
      }
      if (!['pending', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status tidak valid.' });
      }

      const affected = await TodoModel.updateStatus(id, user_id, status);
      if (!affected) {
        return res.status(404).json({ error: 'Task tidak ditemukan.' });
      }

      res.json({ message: 'Status task berhasil diperbarui.', status });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteTodo(req, res) {
    try {
      const { id } = req.params;
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib disertakan.' });
      }

      const affected = await TodoModel.delete(id, user_id);
      if (!affected) {
        return res.status(404).json({ error: 'Task tidak ditemukan.' });
      }

      res.json({ message: 'Task berhasil dihapus.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};



export default TodoController;