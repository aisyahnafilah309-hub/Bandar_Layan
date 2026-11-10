---
description: Skill panduan desain UI/UX untuk membangun dan
  mengembangkan antarmuka BANDAR LAYAN, platform layanan publik digital
  Kota Bandar Lampung. Gunakan saat membuat halaman warga, formulir
  layanan, tracking, pengaduan, dashboard petugas, dashboard
  administrator, autentikasi, atau komponen terkait.
name: bandar-layan-design-skill
---

# BANDAR LAYAN --- Design Skill

## 1. Tujuan dan identitas desain

Bangun antarmuka layanan publik digital yang terasa **resmi, tepercaya,
modern, bersih, mudah dipahami, dan efisien**. Desain harus mendukung
dua kelompok penggunaan utama:

1.  **Masyarakat:** menemukan layanan, mengajukan permohonan, mengunggah
    dokumen, melacak status, mengirim pengaduan, dan memberi penilaian.
2.  **Petugas dan administrator:** mengelola antrean, memeriksa berkas,
    memvalidasi persyaratan, meminta revisi, menolak dengan alasan,
    menerbitkan dokumen, serta memantau operasional.

Pertahankan karakter visual BANDAR LAYAN: dominasi biru pemerintahan,
latar biru sangat muda, permukaan putih, aksen teal untuk
keberhasilan/layanan, tipografi Inter, ikon Material Symbols, kartu
sederhana, dan hierarki informasi yang jelas.

Jangan mengubah desain menjadi gaya startup yang terlalu dekoratif,
neon, penuh gradien, atau penuh animasi. Kesan institusional dan
keterbacaan lebih penting daripada ornamen.

## 2. Prinsip desain wajib

-   **Citizen-first:** bahasa sederhana, tindakan utama mudah ditemukan,
    status permohonan mudah dipahami.
-   **Trust by design:** tampilkan identitas instansi, unit OPD, status
    verifikasi, waktu pembaruan, dan informasi keamanan secara jelas
    ketika relevan.
-   **Data-dense, not cluttered:** dashboard boleh memuat banyak data,
    tetapi kelompokkan melalui section, kartu, tabel, label, dan ruang
    kosong.
-   **Consistent components:** gunakan token warna, radius, spacing,
    tipografi, tombol, badge, dan pola modal yang sama lintas halaman.
-   **Responsive by default:** desain desktop, tablet, dan ponsel;
    jangan hanya mengecilkan layout desktop.
-   **Accessible:** kontras teks memadai, label form jelas, status tidak
    hanya dibedakan dengan warna, fokus keyboard terlihat, dan kontrol
    mudah disentuh.
-   **Functional UI:** setiap tombol, tab, filter, upload, modal, dan
    tautan harus memiliki perilaku nyata atau ditandai sebagai
    placeholder yang belum terhubung.
-   **Privacy-aware:** data sensitif seperti NIK, alamat, dan dokumen
    pribadi tidak boleh ditampilkan berlebihan. Gunakan masking pada
    tampilan yang tidak memerlukan nilai lengkap.

## 3. Design tokens

### 3.1 Warna inti

Gunakan palet berikut sebagai sumber utama. Nama token mengikuti sistem
Tailwind pada kode sumber.

  -----------------------------------------------------------------------------
  Token                         Hex                     Penggunaan
  ----------------------------- ----------------------- -----------------------
  `primary`                     `#002548`               Biru navy utama, judul,
                                                        teks/area tombol utama

  `primary-container`           `#123B66`               Container biru gelap,
                                                        ikon di atas latar biru

  `on-primary`                  `#FFFFFF`               Teks dan ikon di atas
                                                        primary

  `on-primary-container`        `#83A6D7`               Konten sekunder pada
                                                        primary container

  `secondary`                   `#0051D5`               Aksi utama, link aktif,
                                                        fokus, progres

  `secondary-container`         `#316BF3`               Variasi biru sekunder

  `on-secondary`                `#FFFFFF`               Teks di atas secondary

  `tertiary`                    `#002A25`               Aksen teal gelap

  `tertiary-container`          `#00423B`               Latar status/komponen
                                                        teal

  `tertiary-fixed`              `#71F8E4`               Aksen keberhasilan
                                                        lembut

  `tertiary-fixed-dim`          `#4FDBC8`               Aksen teal redup;
                                                        rapikan menjadi
                                                        `#4FDBC8` hanya jika
                                                        sumber warna dikoreksi

  `background`                  `#F8F9FF`               Latar halaman

  `surface`                     `#F8F9FF`               Permukaan dasar

  `surface-container-lowest`    `#FFFFFF`               Kartu dan panel utama

  `surface-container-low`       `#EFF4FF`               Latar lembut untuk
                                                        section/form

  `surface-container`           `#E5EEFF`               Latar komponen sekunder

  `surface-container-high`      `#DCE9FF`               Hover/penekanan ringan

  `surface-container-highest`   `#D3E4FE`               Progress track atau
                                                        latar yang lebih kuat

  `on-surface`                  `#0B1C30`               Teks utama

  `on-surface-variant`          `#43474F`               Teks penjelas

  `outline`                     `#737780`               Teks sekunder, ikon
                                                        nonaktif

  `outline-variant`             `#C3C6D0`               Border halus

  `error`                       `#BA1A1A`               Kesalahan dan penolakan

  `error-container`             `#FFDAD6`               Latar kesalahan
  -----------------------------------------------------------------------------

**Catatan kualitas token:** pada kode sumber, nilai `tertiary-fixed-dim`
tercetak sebagai `#4fdbc8`. Gunakan nilai valid `#4FDBC8` tanpa spasi,
yaitu `#4FDBC8` perlu dinormalisasi menjadi `#4FDBC8`? Untuk
implementasi CSS gunakan `#4FDBC8` hanya setelah menghapus spasi:
`#4FDBC8`. Jangan menyalin string hex yang mengandung spasi.

Warna status tambahan yang terlihat pada komponen verifikasi: - Hijau
valid: latar `emerald-50`, teks `emerald-800`, ikon `emerald-600`. -
Amber menunggu/review: latar `amber-100`, teks `amber-900`, ikon
`amber-700`. - Merah: gunakan token `error` dan `error-container`. -
Biru proses: gunakan `secondary` atau `secondary-container`.

Jangan menggunakan warna status hanya sebagai dekorasi. Selalu sertakan
teks status, ikon, atau keduanya.

### 3.2 Tipografi

-   Font utama: **Inter** (Google Fonts), gunakan seluruh aplikasi.
-   Font mono: gunakan `font-mono` untuk nomor registrasi, kode tiket,
    NIK yang dimasking, dan data teknis.
-   Judul utama desktop: 40px / 48px, weight 700, letter-spacing
    -0.02em.
-   Judul halaman besar: 32px / 40px, weight 700, letter-spacing
    -0.02em.
-   Judul medium: 24px / 32px, weight 600.
-   Judul section: 20px / 28px, weight 600.
-   Judul kartu: 18px / 26px atau 16px / 24px, weight 600.
-   Body besar: 16px / 24px, weight 400.
-   Body standar: 14px / 20px, weight 400.
-   Body kecil: 12px / 16px, weight 400.
-   Label kecil: 11px / 14px, weight 500.
-   Label medium: 12px / 16px, weight 500.
-   Label besar: 14px / 20px, weight 500.

Gunakan skala teks secara konsisten. Hindari teks isi 10--11px untuk
informasi penting. Pada mobile, judul hero dapat turun ke 30px / 36px
dan judul halaman ke 24px / 32px.

### 3.3 Radius, spacing, dan elevasi

Radius: - `rounded-lg`: 8px. - `rounded-xl`: 12px. - `rounded-full`:
pill/badge/avatar. - Gunakan radius 8--12px untuk sebagian besar kartu,
input, tombol, dan modal. - Hindari radius ekstrem pada semua elemen;
bentuk harus tetap profesional.

Spacing token: - `space-xs`: 4px. - `space-sm`: 8px. - `space-md`:
16px. - `space-lg`: 24px. - `space-xl`: 32px. - `gutter`: 24px
desktop. - `gutter-mobile`: 16px mobile. - `margin`: 32px;
`margin-mobile`: 16px.

Elevasi: - Kartu: shadow sangat halus (`shadow-sm`). - Hover kartu:
`shadow-md` secara selektif. - Header fixed: bayangan tipis dan backdrop
blur. - Modal: shadow kuat tetapi tidak berlebihan. - Border gunakan
`outline-variant` dengan opacity rendah.

## 4. Ikon dan elemen visual

-   Gunakan **Material Symbols Outlined** sebagai sistem ikon utama.
-   Ikon harus relevan dan mudah dikenali: `home`, `person`, `badge`,
    `description`, `receipt_long`, `storefront`, `campaign`,
    `notifications_active`, `schedule`, `verified`, `fact_check`,
    `cloud_upload`, `timeline`, `download`, `search`, `location_on`,
    `rate_review`, `report_problem`.
-   Ukuran ikon umum: 16--20px untuk inline, 20--24px untuk aksi/kartu,
    28--32px untuk ikon fitur.
-   Ikon fitur dapat ditempatkan pada kotak 40--48px dengan latar
    `surface-container`, `surface-container-low`, atau warna status yang
    relevan.
-   Logo BANDAR LAYAN harus proporsional, tidak diregangkan, dan
    memiliki alt text.
-   Gunakan ilustrasi atau foto hanya bila memberi informasi. Jangan
    mengisi dashboard dengan gambar stok dekoratif yang tidak membantu
    tugas.

## 5. Pola layout global

### Header

-   Tinggi desktop sekitar 64px (`h-16`).
-   Fixed di bagian atas.
-   Latar putih semi-transparan, `backdrop-blur`, shadow tipis.
-   Area kiri: logo dan identitas BANDAR LAYAN.
-   Area tengah: navigasi utama pada desktop.
-   Area kanan: akses petugas atau tindakan utama, notifikasi/profil.
-   Pada tablet/mobile, ringkas navigasi menjadi menu mobile yang jelas;
    jangan sekadar menyembunyikan semua navigasi.
-   Beri padding horizontal 24px desktop dan 16px mobile.

### Container halaman

-   Lebar maksimum sekitar `max-w-7xl` (80rem).
-   Konten berada di tengah dengan gutter konsisten.
-   Halaman dashboard menggunakan section vertikal dengan jarak
    24--32px.
-   Latar utama `background`; panel/kartu `surface-container-lowest`.
-   Breadcrumb ditampilkan pada halaman detail/form, bukan wajib pada
    dashboard utama.
-   Header fixed harus diimbangi dengan padding top konten sekitar 64px.

### Footer

-   Latar putih, bayangan atas sangat ringan.
-   Identitas BANDAR LAYAN dan deskripsi singkat di kiri.
-   Informasi hak cipta di kanan pada desktop, ditumpuk dan rata tengah
    pada mobile.
-   Jangan menambahkan link/footer yang tidak tersedia atau tidak
    relevan.

## 6. Pola halaman berdasarkan peran

### 6.1 Portal masyarakat / dashboard warga

Urutan konten yang disarankan: 1. Header global. 2. Welcome/profile card
dengan nama, status verifikasi, wilayah, dan tindakan identitas digital.
3. Banner pengumuman pemerintah. 4. Quick actions: Ajukan Permohonan,
Lacak Dokumen, Pengaduan Warga, Identitas Digital. 5. Kartu metrik
status permohonan: menunggu, diproses, selesai, revisi/ditolak. 6. Area
utama dua kolom: riwayat permohonan dan panel pendamping. 7. Katalog
layanan unggulan. 8. Panel survei kepuasan, lokasi pelayanan, dan
informasi institusi. 9. Footer.

Layout desktop dapat memakai grid 12 kolom: panel utama 8 kolom, sidebar
4 kolom. Pada mobile, semua panel menjadi satu kolom.

Kartu metrik: - Label kecil di atas. - Ikon dalam wadah kecil di sisi
kanan. - Angka utama besar. - Badge status ringkas. - Keterangan
tambahan seperti estimasi waktu. - Jangan memakai warna yang sama untuk
semua status.

Riwayat permohonan: - Tabel desktop dengan nomor registrasi, jenis
layanan, tanggal, OPD, status, dan aksi. - Pada mobile ubah menjadi
list/card per permohonan, bukan tabel yang terpotong. - Nomor registrasi
memakai monospace. - Status tampil sebagai badge dengan teks. - Aksi
seperti Timeline atau E-Dokumen harus jelas.

Katalog layanan: - Grid dua kolom pada layar menengah ke atas; satu
kolom pada mobile. - Tiap kartu memuat ikon, nama layanan, deskripsi
singkat, tag OPD/fitur/SLA, biaya atau estimasi, dan tombol tindakan. -
Gunakan panjang deskripsi yang konsisten dan ringkas.

### 6.2 Form pengajuan layanan

Struktur: 1. Breadcrumb. 2. Header layanan: nama, deskripsi, OPD, badge
verifikasi/paket layanan. 3. Informasi SLA, biaya, dan keamanan. 4.
Petunjuk persyaratan. 5. Form bertahap atau section terkelompok. 6.
Upload dokumen. 7. Pernyataan/consent yang relevan. 8. Ringkasan
pengajuan dan tombol simpan draft/kirim. 9. Modal atau notifikasi hasil.

Aturan form: - Label berada di atas input. - Tanda wajib menggunakan
teks/indikator yang terlihat; jangan hanya warna. - Tampilkan format dan
batas ukuran file di dekat area upload. - Pisahkan bantuan penjelasan
dari placeholder. - Validasi inline di dekat field yang bermasalah. -
Tampilkan ringkasan error jika banyak field tidak valid. - Berikan
state: default, focus, filled, error, disabled, success. - Tombol utama
jelas: "Kirim Permohonan" atau "Ajukan". - Tombol sekunder: "Simpan
Draft" dan "Kembali". - Jangan mengosongkan input ketika validasi
gagal. - Berikan konfirmasi sebelum tindakan berisiko atau final.

### 6.3 Upload dokumen

Komponen upload: - Dropzone dengan latar `surface-container-low`, radius
12px, ikon upload. - Instruksi "Seret & Lepaskan berkas atau klik untuk
jelajah". - Cantumkan jenis file dan ukuran maksimum. - Setelah file
dipilih, tampilkan kartu file: ikon tipe file, nama, ukuran, status
upload/validasi, dan tombol hapus. - Untuk dokumen wajib, tampilkan
badge "Wajib". - Untuk dokumen opsional, tampilkan badge "Opsional". -
Tampilkan progress upload jika proses berlangsung. - Tampilkan error
format/ukuran dengan jelas. - Jika metadata lokasi/GPS digunakan,
jelaskan alasan dan tampilkan hasil verifikasi hanya jika benar-benar
tersedia. - Jangan menyatakan dokumen terenkripsi atau tervalidasi jika
backend belum mengonfirmasi.

### 6.4 Tracking permohonan

-   Tampilkan nomor registrasi sebagai identitas utama.
-   Tampilkan nama layanan, pemohon (dengan masking data sensitif), OPD,
    tanggal masuk, dan update terakhir.
-   Gunakan progress stepper horizontal pada desktop dan
    vertikal/scrollable pada mobile.
-   Tahap selesai memakai hijau/teal, tahap aktif memakai biru, tahap
    mendatang memakai netral.
-   Tampilkan timeline audit dengan waktu, aktor/unit, aktivitas, dan
    keterangan.
-   Bedakan "sedang diproses", "menunggu verifikasi", "perlu revisi",
    "ditolak", dan "selesai diterbitkan".
-   Beri akses ke dokumen hasil hanya ketika tersedia dan pengguna
    berhak mengaksesnya.

### 6.5 Pengaduan masyarakat

-   Gunakan bahasa empatik, netral, dan tidak mengintimidasi.
-   Form memuat kategori, lokasi, waktu kejadian, kronologi,
    pihak/instansi terkait, dampak, harapan solusi, dan bukti pendukung
    sesuai kebutuhan.
-   Sediakan panduan atau template kronologi agar laporan lebih lengkap.
-   Tampilkan batas karakter dan penghitung karakter.
-   Berikan kontrol privasi/anonimitas secara eksplisit bila fitur
    tersedia.
-   Upload bukti memakai pola upload standar.
-   Setelah submit, tampilkan nomor tiket dan langkah berikutnya.
-   Jangan menjanjikan tindak lanjut atau SLA yang belum ditentukan.

### 6.6 Dashboard petugas

Fokus pada kecepatan kerja, akurasi, dan kejelasan tanggung jawab: -
Header dengan identitas petugas, unit kerja, mode/peran, dan kontrol
akun. - Ringkasan antrean dan metrik pekerjaan. - Filter, pencarian, tab
status, dan tabel antrean. - Tabel menonjolkan nomor registrasi,
pemohon, layanan, tanggal masuk, status, dan prioritas. - Panel detail
pemohon dan dokumen. - Checklist validasi berkas dengan status valid,
perlu ditinjau, atau tidak sesuai. - Tombol pratinjau dokumen. - Catatan
internal yang hanya terlihat bagi peran berwenang. - Audit trail
aktivitas. - Aksi persetujuan, permintaan revisi, dan penolakan
ditempatkan terpisah serta memiliki konfirmasi. - Aksi final seperti
penerbitan TTE memerlukan langkah verifikasi tambahan yang sesuai
sistem.

Jangan membuat tombol "Setujui", "Tolak", dan "Minta Revisi" tampak
setara tanpa pembeda risiko. Aksi destruktif/penolakan harus menggunakan
warna error dan konfirmasi eksplisit.

### 6.7 Dashboard administrator

-   Utamakan ringkasan operasional, distribusi status, performa OPD,
    antrean, dan log aktivitas.
-   Gunakan kartu metrik di bagian atas.
-   Grafik hanya untuk data yang benar-benar tersedia dan memiliki
    label/periode.
-   Sediakan filter rentang waktu, OPD, layanan, dan status bila
    relevan.
-   Tabel data harus mendukung pencarian, filter, sorting, pagination,
    dan empty state.
-   Bedakan informasi agregat dari data personal.
-   Akses pengaturan dan manajemen pengguna harus mengikuti
    role/permission.

### 6.8 Login terpadu

-   Gunakan layout fokus dengan identitas BANDAR LAYAN.
-   Form login berada dalam panel putih yang sederhana.
-   Tampilkan label input, bantuan, validasi, dan opsi pemulihan akun
    jika tersedia.
-   Jangan menampilkan data pribadi atau detail sistem internal di
    halaman login.
-   Sediakan indikator keamanan secara informatif, bukan klaim teknis
    yang tidak terverifikasi.

## 7. Komponen UI dan aturan penggunaannya

### Buttons

-   Primary: latar `secondary` atau `primary`, teks putih.
-   Secondary: latar `surface-container` atau `surface-container-high`.
-   Tertiary/ghost: transparan, teks `secondary`.
-   Destructive: `error` untuk tindakan penolakan/penghapusan.
-   Tinggi tombol umum 36--44px; target sentuh mobile minimal sekitar
    44px.
-   Gunakan kata kerja spesifik: "Ajukan", "Lacak", "Unduh Dokumen",
    "Minta Revisi".
-   Tambahkan ikon hanya jika membantu pemahaman.
-   Sediakan hover, focus-visible, active, disabled, dan loading states.

### Cards

-   Latar putih, radius 12px, padding 16--24px, shadow tipis.
-   Gunakan satu kartu untuk satu kelompok informasi/tugas.
-   Judul, deskripsi, metadata, dan tindakan harus memiliki hierarki
    yang konsisten.
-   Hindari nested cards yang berlebihan.

### Badges / status

-   Pill kecil dengan teks singkat.
-   Status harus menggunakan label eksplisit.
-   Contoh status: Menunggu Verifikasi, Sedang Diproses, Perlu Revisi,
    Ditolak, Selesai Diterbitkan.
-   Jangan menggunakan badge hijau untuk status yang belum selesai.

### Tables

-   Header tabel memakai latar `surface-container-low`.
-   Gunakan padding sel konsisten.
-   Baris memiliki hover lembut.
-   Hindari border berat; gunakan pemisah halus.
-   Nomor, tanggal, dan nilai penting mudah dipindai.
-   Sediakan empty state, loading state, error state, dan pagination.
-   Mobile: konversi menjadi kartu atau daftar yang mudah discan.

### Forms and inputs

-   Input berlatar `surface-container-low`.
-   Border/focus ring memakai `secondary` dengan opacity moderat.
-   Label selalu terlihat.
-   Helper text memakai `on-surface-variant` atau `outline`.
-   Error memakai `error`, disertai teks penjelasan.
-   Kelompokkan field terkait dalam section.
-   Jangan mengandalkan placeholder sebagai label.

### Modals

-   Overlay gelap semi-transparan dengan blur halus.
-   Dialog putih, radius 12px, padding 24--32px.
-   Lebar umum maksimum sekitar 448--560px.
-   Header dialog berisi judul dan tombol close.
-   Body menjelaskan konteks dan konsekuensi.
-   Footer memuat aksi sekunder dan primer.
-   Pada mobile, modal harus muat di viewport dan dapat discroll.
-   Tutup dengan tombol close, tombol batal, dan Escape bila
    memungkinkan.
-   Untuk tindakan final, minta konfirmasi yang menyebutkan tindakan dan
    objeknya.

### Toast / feedback

-   Posisi umum kanan bawah desktop; pada mobile sesuaikan agar tidak
    menutupi kontrol.
-   Gunakan pesan singkat dan spesifik.
-   Berikan state sukses, informasi, dan error.
-   Toast bukan satu-satunya cara menyampaikan error penting; error form
    harus tetap inline.
-   Jangan mengklaim proses berhasil sebelum server benar-benar
    mengonfirmasi.

### Timeline / stepper

-   Timeline vertikal untuk riwayat aktivitas.
-   Stepper horizontal untuk tahapan proses.
-   Setiap item dapat memuat ikon/status, judul, deskripsi, waktu, dan
    aktor.
-   Tahap aktif harus jelas tanpa animasi berlebihan.
-   Gunakan teks, bukan warna saja, untuk menyampaikan status.

### Navigation and breadcrumbs

-   Navigasi global konsisten antarhalaman.
-   Tandai halaman aktif dengan teks `secondary` dan weight lebih tebal.
-   Breadcrumb memakai teks kecil dan pemisah chevron.
-   Jangan membuat label navigasi terlalu panjang.

## 8. Responsiveness

Gunakan breakpoint Tailwind sebagai acuan: - Default: mobile. - `sm`:
mulai dua kolom sederhana jika ruang cukup. - `md`: grid empat kolom
untuk quick actions/metrics jika sesuai. - `lg`: navigasi desktop dan
layout dua kolom. - `xl`: layout dashboard kompleks dan panel kerja
berdampingan.

Perilaku yang diharapkan: - Mobile: satu kolom, header ringkas, tombol
full-width bila perlu, tabel menjadi kartu, modal full-width, spacing
16px. - Tablet: dua kolom untuk katalog/metric jika nyaman, panel
sidebar dapat turun ke bawah. - Desktop: container max-width, grid 12
kolom, sidebar 4 kolom, panel utama 8 kolom. - Hindari horizontal
scrolling halaman. Horizontal scroll hanya boleh pada komponen yang
memang membutuhkannya dan tetap diberi petunjuk. - Pastikan kontrol
penting tidak tersembunyi di hover karena perangkat sentuh tidak
memiliki hover.

## 9. Motion dan micro-interactions

-   Gunakan transisi singkat dan lembut untuk hover, focus, modal,
    toast, dan perubahan status.
-   Contoh: `transition-colors`, `transition-shadow`, `duration-200`
    hingga `duration-300`.
-   Animasi pulse hanya untuk indikator proses aktif yang benar-benar
    live.
-   Hindari parallax, animasi dekoratif besar, dan gerakan yang
    mengganggu.
-   Hormati `prefers-reduced-motion`.
-   Feedback interaksi harus membantu pengguna memahami hasil tindakan.

## 10. Bahasa dan microcopy

Gunakan Bahasa Indonesia yang formal, ringkas, ramah, dan mudah
dimengerti.

Contoh: - "Ajukan Permohonan" - "Lacak Dokumen" - "Status Permohonan
Terkini" - "Berkas Menunggu Verifikasi" - "Dokumen perlu diperbaiki" -
"Alasan penolakan" - "Simpan Draft" - "Kirim Pengaduan" - "Unduh
E-Dokumen"

Hindari: - Istilah teknis tanpa penjelasan. - Pesan generik seperti
"Oops!" untuk urusan administrasi. - Klaim "real-time", "terenkripsi",
"terverifikasi", "resmi", atau "berhasil" jika sistem tidak memiliki
bukti/konfirmasi. - Placeholder yang menggantikan label.

## 11. Aksesibilitas, keamanan, dan kepercayaan

-   Gunakan semantic HTML: `header`, `nav`, `main`, `section`, `form`,
    `label`, `button`, `table`.
-   Semua input memiliki label terhubung.
-   Tombol icon-only memiliki accessible name/aria-label.
-   Fokus keyboard terlihat jelas.
-   Kontras teks dan latar harus memadai.
-   Status tidak hanya disampaikan melalui warna.
-   Gunakan `aria-live` untuk toast/feedback penting bila sesuai.
-   Jangan menaruh NIK, nomor telepon, alamat, atau data sensitif secara
    utuh pada dashboard publik.
-   Jangan menampilkan catatan internal petugas kepada masyarakat.
-   Jangan menampilkan tombol/aksi yang tidak diizinkan role pengguna.
-   Jangan menampilkan informasi dokumen orang lain.
-   Pastikan tampilan data contoh diberi label demo dan tidak
    disalahartikan sebagai data produksi.

## 12. Aturan implementasi untuk AI coding agent

Saat diminta membangun atau memperbaiki halaman BANDAR LAYAN:

1.  Identifikasi jenis halaman dan peran pengguna sebelum menentukan
    layout.
2.  Gunakan design tokens di dokumen ini; jangan membuat palet baru
    tanpa alasan.
3.  Gunakan komponen yang dapat dipakai ulang untuk header, footer,
    card, badge, button, input, modal, upload, timeline, dan table.
4.  Pertahankan konsistensi antarmuka lintas portal masyarakat, petugas,
    dan administrator.
5.  Gunakan Tailwind CSS jika proyek sudah menggunakannya. Jangan
    mengganti stack teknologi tanpa diminta.
6.  Pisahkan komponen, data, dan logika interaksi jika menggunakan
    React/Vue atau framework sejenis.
7.  Jangan membuat seluruh aplikasi sebagai satu file besar jika proyek
    sudah memiliki struktur komponen.
8.  Semua interaksi yang terlihat harus bekerja: filter mengubah data,
    tombol membuka halaman/modal, upload menerima file, form
    memvalidasi, dan feedback sesuai hasil.
9.  Jangan hardcode data pribadi nyata. Gunakan data dummy yang jelas
    untuk prototipe.
10. Jangan mengarang integrasi API, status backend, tanda tangan
    elektronik, pembayaran, atau verifikasi identitas. Jika belum
    tersedia, buat state demo dan tandai dengan jelas.
11. Uji minimal pada mobile, tablet, dan desktop.
12. Periksa console/error, overflow, kontras, keyboard navigation, dan
    empty/loading/error states sebelum menyatakan selesai.

### Prompt ringkas yang dapat digunakan

> Terapkan BANDAR LAYAN Design Skill pada halaman ini. Pertahankan
> identitas visual resmi: Inter, palet navy-biru-teal, latar `#F8F9FF`,
> surface putih, radius 8--12px, spacing berbasis 4px, ikon Material
> Symbols Outlined, dan komponen yang konsisten. Buat layout responsif
> mobile-first. Prioritaskan keterbacaan, aksesibilitas, privasi data
> warga, hierarki informasi, dan alur kerja layanan publik.
> Implementasikan seluruh interaksi yang terlihat; jangan membuat tombol
> palsu atau mengklaim integrasi backend yang belum ada. Gunakan
> komponen reusable dan ikuti pola halaman yang sesuai peran pengguna.

## 13. Checklist kualitas sebelum selesai

-   [ ] Identitas BANDAR LAYAN konsisten.
-   [ ] Warna dan tipografi mengikuti token.
-   [ ] Header/footer konsisten dan responsif.
-   [ ] Hirarki judul, isi, label, dan metadata jelas.
-   [ ] Spacing dan radius konsisten.
-   [ ] Status memakai teks dan indikator visual.
-   [ ] Form memiliki label, validasi, helper text, dan error state.
-   [ ] Upload memiliki batas format/ukuran, progress, dan state error.
-   [ ] Tabel memiliki empty/loading state dan alternatif mobile.
-   [ ] Modal dapat ditutup dan tidak terpotong di mobile.
-   [ ] Tombol dan navigasi benar-benar berfungsi.
-   [ ] Data pribadi dilindungi/masking sesuai konteks.
-   [ ] Catatan internal hanya tampak bagi petugas berwenang.
-   [ ] Kontras, keyboard focus, dan target sentuh diperiksa.
-   [ ] Tidak ada klaim backend/integrasi yang belum terbukti.

------------------------------------------------------------------------

**Sumber gaya:** skill ini dirangkum dari kode antarmuka BANDAR LAYAN
yang diberikan, termasuk portal masyarakat, formulir layanan dan unggah
dokumen, tracking, pengaduan, dashboard petugas, dashboard
administrator, dan pola autentikasi. Jika sebuah nilai atau pola tidak
ditentukan secara eksplisit oleh kode, panduan di atas menyatakannya
sebagai rekomendasi implementasi, bukan fakta dari sistem produksi.
