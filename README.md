# BANDAR LAYAN — Smart Public Service Kota Bandar Lampung
> **Platform Pelayanan Publik Digital Terpadu untuk Masyarakat dan Pemerintah Kota Bandar Lampung**  
> Tugas Praktikum & Ujian Tengah Semester (UTS) — Perancangan & Pengembangan Sistem Informasi (PPSI)  
> Mahasiswa: **Aisyah Nafilah (NPM: 24311064)** — Program Studi Sistem Informasi, Universitas Teknokrat Indonesia

---

## 1. Ringkasan Eksekutif & Identitas Produk

**BANDAR LAYAN** adalah aplikasi web pelayanan publik terpadu yang dibangun berdasarkan spesifikasi teknis `PRD_BANDAR_LAYAN_Gabungan.md` dan pedoman desain antarmuka `bandar-layan-design-skill.md`. 

Aplikasi ini menyatukan alur pelayanan publik dari hulu ke hilir:
1. **Warga Masyarakat:** Menemukan layanan, membaca persyaratan, mengisi formulir online, mengunggah dokumen persyaratan, melacak status berkas secara berkala, mengunggah revisi jika diminta, mengunduh E-Dokumen resmi berstempel digital, serta menyampaikan aspirasi dan pengaduan kota.
2. **Petugas Pelayanan (Verifikator OPD):** Memeriksa antrean permohonan, menjalankan checklist validasi keabsahan dokumen, menambahkan catatan internal, meminta perbaikan berkas, menolak dengan dasar hukum/alasan jelas, serta menerbitkan surat tanda terima / rekomendasi izin.
3. **Administrator Smart City:** Memantau agregat operasional, memantau tingkat kepuasan warga (IKM), mengelola katalog master layanan, mengelola hak akses akun (RBAC), dan memeriksa jejak audit sistem (*audit trail*).

---

## 2. Kepatuhan Penuh Terhadap Design System (`bandar-layan-design-skill.md`)

- **Palet Warna Resmi:**
  - `primary`: `#002548` (Navy Pemerintahan)
  - `primary-container`: `#123B66`
  - `secondary`: `#0051D5` (Biru Aksi Utama & Link Aktif)
  - `tertiary-fixed`: `#71F8E4` (Aksen Teal Keberhasilan)
  - `background`: `#F8F9FF` (Latar Bersih Institusional)
  - `surface-container-lowest`: `#FFFFFF` (Permukaan Kartu & Panel)
  - `surface-container-low`: `#EFF4FF`
  - `error`: `#BA1A1A` & `error-container`: `#FFDAD6` (Status Penolakan & Kesalahan)
- **Tipografi:** Google Font **Inter** untuk teks antarmuka dan **Monospace** untuk Nomor Registrasi (`REG-2026-BDL-XXXXX`), Kode Tiket (`TKT-2026-XXXX`), dan NIK Warga.
- **Ikonografi:** **Material Symbols Outlined** (Google Fonts) di seluruh komponen.
- **Radius & Shadow:** Sudut `rounded-xl` (12px) dan `rounded-lg` (8px), bayangan halus `shadow-subtle` dan `shadow-card`, header fixed 64px dengan `backdrop-blur`.
- **Privasi & Keamanan Data (UU PDP No. 27/2022):** NIK dan nomor kontak disamarkan secara otomatis (*masking*, contoh: `187102******0001`) pada tampilan masyarakat dan riwayat publik.

---

## 3. Teknologi yang Digunakan

- **Frontend Core:** React 19, JavaScript ES Module, Tailwind CSS v3.4, PostCSS, Autoprefixer.
- **Build Tool:** Vite 5.4 (Konfigurasi cepat, zero-error production bundle).
- **Icons & Visuals:** Material Symbols Outlined, Lucide React, SVG Seals & QR Codes.
- **State & Storage Engine:** Client-side persistent storage dengan validasi *state machine* transisi status permohonan (PRD Section 7.2), simulasi delay API realistis, dan isolasi data per akun/role.

---

## 4. Akun Demo untuk Pengujian Cepat (1-Klik Role Switcher)

Aplikasi dilengkapi tombol **Ganti Peran (Role Switcher)** di bagian kanan atas *header* untuk mempermudah evaluasi dosen dan penguji tanpa perlu menghapus sesi manual:

| Peran (Role) | Nama Pengguna | Email | Kata Sandi Demo | Hak Akses Utama |
|---|---|---|---|---|
| **Masyarakat** | Aisyah Nafilah | `aisyah.nafilah@warga.bandarlampung.go.id` | `warga123` | Mengajukan layanan, unggah berkas, lacak permohonan, perbaiki dokumen, unduh e-dokumen, KTP Digital (IKD), buat pengaduan. |
| **Petugas Verifikator** | Hendra Pratama, S.STP | `hendra.petugas@bandarlampung.go.id` | `petugas123` | Memeriksa antrean Disdukcapil/DPMPTSP, checklist berkas, catatan internal, loloskan/revisi/tolak/terbitkan dokumen. |
| **Administrator** | Ir. Bambang Wicaksono, M.T. | `admin@bandarlampung.go.id` | `admin123` | Monitoring analitik sistem, manajemen akun pengguna, CRUD katalog layanan, penelusuran audit log sistem. |

---

## 5. Fitur & Modul Lengkap yang Telah Berfungsi

### A. Portal Masyarakat (`/portal`)
- Kartu Profil Warga Terverifikasi dengan Nama, NIK termasking, dan tombol **Lihat KTP Digital (IKD)**.
- Banner Pengumuman Resmi Pemerintah Kota Bandar Lampung.
- 4 Akses Cepat: Katalog Layanan, Lacak Dokumen, Pengaduan Warga, Identitas Digital.
- 4 Kartu Metrik Status Permohonan Warga (Menunggu, Diproses, Revisi, Selesai).
- Tabel Riwayat Permohonan Terkini (Desktop) yang otomatis berubah menjadi Kartu Responsif pada Tablet/Smartphone.
- Panel Samping: Informasi Mal Pelayanan Publik (MPP) Kota Bandar Lampung dan Indeks Kepuasan Masyarakat (IKM 4.8/5.0).
- Katalog 6 Layanan Publik Unggulan dengan pencarian instan dan filter kategori.

### B. Formulir Pelayanan Online (`/form`)
- Breadcrumbs navigasi.
- Header layanan dengan informasi OPD, SLA, Biaya (Gratis Rp 0), dan persyaratan dokumen.
- Bagian 1: Data Identitas Pemohon (terkunci dan terisi otomatis dari profil).
- Bagian 2: Data Rincian Spesifik Layanan dengan validasi *inline* interaktif.
- Bagian 3: Komponen Dropzone Upload Dokumen (validasi format PDF/JPG/PNG dan ukuran maksimal 5 MB).
- Bagian 4: Pernyataan keabsahan data (*legal consent checkbox*).
- Dialog konfirmasi sebelum pengiriman.
- Penerbitan otomatis Nomor Registrasi Unik berformat `REG-2026-BDL-XXXXX`.

### C. Pelacakan Permohonan & E-Dokumen (`/tracking`)
- Pencarian berdasarkan nomor registrasi atau tombol pilih cepat dari daftar pengajuan.
- Visualisasi tahapan proses (*Stepper Progress*): Permohonan Dikirim → Verifikasi Berkas → Pemrosesan Teknis → Selesai Diterbitkan.
- Banner Peringatan Perbaikan jika berkas berstatus `needs_revision` beserta tombol **Unggah Ulang Berkas Revisi**. Pengunggahan ulang otomatis mengembalikan status ke `under_review`.
- Tombol **Unduh E-Dokumen** jika permohonan berstatus `completed`.
- Widget Penilaian & Ulasan Kepuasan Masyarakat (1-5 bintang + komentar).
- Rekam Jejak Riwayat & Audit Trail penanganan berkas (waktu, aktor, dan catatan publik petugas).

### D. E-Dokumen & Bukti Pengambilan Digital
- Modal Surat Keterangan / Tanda Bukti Pelayanan Resmi berstempel elektronik (*digital seal*).
- Dilengkapi lambang resmi, rincian data pemohon yang tersertifikasi, dan kode QR verifikasi keabsahan.
- Tombol Cetak / Simpan PDF (*print-ready*).

### E. Pengaduan & Aspirasi Warga (`/complaints`)
- Formulir pengaduan dengan kategori sarana publik (Infrastruktur, Kebersihan, Pungli, dll.).
- Penghitung karakter uraian kronologi masalah (minimal 20, maksimal 1000 karakter).
- Upload foto bukti kondisi lapangan.
- Opsi pelaporan anonim untuk perlindungan privasi pelapor.
- Penerbitan Nomor Tiket Pengaduan `TKT-2026-XXXX`.
- Tab pemantauan status tindak lanjut petugas OPD.

### F. Dashboard Petugas Pelayanan (`/officer`)
- Meja kerja verifikator dengan identitas NIP dan Unit OPD.
- Kartu ringkasan beban kerja: Perlu Diperiksa, Sedang Diproses, Perlu Revisi, Selesai.
- Tab filter status cepat (Semua, Verifikasi, Diproses, Revisi, Selesai, Ditolak).
- Pencarian antrean berdasarkan nama pemohon atau nomor registrasi.
- Panel Periksa Berkas (*Split-View*):
  - Rincian identitas dan data formulir pemohon.
  - Pratinjau berkas lampiran warga.
  - Checklist interaktif verifikasi keabsahan berkas (Valid, Perlu Ditinjau, Tidak Sesuai).
  - Catatan internal petugas yang terisolasi aman dari tampilan pemohon.
  - Tombol keputusan dengan diferensiasi warna & risiko (Verifikasi Lolos, Minta Revisi Berkas, Tolak Permohonan, Terbitkan Dokumen).

### G. Dashboard Administrator (`/admin`)
- Ringkasan statistik performa pelayanan dan kepatuhan SLA.
- Grafik sebaran status operasional seluruh permohonan warga.
- Manajemen Pengguna & Hak Akses (RBAC).
- Manajemen Master Katalog Layanan Publik (Tambah layanan baru, aktifkan/nonaktifkan layanan, perbarui SLA).
- Audit Log Sistem (*Audit Trail*) yang merekam seluruh aksi sensitif pengguna dan petugas secara kronologis.

---

## 6. Cara Menjalankan Aplikasi

Pastikan Node.js (v18 ke atas) telah terpasang di komputer Anda.

### Menjalankan Development Server:
```bash
npm run dev
```
Buka browser pada alamat: `http://localhost:3000` (atau port yang ditampilkan terminal).

### Membangun Paket Produksi:
```bash
npm run build
```

### Menjalankan Pratinjau Hasil Produksi:
```bash
npm run preview
```

---

## 7. Struktur Direktori Proyek

```
UTS_Aisyah Nafilah_24311064/
├── dist/                               # Production build bundle
├── public/
│   └── favicon.svg                     # Logo resmi Bandar Layan
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx               # Status chip token design skill
│   │   │   ├── Button.jsx              # Komponen tombol multi-varian & loading
│   │   │   ├── EDocumentModal.jsx      # Modal sertifikat & tanda terima resmi
│   │   │   ├── FileUpload.jsx          # Dropzone berkas & validasi 5MB
│   │   │   ├── Icon.jsx                # Material Symbols Outlined renderer
│   │   │   ├── Modal.jsx               # Dialog modal aksesibel
│   │   │   ├── Stepper.jsx             # Visualisasi progres alur dokumen
│   │   │   └── Toast.jsx               # Feedback notifikasi interaksi
│   │   └── layout/
│   │       ├── Header.jsx              # Fixed header, navigasi & role switcher
│   │       └── Footer.jsx              # Footer resmi & institusional
│   ├── data/
│   │   └── initialData.js              # Master seed services, users, requests, complaints
│   ├── pages/
│   │   ├── AdminDashboard.jsx          # Kontrol administrator & audit log
│   │   ├── AuthModal.jsx               # Otentikasi & demo quick login
│   │   ├── CitizenPortal.jsx           # Beranda & portal masyarakat
│   │   ├── Complaints.jsx              # Kanal pengaduan & aspirasi warga
│   │   ├── DigitalIdModal.jsx          # KTP Digital / IKD kependudukan
│   │   ├── OfficerDashboard.jsx        # Meja kerja verifikator berkas
│   │   ├── ServiceForm.jsx             # Formulir pengajuan permohonan online
│   │   └── Tracking.jsx                # Pelacakan permohonan & revisi berkas
│   ├── services/
│   │   └── storage.js                  # Engine penyimpanan, state machine, RBAC & masking
│   ├── App.jsx                         # Root application state & router
│   ├── index.css                       # Tailwind layers & typography styling
│   └── main.jsx                        # Entry point React
├── index.html                          # HTML template dengan Inter font & Material Symbols
├── package.json                        # Dependensi proyek
├── postcss.config.js                   # Konfigurasi PostCSS
├── tailwind.config.js                  # Konfigurasi token warna & spacing resmi
├── vite.config.js                      # Konfigurasi Vite bundler
├── bandar-layan-design-skill.md        # Pedoman desain UI/UX single source of truth
├── PRD_BANDAR_LAYAN_Gabungan.md        # Dokumen PRD acuan fungsional
└── README.md                           # Dokumentasi teknis proyek
```

