// Daftar surat hasil pemetaan template Blade. Dipakai halaman katalog.
// Judul & jenis surat mengikuti sheet 'Form Identifikasi Layanan' dan folder resources/views/letters.
// category = tab di katalog (permohonan, pernyataan, ...); group = nama folder berkas di views/services/letters/<group>/<slug>.vue
// Surat dengan group "permit" boleh muncul di dua alur: flow "permit" (Layanan Umum) dan flow "general" (Layanan Warga).
export const GENERAL_CATEGORIES = [
  {
    "value": "permohonan",
    "label": "Permohonan"
  },
  {
    "value": "pernyataan",
    "label": "Pernyataan"
  },
  {
    "value": "keterangan",
    "label": "Keterangan"
  },
  {
    "value": "perintah",
    "label": "Perintah"
  },
  {
    "value": "balasan",
    "label": "Balasan"
  },
  {
    "value": "pengantar",
    "label": "Pengantar"
  }
];

export const LETTER_REGISTRY = [
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "ktp-application",
    "title": "Surat Permohonan KTP"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "resident-arrival",
    "title": "Formulir Permohonan Pindah Datang WNI"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "kia-application",
    "title": "Surat Permohonan Penerbitan KIA"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "temporary-resident-request",
    "title": "Surat Permohonan Menjadi Penduduk Sementara / SKTS"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "divorce-lawsuit",
    "title": "Surat Permohonan Cerai"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "referral",
    "slug": "fuel-recommendation",
    "title": "Surat Rekomendasi Pembelian Jenis BBM Tertentu"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "temporary-stay-application",
    "title": "Permohonan Tinggal Sementara"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "referral",
    "slug": "relocation-cover",
    "title": "Surat Pengantar Permohonan Pindah WNI"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "relocation-certificate",
    "title": "Formulir Keterangan Pindah WNI"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "population-occurrence-registration",
    "title": "Formulir Pendaftaran Peristiwa Kependudukan"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "application",
    "slug": "family-biodata",
    "title": "Formulir Biodata Penduduk WNI (Per Keluarga)"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "birth",
    "slug": "birth-certificate-application-form",
    "title": "Permohonan Akta Kelahiran"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "birth",
    "slug": "birth-report-form",
    "title": "Formulir Pelaporan Kelahiran (Untuk Mendapatkan Akta Kelahiran)"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "death",
    "slug": "death-certificate-application",
    "title": "Permohonan Akta Kematian"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "death",
    "slug": "death-report-form",
    "title": "Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "married-man",
    "slug": "marriage-application-letter",
    "title": "Permohonan Kehendak Nikah"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "married-man",
    "slug": "marriage-registration-data-sheet",
    "title": "Data Isian Pendaftaran Nikah"
  },
  {
    "flow": "general",
    "category": "permohonan",
    "group": "marriage-women",
    "slug": "registration-form",
    "title": "Data Isian Pendaftaran Nikah"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "identity-discrepancy-statement",
    "title": "Surat Pernyataan Beda Nama/Identitas"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "population-data-change-statement",
    "title": "Surat Pernyataan Perubahan Elemen Data Kependudukan"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "population-document-statement",
    "title": "Surat Pernyataan Tidak Memiliki Dokumen Kependudukan"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "unregistered-marriage-responsibility",
    "title": "Surat Pernyataan Tanggung Jawab Mutlak Perkawinan Belum Tercatat"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "heir-power-of-attorney",
    "title": "Surat Kuasa Sidang Waris"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "statement",
    "slug": "population-service-authorization",
    "title": "Surat Kuasa Dalam Pelayanan Administrasi Kependudukan"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "birth",
    "slug": "birth-report-statement",
    "title": "Laporan Kelahiran"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "birth",
    "slug": "spousal-relationship-responsibility-statement",
    "title": "Surat Pernyataan Tanggung Jawab Mutlak Kebenaran Sebagai Pasangan Suami Istri"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "birth",
    "slug": "birth-certificate-power-of-attorney",
    "title": "Surat Kuasa"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "death",
    "slug": "death-general-statement",
    "title": "Surat Keterangan Mohon Akta Kematian"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "death",
    "slug": "death-data-statement",
    "title": "Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "death",
    "slug": "death-power-of-attorney",
    "title": "Surat Kuasa"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "letter-c",
    "slug": "letter-c-data-statement-letter",
    "title": "Surat Pernyataan Permohonan Data Letter C"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "letter-c",
    "slug": "power-of-attorney-letter",
    "title": "Surat Kuasa"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "married-man",
    "slug": "not-remarried-statement-letter",
    "title": "Surat Keterangan Belum Menikah Lagi"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "married-man",
    "slug": "parental-consent-letter",
    "title": "Surat Izin Orang Tua"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "married-man",
    "slug": "bride-groom-consent-letter",
    "title": "Persetujuan Calon Pengantin"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "marriage-women",
    "slug": "guardian-statement",
    "title": "Surat Keterangan Wali Nikah"
  },
  {
    "flow": "general",
    "category": "pernyataan",
    "group": "marriage-women",
    "slug": "unmarried-statement",
    "title": "Surat Keterangan Belum Menikah Lagi"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "certificate",
    "slug": "unmarried-status",
    "title": "Surat Keterangan Belum Kawin"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "permit",
    "slug": "business-permit",
    "title": "Surat Keterangan Usaha"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "statement",
    "slug": "general-statement",
    "title": "Surat Keterangan Umum (Kop Lurah)"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "statement",
    "slug": "general-statement-gov",
    "title": "Surat Keterangan Umum (Kop Pemerintah Kalurahan)"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "certificate",
    "slug": "domicile-certificate",
    "title": "Surat Keterangan Domisili"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "certificate",
    "slug": "sktm-general",
    "title": "Surat Keterangan Tidak Mampu"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "certificate",
    "slug": "sktm-school",
    "title": "Surat Keterangan Tidak Mampu Sekolah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "permit",
    "slug": "income-permit",
    "title": "Surat Keterangan Penghasilan"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "permit",
    "slug": "event-permit",
    "title": "Surat Keterangan Keramaian"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "permit",
    "slug": "travel-permit-gov",
    "title": "Surat Keterangan Jalan"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "referral",
    "slug": "skck-referral",
    "title": "Surat Keterangan Mohon SKCK"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "application",
    "slug": "legalization-register",
    "title": "Surat Legalisasi"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "birth",
    "slug": "birth-attestation-letter",
    "title": "Surat Keterangan Kelahiran"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "death",
    "slug": "death-certificate",
    "title": "Surat Keterangan Kematian"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "death",
    "slug": "death-commemoration-calculation",
    "title": "Perhitungan Selamatan 3 Hari Sampai 1000 Hari"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "letter-c",
    "slug": "land-price-certificate-letter",
    "title": "Surat Keterangan Harga Tanah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "letter-c",
    "slug": "land-origin-certificate-letter",
    "title": "Surat Keterangan Asal Tanah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "married-man",
    "slug": "never-married-certificate-letter",
    "title": "Surat Keterangan Belum Pernah Menikah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "married-man",
    "slug": "marriage-lodging-certificate-letter",
    "title": "Surat Keterangan Numpang Nikah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "married-man",
    "slug": "death-certificate-for-marriage-letter",
    "title": "Surat Keterangan Kematian"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "married-man",
    "slug": "general-certificate-letter",
    "title": "Surat Pengantar Tes Kesehatan"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "unmarried-certificate",
    "title": "Surat Keterangan Belum Pernah Menikah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "n1",
    "title": "Pengantar Nikah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "n2",
    "title": "Permohonan Kehendak Nikah"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "n4",
    "title": "Persetujuan Calon Pengantin"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "n5",
    "title": "Surat Izin Orang Tua"
  },
  {
    "flow": "general",
    "category": "keterangan",
    "group": "marriage-women",
    "slug": "n6",
    "title": "Surat Keterangan Kematian"
  },
  {
    "flow": "general",
    "category": "perintah",
    "group": "order",
    "slug": "duty-travel-order",
    "title": "SPPD"
  },
  {
    "flow": "general",
    "category": "perintah",
    "group": "birth",
    "slug": "late-birth-registration-approval-decree",
    "title": "Surat Pencatatan Kelahiran Terlambat"
  },
  {
    "flow": "general",
    "category": "balasan",
    "group": "permit",
    "slug": "permit-followup",
    "title": "Surat Tindak Lanjut Permohonan Izin"
  },
  {
    "flow": "general",
    "category": "balasan",
    "group": "application",
    "slug": "lease-offer",
    "title": "Surat Penawaran Sewa Kontrak Gedung BRI Unit Ngemplak II"
  },
  {
    "flow": "general",
    "category": "balasan",
    "group": "referral",
    "slug": "research-response",
    "title": "Surat Balasan Penelitian"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "application",
    "slug": "marriage-certificate-duplicate",
    "title": "Surat Pengantar Duplikat Nikah"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "referral",
    "slug": "general-cover",
    "title": "Surat Pengantar Umum"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "birth",
    "slug": "birth-certificate-referral-letter",
    "title": "Surat Keterangan Mohon Akta Kelahiran"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "married-man",
    "slug": "marriage-introduction-letter",
    "title": "Pengantar Nikah"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "marriage-women",
    "slug": "marriage-lodging",
    "title": "Surat Keterangan Numpang Nikah"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "marriage-women",
    "slug": "health-referral",
    "title": "Surat Pengantar Tes Kesehatan"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "marriage-women",
    "slug": "judge-guardian",
    "title": "Surat Keterangan Wali Hakim"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "death",
    "slug": "death-report",
    "title": "Laporan Kematian"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "death",
    "slug": "death-registration-report",
    "title": "Pelaporan Pencatatan Kematian"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "birth",
    "slug": "birth-registration-report",
    "title": "Pelaporan Pencatatan Kelahiran"
  },
  {
    "flow": "general",
    "category": "pengantar",
    "group": "birth",
    "slug": "out-of-domicile-birth-report",
    "title": "Laporan Kelahiran Luar Domisili"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "business-permit",
    "title": "Surat Keterangan Usaha"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "income-permit",
    "title": "Surat Keterangan Penghasilan"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "event-permit",
    "title": "Surat Keterangan Keramaian"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "travel-permit",
    "title": "Surat Keterangan Jalan (Umum)"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "travel-permit-gov",
    "title": "Surat Keterangan Jalan"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "travel-permit-village",
    "title": "Surat Keterangan Jalan (Desa)"
  },
  {
    "flow": "permit",
    "category": null,
    "group": "permit",
    "slug": "permit-followup",
    "title": "Surat Tindak Lanjut Permohonan Izin"
  }
];
