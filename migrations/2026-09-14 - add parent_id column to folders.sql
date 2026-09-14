-- Migration: tambah kolom `parent_id` pada tabel folders
-- Fitur: section / subfolder di dalam folder utama agar task lebih termanajemen.
--
-- Kolom `parent_id` merujuk ke folder induk (self-referencing).
--   - NULL  => folder utama (top-level)
--   - <id>  => section di dalam folder utama dengan id tersebut
--
-- Aturan: hanya mendukung satu tingkat kedalaman (section tidak boleh punya
-- subsection). Bila folder induk dihapus, section ikut terhapus (ON DELETE CASCADE).
--
-- Sifat: IDEMPOTENT — aman dijalankan berulang. Jika kolom `parent_id` sudah ada,
-- script ini tidak melakukan apa-apa (tidak error).
--
-- Cara pakai pada database yang sudah ada:
--   Prod (di dalam host):
--     docker exec -i todo_iandev_mysql mysql -u myuser -p tododb < "migrations/2026-09-14 - add parent_id column to folders.sql"
--   Dev (port 3307 di host):
--     mysql -h 127.0.0.1 -P 3307 -u myuser -p tododb < "migrations/2026-09-14 - add parent_id column to folders.sql"

USE tododb;

-- 1) Tambahkan kolom hanya jika belum ada (MySQL tidak punya ADD COLUMN IF NOT EXISTS).
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'folders'
    AND COLUMN_NAME = 'parent_id'
);

SET @ddl := IF(
  @col_exists = 0,
  'ALTER TABLE folders ADD COLUMN parent_id INT NULL AFTER user_id',
  'SELECT ''Kolom parent_id sudah ada, migration dilewati.'' AS info'
);

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) Tambahkan foreign key ke folders(id) bila belum ada.
SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'folders'
    AND CONSTRAINT_NAME = 'fk_folders_parent'
);

SET @ddl_fk := IF(
  @fk_exists = 0,
  'ALTER TABLE folders ADD CONSTRAINT fk_folders_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE',
  'SELECT ''Foreign key fk_folders_parent sudah ada, dilewati.'' AS info'
);

PREPARE stmt_fk FROM @ddl_fk;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;

-- 3) Tambahkan index untuk mempercepat query anak berdasarkan parent_id.
SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'folders'
    AND INDEX_NAME = 'idx_folders_parent'
);

SET @ddl_idx := IF(
  @idx_exists = 0,
  'ALTER TABLE folders ADD INDEX idx_folders_parent (parent_id)',
  'SELECT ''Index idx_folders_parent sudah ada, dilewati.'' AS info'
);

PREPARE stmt_idx FROM @ddl_idx;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;
