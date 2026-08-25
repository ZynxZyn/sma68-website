# Product Requirements Document (PRD)

## Website Sekolah SMA 68 — Modern & Professional

**Versi:** 1.1
**Tanggal:** 17 Agustus 2026
**Platform:** Web Responsive
**Frontend:** React.js (Vite)
**Backend:** Next.js (App Router + Route Handlers)
**Database:** SQLite (dev) → MySQL/PostgreSQL (production, switch via Prisma)
**Authentication:** Next.js API + JWT (Access + Refresh Token)
**Target:** Siswa, orang tua, guru, alumni, calon siswa, dan masyarakat umum

---

## 0. Status Implementasi

> Status per 17 Agustus 2026. Checklist menandakan fitur yang **sudah diimplementasikan**.

### Backend (sudah berjalan di `backend/`, port 4000)

| Area | Status | Catatan |
| ---- | ------ | ------- |
| Autentikasi JWT (login/logout/refresh/me) | ✅ | Access token 15m + refresh token 7d (rotasi) |
| RBAC 5 role | ✅ | `SUPER_ADMIN`, `ADMIN`, `GURU`, `STAFF`, `SISWA` |
| CRUD Berita | ✅ | Slug otomatis, publish/unpublish, SEO fields |
| CRUD Pengumuman | ✅ | Publish date + expire date |
| CRUD Agenda | ✅ | Date, time, lokasi, cover image |
| CRUD Prestasi | ✅ | Kategori, level, tahun, tim |
| CRUD Galeri | ✅ | Multi-image, album, sort |
| CRUD Users | ✅ | Hashing bcrypt, update password, aktif/nonaktif |
| Stats Dashboard | ✅ | `GET /api/stats` |
| Activity Log model | ✅ | Tersedia di schema, pencatatan via `logActivity` |
| Validasi input | ✅ | Zod di semua endpoint |
| CORS | ✅ | Allowlist via `CORS_ORIGIN` di middleware |

### Database

- **Dev:** SQLite (`backend/prisma/dev.db`) — langsung jalan tanpa server eksternal.
- **Production:** ganti `provider = "sqlite"` → `"mysql"` di `backend/prisma/schema.prisma` + set `DATABASE_URL`. Schema (enum Role, model User, News, Announcement, Agenda, Achievement, Gallery, ActivityLog) sudah kompatibel.

### Seed data

Akun awal (password `Admin123!`):

```text
superadmin  (SUPER_ADMIN)
admin       (ADMIN)
guru1       (GURU)
staff1      (STAFF)
siswa1      (SISWA)
```

### Cara menjalankan

```bash
cd backend
npm install
npx prisma db push
npx prisma db seed
npm run dev        # http://localhost:4000
```

Frontend Vite tetap di root project (`npm run dev`, http://localhost:5173).

### Frontend (Login + Admin/Portal UI, port 5173)

| Area | Status | Catatan |
| ---- | ------ | ------- |
| Public Website UI (homepage) | ✅ | `src/components/*` — modern minimalist professional (navy/gold), responsive, mobile drawer nav |
| Halaman Login | ✅ | `/login`, auto-redirect sesuai role |
| Protected routes | ✅ | `RequireAuth` / `RequireRole` (RBAC) |
| Auth persistence | ✅ | Access + refresh token di localStorage, auto-refresh 401 |
| Admin Layout | ✅ | Sidebar responsif, menu mengikuti role |
| Dashboard stats | ✅ | `/admin` menampilkan statistik dari `/api/stats` |
| CRUD Berita UI | ✅ | Modal form, publish/archive toggle |
| CRUD Pengumuman UI | ✅ | Publish + expire date |
| CRUD Agenda UI | ✅ | Tanggal, waktu, lokasi |
| CRUD Prestasi UI | ✅ | Kategori, level, tahun |
| CRUD Galeri UI | ✅ | Multi-gambar, album |
| CRUD Users UI | ✅ | Role, aktif/nonaktif, cegah hapus akun sendiri |
| Portal Siswa | ✅ | `/dashboard` menampilkan pengumuman, agenda, berita |
| Section Berita (public) | ✅ | `src/components/Berita.jsx` mengambil data real-time dari `/api/news` (PUBLISHED) & `/api/agenda` (PUBLISHED) — data statis diganti API, dengan skeleton loading, empty & error state |
| Section Pengumuman (public) | ✅ | `src/components/Pengumuman.jsx` — ticker berjalan dari `/api/announcements` |
| Section Prestasi (public) | ✅ | `src/components/Prestasi.jsx` — grid prestasi dari `/api/achievements`, medal tone by level |
| Section Galeri (public) | ✅ | `src/components/Galeri.jsx` — grid foto dari `/api/gallery` + lightbox |
| Section Profil/Statistik | ✅ | `src/components/Profile.jsx` — statistik dari `/api/stats` (fallback statis jika 401) |
| AI Chatbot SMART68 | ✅ | `src/components/AIChatbot.jsx` — widget chat rule-based (FAQ sekolah) |
| Desain token | ✅ | Palet profesional navy/royal blue/gold (`--color-primary`, `--color-accent`) di `src/index.css` |

Routing: `react-router-dom` (`/`, `/login`, `/dashboard`, `/admin/*`). API base: `VITE_API_BASE_URL` (default `http://localhost:4000`).

---

## 1. Ringkasan Produk

Website SMA 68 merupakan platform digital resmi sekolah yang berfungsi sebagai pusat informasi, publikasi kegiatan, layanan akademik, serta portal login bagi pengguna internal sekolah.

Website menggunakan konsep **modern, professional, clean, responsive, dan academic**, dengan visual yang mencerminkan institusi pendidikan yang kredibel dan berorientasi pada teknologi.

Sistem dibagi menjadi:

1. **Public Website**

   * Informasi sekolah
   * Berita
   * Pengumuman
   * Agenda
   * Prestasi
   * Galeri
   * Informasi akademik
   * Informasi ekstrakurikuler
   * Kontak sekolah

2. **Authenticated Portal**

   * Login siswa
   * Login guru/staff
   * Dashboard berdasarkan role
   * Informasi akademik personal
   * Pengumuman internal
   * Profil pengguna

3. **Admin Dashboard**

   * Manajemen konten website
   * Manajemen user
   * Manajemen berita
   * Manajemen pengumuman
   * Manajemen agenda
   * Manajemen galeri
   * Manajemen data sekolah

---

# 2. Tujuan Produk

### Primary Goals

* Membangun website sekolah yang terlihat profesional dan modern.
* Menjadi sumber informasi resmi sekolah.
* Mempermudah siswa, guru, dan orang tua mendapatkan informasi.
* Menyediakan sistem login yang aman untuk pengguna internal.
* Mempermudah administrator mengelola konten website.
* Menampilkan identitas dan prestasi sekolah secara menarik.
* Menghasilkan website yang optimal di desktop, tablet, dan mobile.

### Success Metrics

Target awal:

* Lighthouse Performance ≥ 85
* Lighthouse Accessibility ≥ 90
* Lighthouse SEO ≥ 90
* Mobile responsive 100%
* Waktu loading halaman utama < 3 detik pada koneksi normal.
* Authentication berhasil dengan tingkat error minimal.
* Admin dapat mengelola konten tanpa mengubah kode.

---

# 3. Target User

## 3.1 Pengunjung Umum

Contoh:

* Calon siswa
* Orang tua
* Alumni
* Masyarakat
* Mitra sekolah

Kebutuhan:

* Mengenal sekolah
* Melihat berita
* Melihat prestasi
* Melihat agenda
* Melihat informasi akademik
* Menghubungi sekolah

---

## 3.2 Siswa

Kebutuhan:

* Login ke portal
* Melihat profil
* Melihat pengumuman
* Melihat jadwal
* Melihat informasi akademik
* Mendapatkan informasi kegiatan sekolah

---

## 3.3 Guru / Staff

Kebutuhan:

* Login
* Melihat dashboard
* Mengelola informasi tertentu
* Melihat pengumuman internal
* Mengakses data sesuai kewenangan

---

## 3.4 Administrator

Kebutuhan:

* Login administrator
* Mengelola user
* Mengelola berita
* Mengelola pengumuman
* Mengelola agenda
* Mengelola galeri
* Mengelola halaman sekolah
* Melihat aktivitas sistem

---

# 4. Konsep Visual

## Design Direction

Tema utama:

> **Modern Academic + Professional + Clean**

Karakter desain:

* Minimalis
* Elegan
* Banyak whitespace
* Typography kuat
* Foto sekolah sebagai visual utama
* Card dengan radius moderat
* Animasi subtle
* Tidak terlalu banyak efek
* Mobile-first

### Color Palette

Warna dapat disesuaikan dengan identitas resmi sekolah.

Contoh:

| Elemen         | Warna            |
| -------------- | ---------------- |
| Primary        | Navy / Dark Blue |
| Secondary      | Royal Blue       |
| Accent         | Gold             |
| Background     | #F8FAFC          |
| Surface        | #FFFFFF          |
| Text Primary   | #0F172A          |
| Text Secondary | #64748B          |
| Success        | #16A34A          |
| Warning        | #F59E0B          |
| Error          | #DC2626          |

### Typography

Rekomendasi:

* **Inter** untuk UI
* **Plus Jakarta Sans** sebagai alternatif

Heading dibuat bold dan prominent, sedangkan body text dibuat ringan dan mudah dibaca.

---

# 5. Struktur Website

## Public Navigation

```text
Home
├── Tentang Sekolah
│   ├── Profil
│   ├── Visi & Misi
│   ├── Sejarah
│   └── Struktur Organisasi
│
├── Akademik
│   ├── Program Akademik
│   ├── Informasi Akademik
│   └── Jadwal
│
├── Informasi
│   ├── Berita
│   ├── Pengumuman
│   └── Agenda
│
├── Prestasi
│
├── Ekstrakurikuler
│
├── Galeri
│
└── Kontak
```

Di bagian kanan navigation:

```text
[ 🔍 Search ] [ Login ]
```

Pada mobile:

```text
[ Logo ]                         [ ☰ ]
```

---

# 6. Halaman Homepage

Homepage menjadi halaman utama dan harus memberikan kesan profesional dalam 5–10 detik pertama.

## 6.1 Hero Section

Komponen:

* Foto/video sekolah
* Headline utama
* Deskripsi singkat
* CTA

Contoh:

> **Membangun Generasi Unggul untuk Masa Depan**

CTA:

```text
[ Tentang Sekolah ]
[ Jelajahi Informasi ]
```

Hero menggunakan image dengan overlay gradient agar teks tetap terbaca.

---

## 6.2 Quick Information

Menampilkan informasi penting dalam bentuk card.

Contoh:

```text
[ 🎓 Akademik ]
Informasi akademik sekolah

[ 🏆 Prestasi ]
Prestasi siswa dan sekolah

[ 📅 Agenda ]
Agenda dan kegiatan

[ 📢 Pengumuman ]
Informasi terbaru sekolah
```

---

## 6.3 Sambutan Kepala Sekolah

Layout:

```text
[ Foto Kepala Sekolah ] [ Sambutan ]

                          Nama Kepala Sekolah
                          Kepala Sekolah

                          "..."
                          
                          [ Selengkapnya ]
```

---

## 6.4 Tentang Sekolah

Menampilkan:

* Ringkasan sekolah
* Nilai/keunggulan sekolah
* Foto lingkungan sekolah

CTA:

```text
Pelajari Profil Sekolah →
```

---

## 6.5 Statistik Sekolah

Contoh:

```text
+----------------+
| 1.200+         |
| Siswa          |
+----------------+

+----------------+
| 80+            |
| Guru & Staff   |
+----------------+

+----------------+
| 50+            |
| Prestasi       |
+----------------+

+----------------+
| 30+            |
| Tahun          |
+----------------+
```

Angka harus dapat diubah melalui admin dashboard.

---

## 6.6 Berita Terbaru

Menampilkan 3–6 berita terbaru.

Card:

```text
[ IMAGE ]

BERITA
17 Agustus 2026

Judul Berita Sekolah

Deskripsi singkat...

Baca selengkapnya →
```

---

## 6.7 Prestasi

Section khusus untuk meningkatkan kredibilitas sekolah.

Contoh:

```text
🏆 Juara 1 Kompetisi Nasional
🥇 Olimpiade ...
🥈 Kompetisi ...
```

Dapat menggunakan carousel pada mobile.

---

## 6.8 Agenda

Menampilkan agenda terdekat:

```text
17
AUG

Upacara Kemerdekaan

08:00 - 10:00
Lapangan Sekolah
```

---

## 6.9 Galeri

Grid foto:

```text
┌────────┬────────┬────────┐
│        │        │        │
│ Foto 1 │ Foto 2 │ Foto 3 │
│        │        │        │
├────────┼────────┼────────┤
│ Foto 4 │ Foto 5 │ Foto 6 │
└────────┴────────┴────────┘
```

---

## 6.10 CTA Login

Section khusus:

> **Akses Portal Sekolah**

Deskripsi:

> Masuk ke portal untuk mengakses informasi dan layanan internal sekolah.

```text
[ Login Portal ]
```

---

## 6.11 Footer

Footer terdiri dari:

### School

* Logo
* Nama sekolah
* Deskripsi

### Navigation

* Tentang
* Akademik
* Berita
* Prestasi
* Galeri

### Contact

* Alamat
* Telepon
* Email
* Social media

### Bottom

```text
© 2026 SMA 68. All rights reserved.
```

---

# 7. Sistem Login

## Login Page

URL:

```text
/login
```

Design:

```text
┌─────────────────────────────────────────────┐
│                                             │
│       [ LOGO SEKOLAH ]                      │
│                                             │
│       Selamat Datang                        │
│       Masuk ke Portal Sekolah               │
│                                             │
│       Email / Username                      │
│       ┌───────────────────────────────┐     │
│       │                               │     │
│       └───────────────────────────────┘     │
│                                             │
│       Password                              │
│       ┌───────────────────────────────┐ 👁  │
│       │                               │     │
│       └───────────────────────────────┘     │
│                                             │
│       [ ✓ Ingat saya ]   Lupa password?     │
│                                             │
│       ┌───────────────────────────────┐     │
│       │           LOGIN               │     │
│       └───────────────────────────────┘     │
│                                             │
│       ← Kembali ke website                  │
└─────────────────────────────────────────────┘
```

---

# 8. Role & Permission

Sistem menggunakan Role-Based Access Control (RBAC).

## Role

```text
SUPER_ADMIN
ADMIN
GURU
STAFF
SISWA
```

### Permission Matrix

| Feature         | Super Admin | Admin | Guru | Staff | Siswa |
| --------------- | ----------: | ----: | ---: | ----: | ----: |
| Dashboard       |           ✓ |     ✓ |    ✓ |     ✓ |     ✓ |
| User Management |           ✓ |     ✓ |    - |     - |     - |
| Berita          |           ✓ |     ✓ |    - |     - |     - |
| Pengumuman      |           ✓ |     ✓ |    ✓ |     - |     - |
| Agenda          |           ✓ |     ✓ |    ✓ |     ✓ |     - |
| Galeri          |           ✓ |     ✓ |    - |     - |     - |
| Profil Sekolah  |           ✓ |     ✓ |    - |     - |     - |
| Data Akademik   |           ✓ |     ✓ |    ✓ |     - |     ✓ |
| System Settings |           ✓ |     - |    - |     - |     - |

Permission harus diterapkan **di backend**, bukan hanya menyembunyikan tombol pada frontend.

---

# 9. Dashboard User

Setelah login, user diarahkan ke:

```text
/dashboard
```

Dashboard menampilkan:

```text
Selamat datang, Budi 👋

┌───────────────┐
│ Pengumuman    │
│ 5 terbaru     │
└───────────────┘

┌───────────────┐
│ Agenda        │
│ 3 mendatang   │
└───────────────┘

┌───────────────┐
│ Jadwal        │
│ Hari ini      │
└───────────────┘
```

Sidebar:

```text
Dashboard
Profil
Pengumuman
Jadwal
Akademik
Kegiatan
Settings
Logout
```

Menu disesuaikan berdasarkan role.

---

# 10. Admin Dashboard

URL:

```text
/admin
```

Dashboard:

```text
Overview

┌──────────────┐ ┌──────────────┐
│ Total Siswa  │ │ Total Guru   │
│ 1.200        │ │ 80           │
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ Berita       │ │ Pengumuman   │
│ 128          │ │ 24           │
└──────────────┘ └──────────────┘
```

Sidebar:

```text
Dashboard

CONTENT
├── Berita
├── Pengumuman
├── Agenda
├── Prestasi
├── Galeri
└── Halaman

ACADEMIC
├── Mata Pelajaran
├── Jadwal
└── Data Akademik

USER
├── Siswa
├── Guru
├── Staff
└── Administrator

SYSTEM
├── Settings
├── Activity Log
└── Profile
```

---

# 11. CRUD Content Management

Admin harus dapat melakukan:

### Berita

* Create
* Read
* Update
* Delete
* Publish/unpublish
* Upload thumbnail
* Slug otomatis
* SEO title
* SEO description

### Pengumuman

* Create
* Update
* Delete
* Publish/unpublish
* Set tanggal publish
* Set tanggal expired

### Agenda

Field:

```text
Title
Description
Date
Start Time
End Time
Location
Cover Image
Status
```

### Prestasi

Field:

```text
Title
Category
Level
Year
Achievement
Student/Team
Image
Description
```

### Galeri

* Upload multiple image
* Album
* Caption
* Delete
* Sort

---

# 12. Arsitektur Teknologi

## Frontend

Menggunakan:

```text
React.js
Vite
TypeScript
React Router
TanStack Query
Tailwind CSS
```

Struktur:

```text
frontend/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── features/
│   │   ├── auth/
│   │   ├── news/
│   │   ├── announcements/
│   │   ├── agenda/
│   │   └── users/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── types/
│   └── routes/
├── public/
└── package.json
```

---

# 13. Backend

Menggunakan:

```text
Next.js
TypeScript
Next.js Route Handlers / API
Prisma ORM
SQLite (dev) → MySQL/PostgreSQL (production)
```

Struktur aktual:

```text
backend/
├── app/
│   └── api/
│       ├── auth/            (login, logout, refresh, me)
│       ├── users/           (list, create, get, update, delete)
│       ├── news/            (list, create, get, update, delete)
│       ├── announcements/   (list, create, get, update, delete)
│       ├── agenda/          (list, create, get, update, delete)
│       ├── achievements/    (list, create, get, update, delete)
│       ├── gallery/         (list, create, get, update, delete)
│       └── stats/           (ringkasan dashboard)
│
├── lib/
│   ├── auth.ts              (JWT sign/verify, bcrypt, refresh token)
│   ├── auth-guard.ts        (RBAC requireAuth / getOptionalUser)
│   ├── api.ts               (response helpers, pagination)
│   ├── cors.ts
│   ├── db.ts                (Prisma singleton)
│   └── utils.ts             (slugify)
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.cjs
│   └── dev.db
│
└── middleware.ts            (CORS + OPTIONS preflight)
```

---

# 14. API Design

Contoh endpoint:

```text
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/news
POST   /api/news
GET    /api/news/:id
PUT    /api/news/:id
DELETE /api/news/:id

GET    /api/announcements
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id

GET    /api/agenda
POST   /api/agenda
PUT    /api/agenda/:id
DELETE /api/agenda/:id

GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

Public endpoint dapat dibuka tanpa login.

Endpoint administratif harus membutuhkan authentication + authorization.

---

# 15. Authentication Flow

Flow yang direkomendasikan:

```text
User
  │
  ▼
React Login Page
  │
  │ POST credentials
  ▼
Next.js API
  │
  ├── Validate input
  ├── Find user
  ├── Verify password
  ├── Check account status
  └── Generate session/token
  │
  ▼
Authenticated Session
  │
  ▼
React Dashboard
```

Untuk keamanan:

* Password di-hash menggunakan Argon2id atau bcrypt.
* Jangan menyimpan password plaintext.
* Session/token disimpan menggunakan mekanisme yang aman.
* Gunakan HTTPS pada production.
* HttpOnly cookie untuk session berbasis cookie.
* CSRF protection sesuai mekanisme authentication.
* Rate limiting pada endpoint login.
* Account lockout/throttling setelah percobaan login berulang.
* Validasi input di backend.
* Authorization dilakukan di backend.

---

# 16. Database Schema

Entity utama:

```text
User
Role
StudentProfile
TeacherProfile
StaffProfile

News
Announcement
Agenda
Achievement
Gallery
GalleryImage

Subject
Schedule

SchoolProfile
SchoolSetting

ActivityLog
```

Relasi sederhana:

```text
User
 │
 ├── StudentProfile
 ├── TeacherProfile
 └── StaffProfile

News
 └── User (author)

Announcement
 └── User (author)

Agenda
 └── User (author)

Gallery
 └── GalleryImage
```

---

# 17. Contoh User Model

```text
User
--------------------
id
username
email
passwordHash
name
role
avatar
isActive
lastLoginAt
createdAt
updatedAt
```

Role:

```text
SUPER_ADMIN
ADMIN
GURU
STAFF
SISWA
```

---

# 18. Security Requirements

Security merupakan requirement wajib.

### Authentication

* Password hashing.
* Secure session.
* Logout.
* Session expiration.
* Optional "Remember Me".
* Forgot password.
* Reset password menggunakan token yang memiliki expiry.

### Authorization

Backend harus memeriksa:

```text
Is user authenticated?
        ↓
What is user's role?
        ↓
Does role have permission?
        ↓
Allow / Deny
```

### API Security

* Rate limiting
* Request validation
* Sanitization
* CORS configuration
* Secure headers
* Error handling
* Audit logging
* Tidak mengirim password/hash melalui API response.

### Admin Security

Tambahan:

* Admin route protection
* Activity log
* Session management
* Optional 2FA untuk administrator

---

# 19. SEO

Public website harus SEO-friendly.

Setiap halaman memiliki:

```text
title
description
canonical URL
Open Graph image
structured metadata
```

Contoh:

```text
SMA 68 — Sekolah Menengah Atas
```

URL yang SEO-friendly:

```text
/
 /tentang
 /akademik
 /berita
 /berita/judul-berita
 /prestasi
 /agenda
 /galeri
 /kontak
```

Tambahkan:

* Sitemap
* robots.txt
* Semantic HTML
* Image alt text
* Schema.org untuk informasi sekolah jika sesuai.

---

# 20. Responsive Design

Website wajib mendukung:

```text
Mobile
320px+
```

```text
Tablet
768px+
```

```text
Desktop
1024px+
```

```text
Large Desktop
1440px+
```

Prioritas:

**Mobile → Tablet → Desktop**

Mobile navigation menggunakan drawer/menu.

Table pada dashboard harus memiliki horizontal scroll atau mobile-specific layout.

---

# 21. Accessibility

Target minimal WCAG 2.1 AA.

Requirement:

* Keyboard navigation.
* Visible focus state.
* Proper contrast.
* Alt text.
* Semantic HTML.
* Label untuk form.
* Error message yang jelas.
* Tidak bergantung hanya pada warna.
* Accessible modal/dialog.
* Screen-reader friendly navigation.

---

# 22. Performance

Frontend harus menggunakan:

* Lazy loading.
* Code splitting.
* Image optimization.
* WebP/AVIF bila memungkinkan.
* Responsive images.
* Pagination.
* API caching.
* Debouncing untuk search.
* Skeleton loading.

Target:

```text
Initial Load < 3 sec
API Response < 500ms untuk request normal
Lighthouse Performance ≥ 85
```

---

# 23. Search

Website menyediakan global search.

User dapat mencari:

```text
Berita
Pengumuman
Prestasi
Agenda
```

Contoh:

```text
┌─────────────────────────────────────┐
│ 🔍 Cari informasi sekolah...       │
└─────────────────────────────────────┘
```

Hasil:

```text
Berita
├── Judul berita 1
├── Judul berita 2

Agenda
├── Agenda 1

Prestasi
├── Prestasi 1
```

---

# 24. Notification

Sistem dapat dikembangkan dengan notification center.

Contoh:

```text
🔔 3

Pengumuman baru
Jadwal diperbarui
Agenda sekolah besok
```

Untuk MVP, notification dapat berupa in-app notification.

Push notification dapat menjadi fase berikutnya.

---

# 25. CMS Workflow

Workflow berita:

```text
Draft
  ↓
Review
  ↓
Published
  ↓
Archived
```

Role:

```text
Author → membuat draft
Admin → review
Admin → publish
```

Untuk versi MVP, workflow dapat disederhanakan menjadi:

```text
Draft → Published
```

---

# 26. Error & Empty State

Setiap halaman harus memiliki state:

### Loading

```text
Skeleton Loader
```

### Empty

```text
Belum ada berita yang tersedia.
```

### Error

```text
Terjadi kesalahan saat mengambil data.

[ Coba Lagi ]
```

### 404

```text
Halaman tidak ditemukan.

[ Kembali ke Beranda ]
```

---

# 27. Admin Content Editor

Editor berita menggunakan rich text editor dengan kemampuan:

* Heading
* Bold
* Italic
* Link
* List
* Image
* Quote
* Alignment

Admin dapat melihat preview sebelum publish.

```text
[ Simpan Draft ] [ Preview ] [ Publish ]
```

---

# 28. File & Media Management

Sistem media digunakan untuk:

* Foto berita
* Foto prestasi
* Foto kegiatan
* Logo
* Foto kepala sekolah
* Galeri

Requirement:

* File type validation
* File size validation
* Automatic image compression
* Unique filename
* Secure upload
* Delete unused files

Penyimpanan dapat menggunakan object storage seperti S3-compatible storage.

---

# 29. Analytics

Admin dapat melihat:

```text
Page Views
Popular News
Popular Pages
Traffic
```

Analytics dapat menggunakan layanan pihak ketiga atau self-hosted analytics sesuai kebijakan sekolah.

---

# 30. Non-Functional Requirements

| Requirement       | Target    |
| ----------------- | --------- |
| Availability      | ≥ 99.5%   |
| Mobile Responsive | ✓         |
| Accessibility     | WCAG AA   |
| SEO               | Optimized |
| API Security      | Required  |
| Authentication    | Required  |
| RBAC              | Required  |
| Backup            | Daily     |
| Logging           | Required  |
| HTTPS             | Required  |
| Database Backup   | Required  |

---

# 31. MVP Scope

## Phase 1 — Public Website

* [x] Homepage (Vite frontend)
* [x] Profil sekolah
* [x] Visi & misi
* [x] Berita (API + UI, ditampilkan dari database)
* [x] Pengumuman (API ready)
* [x] Agenda (API + UI, ditampilkan dari database)
* [x] Prestasi (API ready)
* [x] Galeri (API ready)
* [x] Kontak
* [x] Responsive design
* [ ] SEO basic (frontend metadata, menyusul)

## Phase 2 — Authentication

* [x] Login
* [x] Logout
* [x] Session management (JWT access + refresh)
* [x] Role-based access (backend RBAC + frontend guards)
* [ ] User profile (portal UI, menyusul)
* [ ] Forgot password (menyusul)
* [x] Protected routes (RequireAuth / RequireRole)

## Phase 3 — Admin

* [x] API admin dashboard (stats)
* [x] CRUD berita (API + UI)
* [x] CRUD pengumuman (API + UI)
* [x] CRUD agenda (API + UI)
* [x] CRUD prestasi (API + UI)
* [x] CRUD galeri (API + UI)
* [x] User management (API + UI)
* [ ] Activity log (model siap, endpoint + UI menyusul)
* [x] Admin dashboard UI

## Phase 4 — Academic Portal

* [ ] Jadwal (model menyusul)
* [ ] Mata pelajaran (model menyusul)
* [ ] Data siswa (StudentProfile siap)
* [ ] Data guru (TeacherProfile siap)
* [ ] Informasi akademik
* [ ] Dashboard siswa (UI, menyusul)
* [ ] Dashboard guru (UI, menyusul)

---

# 32. Future Development

Fitur yang dapat ditambahkan setelah MVP:

### PPDB

```text
Registrasi calon siswa
↓
Upload dokumen
↓
Verifikasi
↓
Seleksi
↓
Pengumuman
```

### E-Learning

* Materi
* Assignment
* Quiz
* Submission
* Grade

### Parent Portal

Orang tua dapat melihat:

* Kehadiran
* Nilai
* Jadwal
* Pengumuman
* Prestasi

### Digital Administration

* Surat online
* Disposisi
* Approval
* Arsip digital

### Mobile Application

Tahap lanjutan dapat dibuat menggunakan:

```text
React Native / Expo
```

dengan backend API yang sama.

---

# 33. Project Architecture

Struktur deployment yang direkomendasikan:

```text
                    INTERNET
                       │
                       ▼
              ┌─────────────────┐
              │   CDN / Proxy   │
              └────────┬────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
 ┌─────────────────┐       ┌─────────────────┐
 │ React Frontend  │       │ Next.js Backend │
 │                 │──────▶│      API        │
 └─────────────────┘       └────────┬────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                  ┌─────────────┐      ┌──────────────┐
                  │ PostgreSQL  │      │ Object       │
                  │             │      │ Storage      │
                  └─────────────┘      └──────────────┘
```

Repository dapat menggunakan monorepo:

```text
sma68-web/
│
├── apps/
│   ├── frontend/
│   └── backend/
│
├── packages/
│   ├── types/
│   ├── ui/
│   └── config/
│
├── docs/
│
└── package.json
```

---

# 34. Recommended Frontend Pages

```text
/
/tentang
/tentang/profil
/tentang/sejarah
/tentang/visi-misi

/akademik
/akademik/program
/akademik/jadwal

/berita
/berita/:slug

/pengumuman
/pengumuman/:slug

/agenda
/agenda/:slug

/prestasi
/prestasi/:slug

/ekstrakurikuler
/galeri
/kontak

/login
/forgot-password

/dashboard
/dashboard/profile
/dashboard/pengumuman
/dashboard/jadwal

/admin
/admin/news
/admin/announcements
/admin/agenda
/admin/achievements
/admin/gallery
/admin/users
/admin/settings
```

---

# 35. User Experience Principle

Website harus mengikuti prinsip:

### 1. Information First

Pengunjung langsung menemukan informasi penting.

### 2. Clear CTA

Tombol utama harus jelas dan tidak terlalu banyak.

### 3. Consistent

Button, card, typography, spacing, dan icon memiliki sistem desain yang konsisten.

### 4. Professional

Hindari:

* Animasi berlebihan
* Gradient terlalu mencolok
* Terlalu banyak warna
* Font dekoratif
* UI yang terlalu ramai

### 5. Trust

Tampilkan:

* Identitas sekolah
* Prestasi
* Kegiatan
* Informasi resmi
* Kontak
* Struktur sekolah

sebagai elemen utama untuk membangun kredibilitas.

---

# 36. Acceptance Criteria

Website dianggap memenuhi MVP apabila:

### Public

* Semua halaman utama dapat diakses.
* Website responsive.
* Berita dapat ditampilkan dari API.
* Agenda dapat ditampilkan.
* Prestasi dapat ditampilkan.
* Galeri dapat ditampilkan.
* SEO metadata tersedia.

### Authentication

* User dapat login.
* Password tidak disimpan plaintext.
* User yang belum login tidak dapat mengakses dashboard.
* Role menentukan akses.
* User dapat logout.
* Session dapat expired.
* Endpoint sensitif tidak dapat diakses tanpa authorization.

### Admin

* Admin dapat membuat berita.
* Admin dapat mengedit berita.
* Admin dapat menghapus berita.
* Admin dapat publish/unpublish berita.
* Admin dapat mengelola pengumuman.
* Admin dapat mengelola agenda.
* Admin dapat mengelola galeri.
* Admin dapat mengelola user sesuai permission.

### Security

* HTTPS production.
* Input validation.
* Rate limiting login.
* Secure cookies/session.
* RBAC backend.
* Audit log untuk aktivitas penting.

---

# 37. Definition of Done

Sebuah fitur dianggap selesai apabila:

1. UI telah responsive.
2. API telah terintegrasi.
3. Loading state tersedia.
4. Error state tersedia.
5. Empty state tersedia.
6. Validasi frontend tersedia.
7. Validasi backend tersedia.
8. Authorization telah diterapkan.
9. Tidak ada critical console error.
10. Telah melalui testing.
11. Tidak terdapat data sensitif di response API.
12. Dokumentasi API diperbarui.

---

# 38. Prioritas Pengembangan

Prioritas:

```text
P0 — Critical
Authentication
RBAC
Homepage
CMS
Admin Dashboard
Database
Security

P1 — High
Berita
Pengumuman
Agenda
Prestasi
Galeri
User Management
SEO

P2 — Medium
Search
Notification
Analytics
Academic Portal

P3 — Future
PPDB
Parent Portal
E-Learning
Mobile App
Digital Administration
```

---

# 39. Final Product Vision

Website SMA 68 diharapkan tidak hanya menjadi **website profil sekolah**, tetapi menjadi **digital school portal** yang menggabungkan:

```text
             SMA 68 DIGITAL PLATFORM
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    PUBLIC          PORTAL          ADMIN
   WEBSITE          USER            CMS
        │              │              │
        ▼              ▼              ▼
   Informasi       Siswa/Guru      Content
   Berita          Dashboard       Management
   Prestasi        Akademik        User
   Agenda          Jadwal          Settings
   Galeri          Pengumuman      Analytics
```

Dengan pendekatan **React.js sebagai frontend** dan **Next.js sebagai backend/API**, sistem dapat dibuat modular, scalable, dan mudah dikembangkan menjadi platform digital sekolah yang lebih lengkap di tahap berikutnya.
