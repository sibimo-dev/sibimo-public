<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Legalisasi
// Template PDF: letters/legalization-register.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, OPT, pemohonRingkas, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohonRingkas(),
  { title: "Register", fields: [f.text("registerYear", "Tahun Register", { placeholder: "Contoh: 2026" })] },
  {
      title: "Data Penduduk yang Dilegalisasi",
      fields: [
        f.rows("people", "Daftar penduduk", [
          { key: "name", label: "Nama Lengkap" },
          { key: "nik", label: "NIK" },
          { key: "kkNumber", label: "Nomor KK" },
          { key: "gender", label: "Jenis Kelamin", type: "select", options: OPT.gender },
          { key: "birthPlace", label: "Tempat Lahir" },
          { key: "birthDate", label: "Tanggal Lahir", type: "date" },
          { key: "religion", label: "Agama", type: "select", options: OPT.religion },
          { key: "maritalStatus", label: "Status Perkawinan", type: "select", options: OPT.marital },
          { key: "familyStatus", label: "Status dalam Keluarga", type: "select", options: OPT.shdk },
          { key: "education", label: "Pendidikan", type: "select", options: OPT.education },
          { key: "occupation", label: "Pekerjaan" },
          { key: "address", label: "Alamat (RT/RW)" },
        ]),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  opt(DOC.bukti),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Legalisasi" code="LGL" :sections="sections" :documents="documents" />
</template>
