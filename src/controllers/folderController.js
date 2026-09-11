import FolderModel from '../models/folderModel.js';

const FolderController = {
  // Ambil daftar folder milik user
  async getFolders(req, res) {
    try {
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib disertakan.' });
      }

      const folders = await FolderModel.getAllByUser(user_id);
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Buat folder baru
  async createFolder(req, res) {
    try {
      const { user_id, name, icon } = req.body;
      if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id dan nama folder wajib diisi.' });
      }

      const id = await FolderModel.create(user_id, name, icon);
      res.status(201).json({ id, name, icon: icon || 'fa-folder' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update folder
  async updateFolder(req, res) {
    try {
      const { id } = req.params;
      const { user_id, name, icon } = req.body;
      if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id dan nama folder wajib diisi.' });
      }

      const affected = await FolderModel.update(id, user_id, name, icon);
      if (!affected) {
        return res.status(404).json({ error: 'Folder tidak ditemukan.' });
      }

      res.json({ id: Number(id), name, icon: icon || 'fa-folder' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Hapus folder
  async deleteFolder(req, res) {
    try {
      const { id } = req.params;
      await FolderModel.delete(id);
      res.json({ message: 'Folder berhasil dihapus.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default FolderController;