// Initial Seed Data for BANDAR LAYAN
// Based on PRD BANDAR LAYAN & Bandar Layan Design Skill

export const INITIAL_SERVICES = [
  {
    id: "srv-001",
    code: "DOM-01",
    name: "Surat Keterangan Domisili Warga",
    category: "Kependudukan",
    opd: "Dinas Kependudukan & Catatan Sipil",
    sla: "1-2 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "badge",
    description: "Penerbitan surat keterangan domisili resmi bagi warga Kota Bandar Lampung untuk keperluan administrasi perbankan, pekerjaan, atau kependudukan.",
    requirements: [
      "Foto KTP Elektronik Asli",
      "Foto Kartu Keluarga (KK) Asli",
      "Surat Pengantar RT/Kelurahan",
      "Foto Rumah Tampak Depan"
    ],
    formFields: [
      { name: "nik", label: "Nomor Induk Kependudukan (NIK)", type: "text", required: true, placeholder: "16 digit NIK pemohon" },
      { name: "namaLengkap", label: "Nama Lengkap Sesuai KTP", type: "text", required: true, placeholder: "Nama lengkap" },
      { name: "kecamatan", label: "Kecamatan", type: "select", required: true, options: ["Enggal", "Kedaton", "Rajabasa", "Sukarame", "Tanjung Karang Pusat", "Teluk Betung Selatan", "Way Halim"] },
      { name: "kelurahan", label: "Kelurahan", type: "text", required: true, placeholder: "Nama kelurahan" },
      { name: "alamatLengkap", label: "Alamat Domisili Lengkap", type: "textarea", required: true, placeholder: "Jl, RT/RW, No. Rumah" },
      { name: "keperluan", label: "Keperluan Pengajuan", type: "text", required: true, placeholder: "Contoh: Pembukaan Rekening Bank, Lamaran Kerja" }
    ],
    isActive: true,
    totalSubmitted: 342,
    rating: 4.8
  },
  {
    id: "srv-002",
    code: "KIA-02",
    name: "Penerbitan Kartu Identitas Anak (KIA)",
    category: "Kependudukan",
    opd: "Dinas Kependudukan & Catatan Sipil",
    sla: "2-3 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "person",
    description: "Identitas resmi bagi anak berusia 0 sampai dengan 17 tahun kurang satu hari yang diterbitkan oleh Disdukcapil Kota Bandar Lampung.",
    requirements: [
      "Scan / Foto Akta Kelahiran Anak",
      "Scan / Foto Kartu Keluarga (KK)",
      "KTP Asli Kedua Orang Tua",
      "Pas Foto Anak Berwarna 3x4 (untuk anak di atas 5 tahun)"
    ],
    formFields: [
      { name: "namaAnak", label: "Nama Lengkap Anak", type: "text", required: true, placeholder: "Nama anak sesuai akta" },
      { name: "nikAnak", label: "NIK Anak (dari KK)", type: "text", required: true, placeholder: "16 digit NIK anak" },
      { name: "tempatTanggalLahir", label: "Tempat, Tanggal Lahir", type: "text", required: true, placeholder: "Bandar Lampung, 12-05-2016" },
      { name: "namaAyah", label: "Nama Lengkap Ayah", type: "text", required: true, placeholder: "Nama ayah kandung" },
      { name: "namaIbu", label: "Nama Lengkap Ibu", type: "text", required: true, placeholder: "Nama ibu kandung" }
    ],
    isActive: true,
    totalSubmitted: 618,
    rating: 4.9
  },
  {
    id: "srv-003",
    code: "IUMK-03",
    name: "Rekomendasi Izin Usaha Mikro & Kecil (IUMK)",
    category: "Perizinan & Usaha",
    opd: "Dinas Penanaman Modal & PTSP Kota Bandar Lampung",
    sla: "3-5 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "storefront",
    description: "Surat rekomendasi legalitas usaha mikro dan kecil untuk mempermudah akses pembiayaan perbankan, binaan UMKM Kota Bandar Lampung, dan kepastian hukum lokasi usaha.",
    requirements: [
      "KTP Pemilik Usaha",
      "Kartu Keluarga (KK)",
      "Foto Tempat Usaha / Produk",
      "Surat Keterangan Usaha dari Lurah",
      "Titik Koordinat Lokasi Usaha (Google Maps)"
    ],
    formFields: [
      { name: "namaUsaha", label: "Nama Usaha / Merk Dagang", type: "text", required: true, placeholder: "Contoh: Kopi Tapis Jaya" },
      { name: "sektorUsaha", label: "Sektor Bidang Usaha", type: "select", required: true, options: ["Kuliner & Makanan", "Fashion & Tekstil", "Kerajinan Tapis & Seni", "Perdagangan & Retail", "Jasa & Layanan"] },
      { name: "modalUsaha", label: "Estimasi Modal Awal (Rp)", type: "number", required: true, placeholder: "Contoh: 15000000" },
      { name: "alamatUsaha", label: "Alamat Lengkap Usaha", type: "textarea", required: true, placeholder: "Alamat fisik kegiatan usaha" },
      { name: "jumlahKaryawan", label: "Jumlah Tenaga Kerja", type: "number", required: false, placeholder: "Jumlah orang" }
    ],
    isActive: true,
    totalSubmitted: 215,
    rating: 4.7
  },
  {
    id: "srv-004",
    code: "DTKS-04",
    name: "Pendaftaran Data Terpadu Kesejahteraan Sosial (DTKS)",
    category: "Bantuan Sosial",
    opd: "Dinas Sosial Kota Bandar Lampung",
    sla: "5-7 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "receipt_long",
    description: "Pendaftaran keluarga prasejahtera Kota Bandar Lampung untuk verifikasi kelayakan bantuan sosial (PKH, BPNT, KIP, dan PBI-JK).",
    requirements: [
      "Foto KTP Elektronik Kepala Keluarga",
      "Foto Kartu Keluarga",
      "Surat Keterangan Tidak Mampu (SKTM) dari Kelurahan",
      "Foto Kondisi Rumah (Depan, Ruang Tamu, Dapur)"
    ],
    formFields: [
      { name: "nomorKk", label: "Nomor Kartu Keluarga (KK)", type: "text", required: true, placeholder: "16 digit No KK" },
      { name: "penghasilan", label: "Estimasi Penghasilan Rata-Rata Bulanan", type: "select", required: true, options: ["< Rp 1.000.000", "Rp 1.000.000 - Rp 2.000.000", "Rp 2.000.000 - Rp 3.000.000"] },
      { name: "statusTempatTinggal", label: "Status Kepemilikan Rumah", type: "select", required: true, options: ["Milik Sendiri", "Sewa / Kontrak", "Menumpang Keluarga", "Lainnya"] },
      { name: "alasanPengajuan", label: "Alasan Permohonan DTKS", type: "textarea", required: true, placeholder: "Kondisi ekonomi keluarga saat ini..." }
    ],
    isActive: true,
    totalSubmitted: 479,
    rating: 4.6
  },
  {
    id: "srv-005",
    code: "JMK-05",
    name: "Rekomendasi Jamkesda / PBI APBD",
    category: "Kesehatan",
    opd: "Dinas Kesehatan Kota Bandar Lampung",
    sla: "2 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "verified",
    description: "Penerbitan surat rekomendasi jaminan pembiayaan pelayanan kesehatan daerah bagi warga kurang mampu yang memerlukan tindakan medis segera di RSUD A. Dadi Tjokrodipo.",
    requirements: [
      "KTP & Kartu Keluarga Kota Bandar Lampung",
      "Surat Rujukan Puskesmas / Resume Medis RS",
      "Surat Keterangan Tidak Mampu (SKTM)"
    ],
    formFields: [
      { name: "namaPasien", label: "Nama Pasien", type: "text", required: true, placeholder: "Nama pasien" },
      { name: "nikPasien", label: "NIK Pasien", type: "text", required: true, placeholder: "NIK pasien" },
      { name: "fasilitasKesehatanTujuan", label: "Faskes / Rumah Sakit Rujukan", type: "select", required: true, options: ["RSUD Dr. A. Dadi Tjokrodipo", "RSUD Dr. H. Abdul Moeloek", "Puskesmas Rawat Inap Panjang", "Puskesmas Rawat Inap Kedaton"] },
      { name: "diagnosaAwal", label: "Keluhan / Diagnosa Dokter", type: "textarea", required: true, placeholder: "Keterangan sakit atau diagnosa awal" }
    ],
    isActive: true,
    totalSubmitted: 180,
    rating: 4.8
  },
  {
    id: "srv-006",
    code: "PBB-06",
    name: "Permohonan Mutasi / Balik Nama SPPT PBB",
    category: "Perpajakan & Aset",
    opd: "Badan Pendapatan Daerah (Bapenda)",
    sla: "7-14 Hari Kerja",
    cost: "Gratis (Rp 0)",
    icon: "description",
    description: "Pelayanan perubahan nama wajib pajak pada SPPT PBB-P2 atas peralihan hak kepemilikan tanah/bangunan akibat jual beli, hibah, waris, atau perbaikan data.",
    requirements: [
      "Fotokopi KTP Wajib Pajak Baru",
      "Fotokopi Sertifikat Tanah / Akta Jual Beli",
      "SPPT PBB Tahun Berjalan",
      "Bukti Lunas PBB 3 Tahun Terakhir"
    ],
    formFields: [
      { name: "nopPbb", label: "Nomor Objek Pajak (NOP PBB)", type: "text", required: true, placeholder: "18 digit NOP" },
      { name: "namaWpLama", label: "Nama Wajib Pajak Lama", type: "text", required: true, placeholder: "Nama pada SPPT lama" },
      { name: "namaWpBaru", label: "Nama Wajib Pajak Baru", type: "text", required: true, placeholder: "Nama pemilik baru" },
      { name: "luasTanah", label: "Luas Tanah (m2)", type: "number", required: true, placeholder: "m2" },
      { name: "luasBangunan", label: "Luas Bangunan (m2)", type: "number", required: true, placeholder: "m2" }
    ],
    isActive: true,
    totalSubmitted: 94,
    rating: 4.5
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-citizen-01",
    name: "Aisyah Nafilah",
    email: "aisyah.nafilah@warga.bandarlampung.go.id",
    role: "masyarakat",
    nik: "1871026405020001",
    phone: "0812-7890-1234",
    address: "Jl. Raden Intan No. 45, RT 03/LK II, Kel. Enggal, Kec. Enggal, Kota Bandar Lampung",
    isVerified: true,
    digitalIdActive: true,
    avatar: "AN"
  },
  {
    id: "usr-citizen-02",
    name: "Budi Santoso",
    email: "budi.santoso@warga.bandarlampung.go.id",
    role: "masyarakat",
    nik: "1871041908880004",
    phone: "0813-6621-9988",
    address: "Jl. Teuku Umar No. 120, Kedaton, Bandar Lampung",
    isVerified: true,
    digitalIdActive: false,
    avatar: "BS"
  },
  {
    id: "usr-officer-01",
    name: "Hendra Pratama, S.STP",
    email: "hendra.petugas@bandarlampung.go.id",
    role: "petugas",
    nip: "198504122010011008",
    unit: "Front Office & Verifikator Disdukcapil Kota Bandar Lampung",
    phone: "0811-7200-5544",
    avatar: "HP"
  },
  {
    id: "usr-officer-02",
    name: "Dewi Lestari, S.Kom",
    email: "dewi.petugas@bandarlampung.go.id",
    role: "petugas",
    nip: "199009182015022003",
    unit: "Tim Teknis Pelayanan Perizinan DPMPTSP",
    phone: "0811-7299-1122",
    avatar: "DL"
  },
  {
    id: "usr-admin-01",
    name: "Ir. Bambang Wicaksono, M.T.",
    email: "admin@bandarlampung.go.id",
    role: "administrator",
    nip: "197803152002121002",
    unit: "Diskominfo Smart City Kota Bandar Lampung",
    phone: "0812-9900-1122",
    avatar: "BW"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req-001",
    requestNumber: "REG-2026-BDL-00192",
    userId: "usr-citizen-01",
    applicantName: "Aisyah Nafilah",
    applicantNik: "1871026405020001",
    serviceId: "srv-002",
    serviceName: "Penerbitan Kartu Identitas Anak (KIA)",
    category: "Kependudukan",
    opd: "Dinas Kependudukan & Catatan Sipil",
    status: "completed", // submitted | under_review | needs_revision | in_process | rejected | completed
    priority: "Normal",
    submittedAt: "2026-11-04T08:30:00Z",
    updatedAt: "2026-11-06T14:15:00Z",
    formData: {
      namaAnak: "Raihan Nafilah",
      nikAnak: "1871021208180003",
      tempatTanggalLahir: "Bandar Lampung, 12 Agustus 2018",
      namaAyah: "H. Ahmad Fauzi",
      namaIbu: "Hj. Siti Aminah"
    },
    documents: [
      { id: "doc-1", name: "Akta_Kelahiran_Raihan.pdf", size: "1.4 MB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-2", name: "Kartu_Keluarga_Fauzi.pdf", size: "2.1 MB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-3", name: "KTP_Orang_Tua_Gabung.jpg", size: "850 KB", type: "image/jpeg", isVerified: true, statusText: "Valid" },
      { id: "doc-4", name: "Pas_Foto_Anak_3x4.jpg", size: "420 KB", type: "image/jpeg", isVerified: true, statusText: "Valid" }
    ],
    checklist: [
      { item: "Kesesuaian NIK Anak & Nama pada Akta", valid: true },
      { item: "Kartu Keluarga Kota Bandar Lampung aktif", valid: true },
      { item: "Pas foto latar belakang sesuai tahun lahir", valid: true }
    ],
    timeline: [
      { title: "Permohonan Dikirim", time: "04 Nov 2026, 08:30 WIB", actor: "Masyarakat (Aisyah Nafilah)", note: "Berkas formulir dan 4 dokumen pendukung berhasil diajukan." },
      { title: "Berkas Diverifikasi", time: "04 Nov 2026, 11:20 WIB", actor: "Petugas Verifikator (Hendra Pratama)", note: "Seluruh berkas persyaratan lengkap dan sesuai." },
      { title: "Pencetakan KIA", time: "05 Nov 2026, 09:40 WIB", actor: "Operator Teknis Disdukcapil", note: "Fisik blangko KIA selesai dicetak dan registrasi digital diterbitkan." },
      { title: "Selesai Diterbitkan", time: "06 Nov 2026, 14:15 WIB", actor: "Sistem Terintegrasi", note: "E-Dokumen Bukti Pengambilan KIA dan Tanda Terima Digital telah siap diunduh." }
    ],
    publicNote: "Permohonan telah disetujui. Fisik KIA dapat diambil di Loket 4 Disdukcapil Kota Bandar Lampung atau gerai Mal Pelayanan Publik (MPP).",
    internalNote: "NIK anak terverifikasi di SIAK Terpusat Kemendagri. Cetak blangko nomor seri KIA-BL-2026-9081.",
    edocAvailable: true,
    ratingGiven: 5,
    ratingFeedback: "Pelayanan sangat cepat dan informatif. Notifikasi permohonan jelas dan dokumen bisa dilacak dengan mudah."
  },
  {
    id: "req-002",
    requestNumber: "REG-2026-BDL-00341",
    userId: "usr-citizen-01",
    applicantName: "Aisyah Nafilah",
    applicantNik: "1871026405020001",
    serviceId: "srv-001",
    serviceName: "Surat Keterangan Domisili Warga",
    category: "Kependudukan",
    opd: "Dinas Kependudukan & Catatan Sipil",
    status: "under_review",
    priority: "Tinggi",
    submittedAt: "2026-11-09T09:15:00Z",
    updatedAt: "2026-11-09T10:00:00Z",
    formData: {
      nik: "1871026405020001",
      namaLengkap: "Aisyah Nafilah",
      kecamatan: "Enggal",
      kelurahan: "Enggal",
      alamatLengkap: "Jl. Raden Intan No. 45, RT 03/LK II",
      keperluan: "Pembukaan Rekening Tabungan Haji & Umrah BSI"
    },
    documents: [
      { id: "doc-5", name: "Scan_eKTP_Aisyah.pdf", size: "1.1 MB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-6", name: "Scan_KK_Terbaru.pdf", size: "1.8 MB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-7", name: "Surat_Pengantar_RT_Kelurahan.jpg", size: "920 KB", type: "image/jpeg", isVerified: null, statusText: "Perlu Peninjauan" }
    ],
    checklist: [
      { item: "Validasi NIK Pemohon di Database Kependudukan", valid: true },
      { item: "Alamat domisili sesuai wilayah administrasi Kelurahan Enggal", valid: true },
      { item: "Tanda tangan & stempel basah Surat Pengantar RT", valid: false }
    ],
    timeline: [
      { title: "Permohonan Dikirim", time: "09 Nov 2026, 09:15 WIB", actor: "Masyarakat (Aisyah Nafilah)", note: "Permohonan masuk ke sistem antrean pelayanan kependudukan." },
      { title: "Menunggu Verifikasi Berkas", time: "09 Nov 2026, 10:00 WIB", actor: "Petugas Verifikator (Hendra Pratama)", note: "Sedang dalam antrean pemeriksaan petugas loket kependudukan." }
    ],
    publicNote: "Dokumen Anda sedang dalam antrean verifikasi oleh petugas Disdukcapil.",
    internalNote: "Harap periksa stempel RT pada dokumen pengantar sebelum penerbitan.",
    edocAvailable: false,
    ratingGiven: null
  },
  {
    id: "req-003",
    requestNumber: "REG-2026-BDL-00287",
    userId: "usr-citizen-01",
    applicantName: "Aisyah Nafilah",
    applicantNik: "1871026405020001",
    serviceId: "srv-003",
    serviceName: "Rekomendasi Izin Usaha Mikro & Kecil (IUMK)",
    category: "Perizinan & Usaha",
    opd: "Dinas Penanaman Modal & PTSP Kota Bandar Lampung",
    status: "in_process",
    priority: "Normal",
    submittedAt: "2026-11-08T13:45:00Z",
    updatedAt: "2026-11-09T14:30:00Z",
    formData: {
      namaUsaha: "Tapis Cantik Bandar Lampung",
      sektorUsaha: "Kerajinan Tapis & Seni",
      modalUsaha: 25000000,
      alamatUsaha: "Jl. Raden Intan No. 45, Enggal",
      jumlahKaryawan: 3
    },
    documents: [
      { id: "doc-8", name: "KTP_Pelaku_Usaha.pdf", size: "890 KB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-9", name: "Foto_Tempat_Usaha_Galeri.jpg", size: "2.4 MB", type: "image/jpeg", isVerified: true, statusText: "Valid" },
      { id: "doc-10", name: "Surat_Keterangan_Lurah.pdf", size: "1.2 MB", type: "application/pdf", isVerified: true, statusText: "Valid" }
    ],
    checklist: [
      { item: "Identitas pelaku usaha warga Bandar Lampung", valid: true },
      { item: "Kesesuaian KBLI dan deskripsi kegiatan usaha", valid: true },
      { item: "Titik lokasi tidak melanggar tata ruang wilayah", valid: true }
    ],
    timeline: [
      { title: "Permohonan Dikirim", time: "08 Nov 2026, 13:45 WIB", actor: "Masyarakat (Aisyah Nafilah)", note: "Pengajuan izin rekomendasi IUMK diajukan secara elektronik." },
      { title: "Pemeriksaan Kelengkapan", time: "09 Nov 2026, 09:10 WIB", actor: "Petugas Front Office DPMPTSP", note: "Dokumen administrasi dinyatakan lengkap." },
      { title: "Sedang Diproses Tim Teknis", time: "09 Nov 2026, 14:30 WIB", actor: "Dewi Lestari, S.Kom (Tim Teknis)", note: "Penyusunan naskah rekomendasi izin dan validasi peta zonasi." }
    ],
    publicNote: "Permohonan Anda telah lolos verifikasi berkas dan sedang diproses oleh Tim Teknis Perizinan Usaha.",
    internalNote: "Usaha kerajinan tapis lokal binaan Dekranasda Kota Bandar Lampung, proses penerbitan rekomendasi disegerakan.",
    edocAvailable: false,
    ratingGiven: null
  },
  {
    id: "req-004",
    requestNumber: "REG-2026-BDL-00412",
    userId: "usr-citizen-02",
    applicantName: "Budi Santoso",
    applicantNik: "1871041908880004",
    serviceId: "srv-004",
    serviceName: "Pendaftaran Data Terpadu Kesejahteraan Sosial (DTKS)",
    category: "Bantuan Sosial",
    opd: "Dinas Sosial Kota Bandar Lampung",
    status: "needs_revision",
    priority: "Normal",
    submittedAt: "2026-11-07T10:15:00Z",
    updatedAt: "2026-11-08T16:20:00Z",
    formData: {
      nomorKk: "1871040102100005",
      penghasilan: "< Rp 1.000.000",
      statusTempatTinggal: "Sewa / Kontrak",
      alasanPengajuan: "Kepala keluarga sakit menahun dan membutuhkan jaminan bantuan sembako serta BPJS PBI."
    },
    documents: [
      { id: "doc-11", name: "Foto_KTP_Buram.jpg", size: "350 KB", type: "image/jpeg", isVerified: false, statusText: "Tidak Sesuai / Buram" },
      { id: "doc-12", name: "Scan_Kartu_Keluarga.pdf", size: "1.9 MB", type: "application/pdf", isVerified: true, statusText: "Valid" },
      { id: "doc-13", name: "Foto_Rumah.jpg", size: "1.1 MB", type: "image/jpeg", isVerified: true, statusText: "Valid" }
    ],
    checklist: [
      { item: "Keterbacaan NIK pada e-KTP", valid: false },
      { item: "Kesesuaian Kartu Keluarga", valid: true },
      { item: "Surat Pengantar RT bermaterai/berstempel", valid: false }
    ],
    timeline: [
      { title: "Permohonan Dikirim", time: "07 Nov 2026, 10:15 WIB", actor: "Masyarakat (Budi Santoso)", note: "Pendaftaran berkas DTKS diajukan." },
      { title: "Permintaan Perbaikan Berkas", time: "08 Nov 2026, 16:20 WIB", actor: "Petugas Verifikator (Hendra Pratama)", note: "Foto KTP buram dan tidak terbaca jelas. Mohon unggah ulang foto e-KTP asli yang tajam dan terbaca." }
    ],
    publicNote: "Perhatian: Foto KTP yang Anda unggah buram dan NIK tidak terbaca. Silakan klik tombol 'Perbaiki Berkas' untuk mengunggah ulang KTP yang jelas.",
    internalNote: "KTP kabur, pemohon diminta re-upload agar tidak terjadi kesalahan penetapan desil kemiskinan.",
    edocAvailable: false,
    ratingGiven: null
  },
  {
    id: "req-005",
    requestNumber: "REG-2026-BDL-00105",
    userId: "usr-citizen-02",
    applicantName: "Budi Santoso",
    applicantNik: "1871041908880004",
    serviceId: "srv-005",
    serviceName: "Rekomendasi Jamkesda / PBI APBD",
    category: "Kesehatan",
    opd: "Dinas Kesehatan Kota Bandar Lampung",
    status: "rejected",
    priority: "Rendah",
    submittedAt: "2026-11-01T11:00:00Z",
    updatedAt: "2026-11-03T13:10:00Z",
    formData: {
      namaPasien: "Agus Santoso",
      nikPasien: "1871042503900002",
      fasilitasKesehatanTujuan: "RSUD Dr. A. Dadi Tjokrodipo",
      diagnosaAwal: "Pemeriksaan berkala mata minus dan kacamata"
    },
    documents: [
      { id: "doc-14", name: "KTP_Pasien.pdf", size: "750 KB", type: "application/pdf", isVerified: true, statusText: "Valid" }
    ],
    checklist: [
      { item: "Kategori kegawatdaruratan / tindakan medis", valid: false },
      { item: "Rekomendasi dokter spesialis", valid: false }
    ],
    timeline: [
      { title: "Permohonan Dikirim", time: "01 Nov 2026, 11:00 WIB", actor: "Masyarakat (Budi Santoso)", note: "Pengajuan rekomendasi Jamkesda." },
      { title: "Permohonan Ditolak", time: "03 Nov 2026, 13:10 WIB", actor: "Tim Verifikasi Medis Dinkes", note: "Layanan Jamkesda PBI APBD diprioritaskan untuk tindakan medis darurat dan rawat inap. Pemeriksaan kacamata reguler dapat dilayani di Puskesmas pembina." }
    ],
    publicNote: "Permohonan ditolak. Layanan Jamkesda PBI APBD Kota Bandar Lampung difokuskan untuk tindakan kuratif rawat inap dan kegawatdaruratan medis.",
    internalNote: "Bukan tindakan gawat darurat, disarankan memanfaatkan fasilitas pelayanan kesehatan primer BPJS Puskesmas Kedaton.",
    edocAvailable: false,
    ratingGiven: null
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "cmp-001",
    ticketNumber: "TKT-2026-0041",
    userId: "usr-citizen-01",
    reporterName: "Aisyah Nafilah",
    isAnonymous: false,
    category: "Infrastruktur & Jalan",
    subject: "Lampu Penerangan Jalan Umum (PJU) Padam di Depan Kampus Teknokrat",
    location: "Jl. ZA. Pagar Alam, Gedong Meneng, Rajabasa, Bandar Lampung",
    incidentDate: "08 November 2026",
    description: "Terdapat 3 tiang lampu jalan padam berurutan di seberang halte bus kampus, mengakibatkan ruas jalan menjadi gelap gulita pada malam hari dan rawan kecelakaan.",
    evidenceImage: "pju_padam_za_pagaralam.jpg",
    status: "in_progress", // submitted | in_progress | resolved | closed
    opdTarget: "Dinas Perhubungan & Dinas PU Kota Bandar Lampung",
    submittedAt: "2026-11-08T19:30:00Z",
    updatedAt: "2026-11-09T08:00:00Z",
    followUps: [
      { time: "08 Nov 2026, 19:30 WIB", actor: "Masyarakat", note: "Laporan pengaduan disampaikan disertai koordinat lokasi." },
      { time: "09 Nov 2026, 08:00 WIB", actor: "Dishub UPT Lampu Jalan", note: "Tim teknis pemeliharaan PJU dijadwalkan melakukan penggantian ballast & bohlam LED pada shift malam." }
    ]
  },
  {
    id: "cmp-002",
    ticketNumber: "TKT-2026-0028",
    userId: "usr-citizen-02",
    reporterName: "Warga Enggal (Anonim)",
    isAnonymous: true,
    category: "Kebersihan & Lingkungan Hidup",
    subject: "Penumpukan Sampah Liar di Sekitar Pasar Bambu Kuning",
    location: "Jl. Imam Bonjol, Tanjung Karang Pusat, Kota Bandar Lampung",
    incidentDate: "05 November 2026",
    description: "Tumpukan sampah pasar meluber hingga ke badan jalan dan menimbulkan bau menyengat karena belum terangkut truk kontainer dinas kebersihan selama 2 hari.",
    evidenceImage: "sampah_pasar_bambukuning.jpg",
    status: "resolved",
    opdTarget: "Dinas Lingkungan Hidup (DLH) Kota Bandar Lampung",
    submittedAt: "2026-11-05T07:15:00Z",
    updatedAt: "2026-11-05T14:40:00Z",
    followUps: [
      { time: "05 Nov 2026, 07:15 WIB", actor: "Warga", note: "Laporan sampah menumpuk dikirim." },
      { time: "05 Nov 2026, 09:30 WIB", actor: "Call Center DLH", note: "Disposisi armada truk pengangkut sampah regu 3 Tanjung Karang Pusat." },
      { time: "05 Nov 2026, 14:40 WIB", actor: "Tim Reaksi Cepat DLH", note: "Sampah telah diangkut ke TPA Bakung dan lokasi telah disemprot desinfektan." }
    ]
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "log-101",
    timestamp: "2026-11-09T14:30:00Z",
    actor: "Dewi Lestari, S.Kom (Petugas)",
    action: "STATUS_UPDATE",
    target: "REG-2026-BDL-00287",
    details: "Mengubah status dari under_review menjadi in_process (Tim Teknis Perizinan Usaha)."
  },
  {
    id: "log-102",
    timestamp: "2026-11-09T10:00:00Z",
    actor: "Hendra Pratama, S.STP (Petugas)",
    action: "CHECKLIST_VALIDATION",
    target: "REG-2026-BDL-00341",
    details: "Melakukan checklist verifikasi 3 berkas permohonan Domisili."
  },
  {
    id: "log-103",
    timestamp: "2026-11-08T16:20:00Z",
    actor: "Hendra Pratama, S.STP (Petugas)",
    action: "STATUS_UPDATE",
    target: "REG-2026-BDL-00412",
    details: "Mengubah status dari under_review menjadi needs_revision dengan instruksi perbaikan e-KTP."
  },
  {
    id: "log-104",
    timestamp: "2026-11-06T14:15:00Z",
    actor: "Sistem Terintegrasi",
    action: "DOCUMENT_ISSUED",
    target: "REG-2026-BDL-00192",
    details: "Menerbitkan E-Dokumen Tanda Terima Digital & Surat Keputusan Pengambilan KIA."
  },
  {
    id: "log-105",
    timestamp: "2026-11-05T10:00:00Z",
    actor: "Ir. Bambang Wicaksono, M.T. (Administrator)",
    action: "SERVICE_CATALOG_UPDATE",
    target: "srv-003",
    details: "Memperbarui SLA layanan Rekomendasi IUMK dari 7 hari menjadi 3-5 hari kerja."
  }
];
