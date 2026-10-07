<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Formulir Biodata Penduduk WNI (Per Keluarga)
// Template PDF: letters/family-biodata-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, OPT, pemohonRingkas, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohonRingkas([f.kk("kkNumber", "Nomor KK"), f.text("rt", "RT"), f.text("rw", "RW")]),
  {
      title: "Anggota Keluarga",
      fields: [
        f.rows("members", "Daftar anggota keluarga", [
          { key: "name", label: "Nama Lengkap" },
          { key: "nik", label: "NIK" },
          { key: "gender", label: "Jenis Kelamin", type: "select", options: OPT.gender },
          { key: "birthPlace", label: "Tempat Lahir" },
          { key: "birthDate", label: "Tanggal Lahir", type: "date" },
          { key: "religion", label: "Agama", type: "select", options: OPT.religion },
          { key: "education", label: "Pendidikan", type: "select", options: OPT.education },
          { key: "occupation", label: "Pekerjaan" },
          { key: "maritalStatus", label: "Status Perkawinan", type: "select", options: OPT.marital },
          { key: "shdk", label: "Status Hubungan dalam Keluarga", type: "select", options: OPT.shdk },
        ], { max: 8 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  opt(DOC.akta),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Formulir Biodata Penduduk WNI (Per Keluarga)" code="BDK" :sections="sections" :documents="documents" />
</template>
