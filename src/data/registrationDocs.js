/* Surat/dokumen yang bisa dipilih saat mendaftar sebagai warga baru.
   `types` = jenis pendaftaran yang memunculkan dokumen ini (lihat RESIDENT_TYPES; satu dokumen boleh untuk beberapa jenis).
   `hue` = warna kartu/ikon, dibuat berbeda untuk tiap dokumen (nama hue ada di layout/pastel.js).
   `fields` = isian tambahan yang muncul HANYA jika dokumen itu dipilih. */
export const REGISTRATION_DOCS = [
  {
    value: "ktp", types: ["tetap"], hue: "sky", label: "KTP", icon: "pi pi-id-card", badge: "Umum",
    description: "Pendaftaran / pembuatan KTP.",
    fields: [{ key: "ktpReason", label: "Alasan Pembuatan", type: "select", options: ["Baru", "Hilang", "Rusak", "Perubahan Data"] }],
  },
  {
    value: "kk", types: ["tetap"], hue: "emerald", label: "Kartu Keluarga", icon: "pi pi-users", badge: "Sosial",
    description: "Masuk / pembuatan Kartu Keluarga.",
    fields: [
      { key: "headOfFamily", label: "Nama Kepala Keluarga", type: "text" },
      { key: "familyRelation", label: "Hubungan dalam Keluarga", type: "select", options: ["Kepala Keluarga", "Istri", "Anak", "Orang Tua", "Famili Lain"] },
    ],
  },
  {
    value: "akta-kelahiran", types: ["tetap"], hue: "rose", label: "Akta Kelahiran", icon: "pi pi-heart", badge: "Sosial",
    description: "Pencatatan data kelahiran.",
    fields: [
      { key: "fatherName", label: "Nama Ayah", type: "text" },
      { key: "motherName", label: "Nama Ibu", type: "text" },
    ],
  },
  {
    value: "surat-pindah", types: ["tetap"], hue: "orange", label: "Surat Pindah Datang", icon: "pi pi-map-marker", badge: "Umum",
    description: "Untuk warga yang pindah ke kelurahan ini.",
    fields: [
      { key: "previousAddress", label: "Alamat Asal", type: "textarea" },
      { key: "moveDate", label: "Tanggal Pindah", type: "date" },
    ],
  },
  {
    value: "permohonan-pindah-datang", types: ["tetap"], hue: "teal", label: "Formulir Permohonan Pindah Datang WNI", icon: "pi pi-sign-in", badge: "Umum",
    description: "Permohonan pindah datang bagi WNI yang akan menjadi warga baru.",
    fields: [
      { key: "arrivalPreviousAddress", label: "Alamat Asal", type: "textarea" },
      { key: "arrivalMoveDate", label: "Tanggal Pindah", type: "date" },
    ],
  },
  {
    value: "permohonan-penduduk-sementara-skts", types: ["sementara"], hue: "amber", label: "Permohonan Menjadi Penduduk Sementara / SKTS", icon: "pi pi-clock", badge: "Umum",
    description: "Permohonan menjadi penduduk sementara (SKTS) bagi pendatang.",
    fields: [
      { key: "sktsPreviousAddress", label: "Alamat Asal", type: "textarea" },
      { key: "sktsPurpose", label: "Tujuan Tinggal Sementara", type: "text" },
      { key: "sktsStartDate", label: "Tanggal Mulai Tinggal", type: "date" },
    ],
  },
  {
    value: "permohonan-tinggal-sementara", types: ["tinggal-sementara"], hue: "fuchsia", label: "Permohonan Tinggal Sementara", icon: "pi pi-home", badge: "Umum",
    description: "Permohonan tinggal sementara di wilayah ini.",
    fields: [
      { key: "stayPreviousAddress", label: "Alamat Asal", type: "textarea" },
      { key: "stayPurpose", label: "Tujuan Tinggal Sementara", type: "text" },
      { key: "stayStartDate", label: "Tanggal Mulai Tinggal", type: "date" },
    ],
  },
  {
    value: "pengantar-pindah-wni", types: ["tetap"], hue: "lime", label: "Surat Pengantar Permohonan Pindah WNI & Formulir Keterangan Pindah WNI (Kop Dukcapil)", icon: "pi pi-file-export", badge: "Umum",
    fields: [
      { key: "moveCoverPreviousAddress", label: "Alamat Asal", type: "textarea" },
      { key: "moveCoverDate", label: "Tanggal Pindah", type: "date" },
      { key: "moveCoverReason", label: "Alasan Pindah", type: "text" },
    ],
  },
  {
    value: "akta-nikah", types: ["tetap"], hue: "violet", label: "Akta / Buku Nikah", icon: "pi pi-star", badge: "Ekonomi",
    description: "Pencatatan status perkawinan.",
    fields: [
      { key: "spouseName", label: "Nama Pasangan", type: "text" },
      { key: "marriageDate", label: "Tanggal Menikah", type: "date" },
    ],
  },
];

/* Jenis pendaftaran yang dipilih pada pop-up setelah NIK tidak ditemukan.
   Menentukan dokumen mana yang tampil di langkah "Pilih Surat" (lewat `types` di REGISTRATION_DOCS). */
export const RESIDENT_TYPES = [
  { value: "tetap", label: "Penduduk Tetap", description: "Pindah dan menetap di kalurahan ini.", icon: "pi pi-home", hue: "emerald" },
  { value: "sementara", label: "Penduduk Sementara", description: "Pendatang yang tinggal sementara dengan SKTS.", icon: "pi pi-clock", hue: "amber" },
  { value: "tinggal-sementara", label: "Tinggal Sementara", description: "Tinggal sementara di wilayah ini.", icon: "pi pi-map-marker", hue: "sky" },
];

export const residentTypeOf = (value) => RESIDENT_TYPES.find((t) => t.value === value) ?? null;

// Tanpa jenis (mis. halaman dibuka langsung lewat URL) → tampilkan semua dokumen.
export const docsForType = (type) => (type ? REGISTRATION_DOCS.filter((d) => d.types.includes(type)) : REGISTRATION_DOCS);