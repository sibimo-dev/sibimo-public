<script setup>
// Persetujuan Calon Pengantin
// Template PDF: letters/marriage-women/letters/n4.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, calonSuami, calonIstri } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  calonSuami(["name", "nik", "birth", "nationality", "religion", "occupation", "address"]),
  calonIstri(["name", "nik", "birth", "nationality", "religion", "occupation", "address"]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="N4" :sections="sections" :documents="documents" />
</template>
