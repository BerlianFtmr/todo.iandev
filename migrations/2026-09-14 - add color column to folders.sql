-- Migration: tambah kolom `color` pada tabel folders
-- Fitur: pilihan warna folder (hex code) saat create/edit folder.
--
-- Kolom `color` menyimpan kode hex 7 karakter (mis. '#8128ed') atau NULL
-- bila user tidak memilih warna (folder memakai warna brand tema).
--
-- Jalankan sekali pada database yang sudah ada:
--   mysql -h 127.0.0.1 -P 3307 -u myuser -p tododb < "migrations/2026-09-14 - add color column to folders.sql"

USE tododb;

ALTER TABLE folders
  ADD COLUMN color CHAR(7) NULL AFTER icon;
