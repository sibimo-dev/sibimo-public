<script setup>
// Surat Keterangan Numpang Nikah
// Template PDF: letters/marriage-women/letters/numpang-nikah.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, calonSuami, calonIstri } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  calonIstri(),
  calonSuami(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Numpang Nikah" code="PNN" :sections="sections" :documents="documents" />
</template>
