<script setup>
// Surat Izin Orang Tua
// Template PDF: letters/marriage-women/letters/n5.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, calonSuami, calonIstri, ortuNikah } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
  ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
  calonIstri(["name", "nik", "birth", "nationality", "religion", "occupation", "address"]),
  calonSuami(["name", "nik", "birth", "nationality", "religion", "occupation", "address"]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Fotokopi KTP ayah dan ibu calon istri",
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Izin Orang Tua" code="N5" :sections="sections" :documents="documents" />
</template>
