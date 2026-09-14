-- Migration: tambah kolom `color` pada tabel folders
-- Fitur: pilihan warna folder (hex code) saat create/edit folder.
--
-- Kolom `color` menyimpan kode hex 7 karakter (mis. '#8128ed') atau NULL
-- bila user tidak memilih warna (folder memakai warna brand tema).
--
-- Sifat: IDEMPOTENT — aman dijalankan berulang. Jika kolom `color` sudah ada,
-- script ini tidak melakukan apa-apa (tidak error).
--
-- Cara pakai pada database yang sudah ada:
--   Prod (di dalam host):
--     docker exec -i todo_iandev_mysql mysql -u myuser -p tododb < "migrations/2026-09-14 - add color column to folders.sql"
--   Dev (port 3307 di host):
--     mysql -h 127.0.0.1 -P 3307 -u myuser -p tododb < "migrations/2026-09-14 - add color column to folders.sql"

USE tododb;

-- Tambahkan kolom hanya jika belum ada (MySQL tidak punya ADD COLUMN IF NOT EXISTS).
SET @col_exists := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'folders'
    AND COLUMN_NAME = 'color'
);

SET @ddl := IF(
  @col_exists = 0,
  'ALTER TABLE folders ADD COLUMN color CHAR(7) NULL AFTER icon',
  'SELECT ''Kolom color sudah ada, migration dilewati.'' AS info'
);

PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
