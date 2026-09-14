# DESIGN.md — FocusDo Design System

> Referensi design & visual pattern aplikasi **FocusDo** (Todo List & Progress Tracker).
> Dokumen ini mendokumentasikan kondisi design yang **sudah berjalan saat ini** agar
> pengembangan berikutnya tetap konsisten.
>
> Sumber kebenaran utama: `src/views/index.ejs` (single-page view) dan
> `src/views/partials/dateUtils.ejs`.

---

## 1. Ringkasan

FocusDo adalah aplikasi SPA bergaya **soft / pastel modern** dengan:

- **Font**: Plus Jakarta Sans (Google Fonts, weight 400/500/600/700)
- **CSS Framework**: Tailwind CSS (via CDN `cdn.tailwindcss.com` + `tailwind.config` inline)
- **Icon**: Font Awesome v6 (via CDN)
- **Theming**: 4 tema warna berbasis CSS custom properties (`--c-*`) yang di-drive oleh
  atribut `data-theme` di `<html>`
- **Bentuk**: Dominan rounded (`rounded-xl`, `rounded-2xl`, `rounded-full`), shadow lembut
- **Bahasa UI**: Bahasa Indonesia, formal-santai ("Masuk", "Semua Task", "Sedang Jalan")

---

## 2. Arsitektur Tampilan (SPA Views)

Aplikasi membungkus semua layar dalam satu `<div id="app">`, dan menampilkan/menyembunyikan
view dengan class `.hidden` (state di `state` global JS). Tidak ada routing URL.

| View | ID | Deskripsi |
|---|---|---|
| Login / Register | `#loginView` | Kartu auth terpusat + theme switcher di kanan atas |
| Dashboard | `#dashboardView` | Sidebar folder + main content (grid kartu task) |
| Detail Task | `#detailScreenView` | Full-screen: info task (kiri) + timeline progress commit (kanan) |
| Modal Folder | `#folderModal` | Tambah/Edit folder + icon picker |
| Modal Todo | `#todoModal` | Tambah/Edit task + icon picker |

Transisi antar view dikendalikan fungsi JS: `enterDashboard()`, `openTodoDetailScreen(id)`,
`backToDashboard()`, `handleLogout()`.

---

## 3. Sistem Tema (Theming)

### 3.1 Mekanisme

- Warna brand disimpan sebagai **channel RGB** pada CSS variable `--c-50` … `--c-950`
  (pola sama dengan skala Tailwind), lalu dipetakan ke color `lavender` di `tailwind.config`:

  ```js
  lavender: { 500: 'rgb(var(--c-500) / <alpha-value>)', ... }
  ```

- Ganti tema = ubah `document.documentElement.setAttribute('data-theme', key)`.
- Tema aktif disimpan di `localStorage.user_theme` (default: `sky`).
- Tema diterapkan paling awal di `window.onload` → `switchTheme(savedTheme)`.

> **Penting:** nama color `lavender-*` dipakai di seluruh markup, tetapi secara efektif
> berarti **"warna brand aktif"**, bukan selalu ungu. Jangan hardcode `bg-lavender-*`
> dengan asumsi ungu.

### 3.2 Daftar Tema

| Key (`data-theme`) | Nama Tampilan | Ikon Badge | Accent 600 (hex) |
|---|---|---|---|
| `sky` (default) | Blue Sky | `fa-cloud-sun` | `#0284c7` |
| `lavender` | Lavender Mist | `fa-droplet` | `#8128ed` |
| `emerald` | Emerald Breeze | `fa-leaf` | `#059669` |
| `rose` | Rose Sunset | `fa-heart` | `#e11d48` |

Definisi sumber ada di blok `<style>` (`index.ejs` baris ~45) dan objek `THEMES` di JS.

### 3.3 Dua Varian Theme Switcher

1. **Login view** — baris bulatan warna (swatch) di kanan atas, `bg-white/80 backdrop-blur-md`.
2. **Dashboard header** — tombol pill dengan label teks + dot warna; tombol aktif diberi
   `bg-white border border-slate-200 shadow-sm`, non-aktif `text-slate-500 hover:bg-slate-100`.

Saat menambah tema baru, perbarui **ketiga tempat**: variabel CSS, objek `THEMES`, dan
markup tombol switcher (login + header dashboard).

---

## 4. Palet Warna & Peran

Warna brand berasal dari variable tema. Warna **semantik status** tetap konstan di semua tema:

| Peran | Kelas Tailwind | Penggunaan |
|---|---|---|
| Brand / aksi utama | `lavender-600` / `lavender-700` (hover) | Tombol primer, tab aktif, filter aktif, ikon brand |
| Brand permukaan | `lavender-50`, `lavender-100` | Badge, highlight aktif, header modal, background ikon |
| Teks utama | `text-slate-800` | Judul, nama item |
| Teks sekunder | `text-slate-500` / `text-slate-400` | Deskripsi, label, meta |
| Latar aplikasi | `bg-slate-50` | Body dashboard, panel utama |
| Permukaan kartu | `bg-white` | Kartu, sidebar, header |
| Garis/border | `border-slate-100/200`, `border-lavender-100` | Pemisah, tepi kartu |
| **Sukses / Selesai** | `emerald-500/600`, `emerald-100/800` | Status selesai, tombol "Tandai Selesai", toast sukses |
| **Pending / Proses** | `amber-50/200/500/700` | Status "Sedang Jalan", tombol "Tandai Belum Selesai" |
| **Bahaya / Hapus** | `rose-50/200/500/600` | Aksi hapus, alert error, logout hover, toast error |
| Netral gelap | `slate-800` | Toast info |

### Aturan warna
- Aksi destruktif **selalu** memakai `rose`, tidak pernah memakai warna brand.
- Status "Selesai" **selalu** `emerald`; "Sedang Jalan" **selalu** `amber`.
- Tombol primer memakai warna brand (`lavender-600`) + shadow bernuansa brand
  (`shadow-lavender-500/20` atau `shadow-lavender-500/25`).

---

## 5. Tipografi

| Peran | Kelas | Catatan |
|---|---|---|
| Judul halaman | `text-xl font-bold text-slate-800` | Header folder, judul detail task |
| Judul kartu | `text-base font-bold text-slate-800` | Judul task di kartu |
| Nama brand | `text-2xl font-bold text-slate-800` | Login; `text-base` di sidebar |
| Body/deskripsi | `text-xs md:text-sm text-slate-700` | Deskripsi task, isi log commit |
| Label form | `text-xs font-semibold text-slate-600` | Di atas input |
| Label seksi (overline) | `text-[11px] font-bold uppercase tracking-wider text-slate-400` | "Menu Utama", "Folder Saya", "Histori Catatan Progress" |
| Label login | `text-xs font-semibold uppercase tracking-wider text-slate-600` | Label form auth |
| Meta/waktu | `text-[11px] text-slate-400` + ikon `fa-regular fa-clock` | Tanggal dibuat, timestamp log |

Prinsip: ukuran teks kecil (11–14px) mendominasi; hirarki dibangun lewat **weight** dan
**warna slate**, bukan ukuran besar. Semua teks pakai Bahasa Indonesia.

---

## 6. Bentuk, Radius, Shadow, Spacing

| Elemen | Radius | Shadow | Padding |
|---|---|---|---|
| Kartu task | `rounded-2xl` | `shadow-sm` → `hover:shadow-md` | `p-5` |
| Panel besar (sidebar/header/modal body) | `rounded-2xl` / `rounded-xl` | `shadow-sm` / `shadow-2xl` (modal) | `p-4`–`p-6` |
| Tombol | `rounded-xl` | `shadow-md shadow-lavender-500/20` (primer) | `px-4 py-2.5` |
| Input/textarea | `rounded-xl` | — | `px-4 py-2.5` |
| Badge / chip / filter | `rounded-lg` / `rounded-full` | `shadow-sm` saat aktif | `px-2.5 py-1` |
| Swatch tema (login) | `rounded-full` | `shadow` | `w-7 h-7` |

- Jarak antar seksi konten: `space-y-6`; antar item nav: `space-y-1`.
- Grid kartu: `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4`.
- Grid layout detail task: `grid-cols-1 lg:grid-cols-3 gap-6` (info = 1 kolom, timeline = 2 kolom).
- Micro-interaction: `transition` pada hampir semua elemen interaktif;
  tombol punya `active:scale-95` atau `active:scale-[0.98]`.

---

## 7. Komponen

### 7.1 Tombol

**Primer** (aksi utama, simpan, buat):
```
bg-lavender-600 hover:bg-lavender-700 text-white font-semibold rounded-xl
shadow-md shadow-lavender-500/20 transition active:scale-95
```

**Sekunder / netral** (Batal, Kembali):
```
bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl shadow-sm
```

**Destruktif** (Hapus):
```
bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl
```

**Ghost / ikon** (edit & hapus pada folder, tombol X modal):
```
text-slate-400 hover:text-lavender-700 (edit) | hover:text-rose-600 (hapus)
opacity-0 group-hover:opacity-100  ← muncul saat hover induk
```

**Status toggle di detail task**: full-width, berubah warna sesuai aksi —
`bg-emerald-600` untuk "Tandai Selesai", `bg-amber-500` untuk "Tandai Belum Selesai".

### 7.2 Kartu Task

- `bg-white border border-lavender-100 rounded-2xl p-5 shadow-sm hover:shadow-md`
- Hover: `hover:border-lavender-300`, judul jadi `group-hover:text-lavender-700`
- **Status Selesai**: kartu jadi `bg-emerald-50/20 border-emerald-200`, judul `line-through text-slate-400`
- Struktur: badge folder (kiri) + badge status (kanan) → checkbox + judul & deskripsi
  (`line-clamp-2`) → footer: waktu dibuat + jumlah log commit
- Seluruh kartu klikabel → membuka detail screen
- Checkbox bulat `w-6 h-6 rounded-lg border-2`, tercentang = `bg-emerald-500 border-emerald-500`

### 7.3 Badge & Chip

- **Folder badge**: `text-[11px] font-bold bg-lavender-50 text-lavender-700 border border-lavender-100 rounded-lg`
- **Status Selesai**: `bg-emerald-100 text-emerald-800` + `fa-circle-check`
- **Status Sedang Jalan**: `bg-amber-50 text-amber-700 border border-amber-200` + `fa-spinner fa-spin`
- **Counter nav**: pill `bg-white text-lavender-700 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm`
  (aktif); `bg-slate-100 text-slate-500` (non-aktif)
- **Log commit badge**: `bg-lavender-50 text-lavender-700 border border-lavender-200 rounded-xl` + `fa-code-commit`

### 7.4 Form Control

```
w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-400 transition
```
- Label selalu di atas input, sering disertai ikon Font Awesome kecil berwarna `text-lavender-500`.
- Textarea memakai pola sama dengan `rows` 3.
- Select folder untuk task memakai gaya identik.
- **Ikon picker**: grid tombol (`grid-cols-6` untuk folder, `grid-cols-8` untuk task).
  Terpilih = `bg-lavender-600 text-white border-lavender-600 shadow`; tidak = `border-slate-200 text-slate-600 hover:bg-slate-100`.
  Nilai disimpan pada `<input type="hidden">` (`selectedFolderIcon`, `selectedTodoIcon`).

Daftar ikon folder (`ICON_LIST`):
`fa-folder, fa-graduation-cap, fa-code, fa-book, fa-dumbbell, fa-briefcase, fa-heart, fa-layer-group, fa-laptop-code, fa-pen-nib, fa-list-check, fa-star`

Daftar ikon task (`TASK_ICON_LIST`):
`fa-list-check, fa-book, fa-code, fa-laptop-code, fa-pen-nib, fa-graduation-cap, fa-fire, fa-rocket, fa-lightbulb, fa-dumbbell, fa-star, fa-flag, fa-bell, fa-calendar-check, fa-bullseye, fa-heart`

### 7.5 Navigasi Sidebar

- Item nav: `px-3 py-2.5 rounded-xl text-sm font-medium`
- **Aktif**: `bg-lavender-100 text-lavender-900 font-semibold shadow-sm`
- **Non-aktif**: `text-slate-600 hover:bg-slate-100`
- Ikon di kiri `w-5 text-lavender-600`, counter di kanan, tombol edit/hapus muncul on-hover.
- Footer sidebar = kartu user (avatar `rounded-full bg-lavender-600`) + tombol logout.

### 7.6 Tab & Filter

- **Tab auth** (Masuk/Daftar): container `flex bg-slate-100 p-1 rounded-xl`; tab aktif
  `bg-lavender-600 text-white shadow`, non-aktif `text-slate-500 hover:text-slate-800`.
- **Filter status** (Semua/Sedang Jalan/Selesai): chip aktif `bg-lavender-600 text-white shadow-sm`,
  non-aktif `text-slate-600 hover:bg-lavender-100`.

### 7.7 Modal

- Overlay: `fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4`
- Panel: `bg-white rounded-2xl w-full shadow-2xl border border-lavender-100 overflow-hidden`
  (max-w-md folder, max-w-lg task)
- Header modal: `bg-lavender-50 px-6 py-4 border-b border-lavender-100`, judul + ikon brand + tombol X.
- Footer aksi: rata kanan, `Batal` (ghost) lalu aksi utama (primer).
- Buka/tutup via `classList.remove/add('hidden')`; tidak ada focus-trap/ESC handler (catatan teknis).

### 7.8 Timeline Progress Commit

- Item: `flex gap-3`; kolom kiri berisi dot bulat
  `w-7 h-7 bg-lavender-100 text-lavender-600 rounded-full` + ikon `fa-code-commit`,
  dihubungkan garis vertikal `w-0.5 bg-slate-200`.
- Kartu isi: `bg-slate-50 border border-slate-200/80 rounded-xl p-3.5`,
  berisi timestamp + tombol hapus, lalu pesan `whitespace-pre-line`.
- **Empty state**: `text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl`.

### 7.9 Toast (Notifikasi)

Dibuat dinamis oleh `showToast(message, type)` — `fixed bottom-5 right-5 z-[9999]`,
`rounded-xl text-white text-sm font-medium shadow-lg`, auto-dismiss 3 detik.

| Type | Background |
|---|---|
| `info` (default) | `bg-slate-800` |
| `success` | `bg-emerald-600` |
| `error` | `bg-rose-600` |

### 7.10 Alert Inline (Auth)

`p-3 rounded-xl text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200`,
disembunyikan dengan `.hidden` (elemen `#loginAlert`, `#registerAlert`).

### 7.11 Empty State

Pola kartu: `col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-lavender-200 p-8`,
diisi lingkaran ikon `w-12 h-12 bg-lavender-50 text-lavender-400 rounded-full`,
judul `font-bold text-slate-700`, deskripsi `text-xs text-slate-400`.

### 7.12 Logo / Brand Mark

Kotak ikon rounded dengan `bg-lavender-100 text-lavender-600`, ikon `fa-list-check`,
dan teks "FocusDo". Dipakai konsisten di login, sidebar, dan favicon/title.

---

## 8. Ikonografi

- Library: **Font Awesome 6** (`fa-solid` mayoritas, `fa-regular fa-clock` untuk waktu).
- Ikon selalu mendampingi teks pada tombol/badge (jarak `gap-1.5`–`gap-2`).
- Ikon kunci: `fa-list-check` (brand/task), `fa-layer-group` (semua task),
  `fa-code-commit` (progress log), `fa-folder*` (folder), `fa-pen-to-square` (edit),
  `fa-trash` (hapus), `fa-circle-plus`/`fa-square-plus` (tambah), `fa-palette` (tema).
- Ikon status: `fa-circle-check` (selesai), `fa-spinner fa-spin` (proses),
  `fa-rotate-left` (batal selesai).
- Ikon folder & task ditentukan pengguna lewat icon picker dan disimpan di kolom DB `icon`.

---

## 9. Layout Responsif

- **Breakpoint utama**: `md` (sidebar dashboard) & `lg/xl` (grid kartu & detail).
- Aplikasi mobile-first; sidebar berubah jadi full-width di atas konten pada layar kecil.
- Grid kartu task: 1 kolom (mobile) → 2 (`lg`) → 3 (`xl`).
- Layout detail task: 1 kolom → 3 kolom (`lg`, info `col-span-1`, timeline `col-span-2`).
- Beberapa label tema disembunyikan di layar kecil (`hidden sm:inline`).
- Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.

---

## 10. Scrollbar Kustom

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: rgb(var(--c-100)); }
::-webkit-scrollbar-thumb { background: rgb(var(--c-300)); border-radius: 4px; }
```
Scrollbar mengikuti warna tema aktif (menggunakan variable tema).

---

## 11. Format Tanggal & Waktu (dateUtils.ejs)

- Utilitas bersama: `pad2`, `toLocalParts`, `formatDate`, `nowLocal`.
- **Aturan**: tampilkan waktu **lokal (WIB)** tanpa pergeseran UTC; tidak memakai
  `toISOString()`.
- Format tampilan baku: `YYYY-MM-DD HH:MM` (mis. `2026-09-10 14:15`).
- Diterapkan pada: tanggal dibuat task, timestamp log commit, dan data yang dipetakan
  dari API (`formatDate(t.created_at)`).

---

## 12. Pola Interaksi (UX)

- **Login** menampilkan/menyembunyikan form lewat tab (bukan pindah halaman).
- Aksi destruktif memakai `confirm()` bawaan browser sebelum eksekusi.
- Feedback aksi memakai **toast** (`success`/`error`), bukan alert.
- Hover menampilkan aksi tersembunyi (edit/hapus) via `group-hover`.
- Klik kartu task → buka detail full-screen; tombol "Kembali ke Dashboard" untuk keluar.
- Sesi disimpan di `localStorage.focusdo_active_user`; tema di `localStorage.user_theme`;
  data fallback per-user di `focusdo_folders_<id>` / `focusdo_todos_<id>` / `focusdo_logs_<id>`.

---

## 13. Panduan Konsistensi untuk Pengembangan Berikutnya

1. **Selalu pakai color `lavender-*`** untuk elemen brand agar otomatis mengikuti tema;
   jangan hardcode hex warna tema di markup (kecuali swatch switcher).
2. Gunakan **warna semantik** (emerald=sukses, amber=proses, rose=bahaya) secara konsisten;
   jangan memakai warna brand untuk aksi hapus.
3. **Radius**: kartu/panel `rounded-2xl`, kontrol & tombol `rounded-xl`, badge kecil `rounded-lg`,
   avatar/swatch `rounded-full`.
4. **Tipografi**: pertahankan Plus Jakarta Sans; bangun hirarki via weight + slate, ukuran tetap kecil.
5. **Ikon**: Font Awesome 6, selalu `fa-solid` untuk aksi; sertakan ikon pada tombol berteks.
6. **Bahasa**: seluruh teks UI Bahasa Indonesia.
7. **Spacing**: `space-y-6` untuk antar seksi, `gap-4` untuk grid kartu.
8. **Interaksi**: sertakan `transition`; tombol punya efek `active:scale-*`; feedback lewat toast.
9. **Menambah tema**: update variabel CSS `--c-*`, objek `THEMES`, dan kedua switcher markup.
10. **Menambah view**: bungkus sebagai cabang `#app` dengan pola `.hidden` + fungsi navigasi,
    bukan membuat halaman/route baru.

### Rujukan teknis (catatan, bukan aturan design)
Design system ini diimplementasikan **inline** dalam satu file `src/views/index.ejs`
(HTML + CSS + JS). Bila kelak dipecah (mis. ke frontend Vite/komponen), pertahankan
token warna, skala tipografi, dan pola komponen di atas sebagai acuan ekstraksi.
