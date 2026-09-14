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

  // Buat folder/section baru.
  // parent_id opsional: bila diisi, folder dibuat sebagai section di dalam folder induk.
  async createFolder(req, res) {
    try {
      const { user_id, name, icon, color, parent_id } = req.body;
      if (!user_id || !name) {
        return res.status(400).json({ error: 'user_id dan nama folder wajib diisi.' });
      }

      const hexColor = normalizeHexColor(color);
      if (hexColor === undefined) {
        return res.status(400).json({ error: 'Kode warna tidak valid. Gunakan format hex, mis. #8128ed.' });
      }

      // Validasi parent: bila diisi, folder induk harus ada, milik user yang sama,
      // dan berupa folder utama (bukan section) agar kedalaman maksimal 1 tingkat.
      let parentId = null;
      if (parent_id !== undefined && parent_id !== null && parent_id !== '') {
        parentId = Number(parent_id);
        if (!Number.isInteger(parentId) || parentId <= 0) {
          return res.status(400).json({ error: 'Folder induk tidak valid.' });
        }

        const parent = await FolderModel.getById(parentId, user_id);
        if (!parent) {
          return res.status(404).json({ error: 'Folder induk tidak ditemukan.' });
        }
        if (parent.parent_id) {
          return res.status(400).json({ error: 'Section tidak dapat memiliki sub-section.' });
        }
      }

      const id = await FolderModel.create(user_id, name, icon, hexColor, parentId);
      res.status(201).json({ id, name, icon: icon || 'fa-folder', color: hexColor, parent_id: parentId });
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
      const { user_id } = req.query;
      if (!user_id) {
        return res.status(400).json({ error: 'user_id wajib disertakan.' });
      }

      const affected = await FolderModel.delete(id, user_id);
      if (!affected) {
        return res.status(404).json({ error: 'Folder tidak ditemukan.' });
      }

      res.json({ message: 'Folder berhasil dihapus.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default FolderController;