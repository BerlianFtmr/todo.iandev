import FolderModel from '../models/folderModel.js';

// Normalisasi kode warna hex. Mengembalikan '#rrggbb' (lowercase) bila valid,
// null bila kosong, atau undefined bila formatnya tidak valid.
// Mendukung format '#rgb' dan '#rrggbb'.
function normalizeHexColor(value) {
  if (value === undefined || value === null) return null;
  const raw = String(value).trim();
  if (raw === '') return null;
  if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(raw)) return undefined;

  let hex = raw.startsWith('#') ? raw.slice(1) : raw;
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  return `#${hex.toLowerCase()}`;
}

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
      const { user_id, name, icon, color } = req.body;
      if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id dan nama folder wajib diisi.' });
      }

      const hexColor = normalizeHexColor(color);
      if (hexColor === undefined) {
        return res.status(400).json({ error: 'Kode warna tidak valid. Gunakan format hex, mis. #8128ed.' });
      }

      const id = await FolderModel.create(user_id, name, icon, hexColor);
      res.status(201).json({ id, name, icon: icon || 'fa-folder', color: hexColor });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update folder
  async updateFolder(req, res) {
    try {
      const { id } = req.params;
      const { user_id, name, icon, color } = req.body;
      if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id dan nama folder wajib diisi.' });
      }

      const hexColor = normalizeHexColor(color);
      if (hexColor === undefined) {
        return res.status(400).json({ error: 'Kode warna tidak valid. Gunakan format hex, mis. #8128ed.' });
      }

      const affected = await FolderModel.update(id, user_id, name, icon, hexColor);
      if (!affected) {
        return res.status(404).json({ error: 'Folder tidak ditemukan.' });
      }

      res.json({ id: Number(id), name, icon: icon || 'fa-folder', color: hexColor });
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