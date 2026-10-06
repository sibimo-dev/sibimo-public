<script setup>
// Surat Izin Orang Tua
// Template PDF: letters/married-man/parental-consent-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, ortuNikah } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  ortuNikah("father", "Data Ayah", "Bin (nama ayah dari ayah)"),
  ortuNikah("mother", "Data Ibu", "Binti (nama ayah dari ibu)"),
  ortuNikah("child", "Data Anak yang Akan Menikah", "Bin/Binti (nama ayah)"),
  ortuNikah("childSpouse", "Data Calon Pasangan Anak", "Bin/Binti (nama ayah)"),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Fotokopi KTP ayah dan ibu",
  "Fotokopi KTP anak",
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Izin Orang Tua" code="SOT" :sections="sections" :documents="documents" />
</template>
