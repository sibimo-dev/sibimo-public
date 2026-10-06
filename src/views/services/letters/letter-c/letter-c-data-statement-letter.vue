<script setup>
// Surat Pernyataan Permohonan Data Letter C
// Template PDF: letters/letter-c/letter-c-data-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Data Letter C", fields: [f.text("hamlet", "Dusun"), f.text("letterCOwnerName", "Nama pemilik pada Letter C"), f.text("hamletHeadName", "Nama kepala dusun", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  "Fotokopi Letter C / bukti kepemilikan tanah",
  opt("Fotokopi SPPT PBB"),
];
</script>

<template>
  <LetterWizard title="Surat Pernyataan Permohonan Data Letter C" code="PLC" :sections="sections" :documents="documents" />
</template>
