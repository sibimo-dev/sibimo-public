<script setup>
// Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian
// Template PDF: letters/death/death-data-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC, almarhum } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  almarhum(),
  { title: "Pernyataan", fields: [f.area("statement", "Isi pernyataan", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.suratKematian,
  DOC.ktp,
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian" code="PDM" :sections="sections" :documents="documents" />
</template>
