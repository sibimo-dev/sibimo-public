<script setup>
// Surat Pernyataan Beda Nama/Identitas
// Template PDF: letters/identity-discrepancy-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, person, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  person("other", "Identitas Lain yang Berbeda", ["name", "nik", "address"]),
  { title: "Uraian", fields: [f.area("discrepancy", "Penjelasan perbedaan identitas", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  "Dokumen yang memuat identitas berbeda (ijazah, akta, dll)",
];
</script>

<template>
  <LetterWizard title="Surat Pernyataan Beda Nama/Identitas" code="PPI" :sections="sections" :documents="documents" />
</template>
