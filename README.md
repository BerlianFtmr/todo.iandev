# todo.iandev

Aplikasi web **Todo List & Progress Tracker** sederhana yang dibangun dengan **Node.js**, **Express 5**, template **EJS**, dan **MySQL 8** sebagai penyimpanan data. Project ini mendemonstrasikan operasi CRUD untuk pengguna, task, folder, dan commit log, serta sudah dilengkapi konfigurasi Docker siap production.

---

## Daftar Isi
- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Menjalankan Aplikasi (Development)](#menjalankan-aplikasi-development)
- [Menjalankan Aplikasi (Production / Docker)](#menjalankan-aplikasi-production--docker)
- [Endpoint API](#endpoint-api)
- [Struktur Project](#struktur-project)
- [Lisensi](#lisensi)

---

## Fitur
- Registrasi dan autentikasi pengguna (password di-hash dengan **bcryptjs**)
- Create, read, update, delete **Task**
- Mengelompokkan task ke dalam **folder** (dengan ikon kustom)
- Melacak perubahan dengan **commit log** (timeline progress)
- Front-end single-page menggunakan **EJS** + Tailwind CSS + Font Awesome
- 4 pilihan tema warna (Blue Sky, Lavender Mist, Emerald Breeze, Rose Sunset)
- Penanganan **zona waktu WIB (Asia/Jakarta)** yang konsisten untuk semua timestamp

> Design system divisualisasikan secara detail di [`DESIGN.md`](./DESIGN.md).

---

## Teknologi

| Layer    | Teknologi                          |
|----------|-------------------------------------|
| Frontend | EJS single-page, Tailwind CSS (CDN), Font Awesome 6 |
| Backend  | Express 5 (ES Modules), Node.js 20  |
| Database | MySQL 8 (via Docker)                |
| Auth     | bcryptjs, sesi disimpan di `localStorage` |

---

## Prasyarat
- **Node.js** (v20 atau lebih baru) – lihat [nodejs.org](https://nodejs.org/)
- **npm** (sudah termasuk saat install Node)
- **MySQL** server (disarankan v8). Project ini sudah menyertakan file Docker Compose untuk menjalankan MySQL otomatis.
- **Docker** & **Docker Compose** (untuk alur kerja container)

---

## Instalasi
```bash
# Clone repository (jika belum)
git clone <repository-url>
cd todolist

# Install dependency
npm install
```

---

## Konfigurasi

### Development (`.env`)
Buat file `.env` di root project dengan kredensial database lokal:
```dotenv
DB_HOST=127.0.0.1
DB_USER=myuser
DB_PASSWORD=123456
DB_NAME=tododb
DB_PORT=3307
```

### Production (`.env.production`)
Untuk stack Docker production, salin template lalu isi nilai sebenarnya:
```bash
cp .env.production.example .env.production
```
```dotenv
MYSQL_ROOT_PASSWORD=<password-root-kuat>
DB_USER=myuser
DB_PASSWORD=<password-db-kuat>
DB_NAME=tododb

DB_HOST=mysql        # nama service di dalam Docker network
DB_PORT=3306
APP_TIMEZONE=+07:00
PORT=5000
APP_HOST_PORT=127.0.0.1:5000
```

> **⚠️ Penting:** `.env` dan `.env.production` dikecualikan dari version control melalui `.gitignore` agar kredensial tetap aman. Gunakan password yang kuat dan **berbeda** untuk `MYSQL_ROOT_PASSWORD` dan `DB_PASSWORD` sebelum deploy.

---

## Menjalankan Aplikasi (Development)
```bash
# Jalankan container MySQL (dev)
docker compose up -d

# Jalankan server dengan auto-restart
npm run dev

# Atau jalankan server seperti biasa
npm start
```
Aplikasi berjalan di **port 5000** (dapat diubah lewat `PORT`). Buka browser di `http://localhost:5000`.

---

## Menjalankan Aplikasi (Production / Docker)

Stack production berupa image Docker multi-stage yang berjalan sebagai **non-root**, menjalankan **Express + EJS**, dengan **MySQL 8** pada named volume tersendiri. Networking, reverse proxy, dan SSL diasumsikan ditangani secara eksternal (mis. **Cloudflare Tunnel**), sehingga port aplikasi hanya di-bind ke **localhost**.

```bash
# Build dan jalankan stack production
docker compose -f docker-compose.prod.yml up -d --build

# Cek status dan log
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app

# Hentikan (data tetap aman di named volume)
docker compose -f docker-compose.prod.yml down

# Hentikan dan hapus volume database (⚠️ menghapus seluruh data)
docker compose -f docker-compose.prod.yml down -v
```

**Catatan**
- Aplikasi diakses melalui `127.0.0.1:5000` pada host. Arahkan Cloudflare Tunnel ke `http://localhost:5000`.
- `schema.sql` dijalankan otomatis **hanya saat volume MySQL masih kosong** (inisialisasi pertama). Perubahan skema berikutnya harus diterapkan manual.
- MySQL **tidak** di-publish ke host; hanya dapat diakses oleh service `app` di dalam Docker network.
- Kedua service memiliki healthcheck; aplikasi menunggu MySQL berstatus `healthy` sebelum dijalankan.

---

## Endpoint API

| Method | Path                      | Deskripsi                      |
|--------|---------------------------|--------------------------------|
| POST   | `/api/auth/register`      | Registrasi pengguna baru       |
| POST   | `/api/auth/login`         | Autentikasi pengguna           |
| —      | `/api/folders`            | CRUD folder                    |
| —      | `/api/todos`              | CRUD task                      |
| —      | `/api/commit-logs`        | CRUD commit log                |
| GET    | `/`                       | Menyajikan view SPA (`index.ejs`) |

---

## Struktur Project
```
├─ src/
│   ├─ config/          # Connection pool DB (timezone-aware)
│   ├─ controllers/     # Request handler
│   ├─ models/          # Model data (query SQL)
│   ├─ routes/          # Definisi route Express
│   ├─ views/           # Template EJS (index.ejs + partials)
│   └─ app.js           # Entry point aplikasi (port 5000)
├─ docs/                # Catatan prompt / planning
├─ mysql-data/          # Data MySQL lokal (dev, gitignored)
├─ schema.sql           # Skema database (users, folders, todos, commit_logs)
├─ Dockerfile           # Image production multi-stage
├─ .dockerignore        # Pengecualian build context
├─ docker-compose.yml       # Dev: container MySQL
├─ docker-compose.prod.yml  # Prod: stack app + MySQL
├─ .env.production.example  # Template env production
├─ .env                 # Environment variable dev (tidak di-commit)
├─ .env.production      # Environment variable prod (tidak di-commit)
├─ DESIGN.md            # Referensi design system
├─ package.json         # Metadata & script npm
└─ README.md            # File ini
```

---

## Lisensi
Project ini dilisensikan di bawah **ISC** license.

---

*Happy coding!*
