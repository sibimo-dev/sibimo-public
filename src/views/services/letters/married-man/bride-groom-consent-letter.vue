<script setup>
// Persetujuan Calon Pengantin
// Template PDF: letters/married-man/bride-groom-consent-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, calonSuami, calonIstri } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  calonSuami(),
  calonIstri(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Fotokopi KTP calon suami",
  "Fotokopi KTP calon istri",
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="SCM" :sections="sections" :documents="documents" />
</template>
