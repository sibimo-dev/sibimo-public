<script setup>
// Permohonan Kehendak Nikah
// Template PDF: letters/marriage-women/letters/n2.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC, opt, akad } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  { title: "Calon Pengantin", fields: [f.text("groomName", "Nama Calon Suami"), f.text("brideName", "Nama Calon Istri")] },
  akad(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Surat pengantar nikah dari desa/kelurahan (N1)",
  "Persetujuan calon mempelai (N3)",
  DOC.ktp,
  DOC.aktaLahir,
  DOC.kk,
  DOC.pasFoto,
  opt("Surat keterangan wali nikah"),
];
</script>

<template>
  <LetterWizard title="Permohonan Kehendak Nikah" code="N2" :sections="sections" :documents="documents" />
</template>
