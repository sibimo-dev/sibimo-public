<script setup>
// Pengantar Nikah
// Template PDF: letters/marriage-women/letters/n1.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, DOC, calonIstri, ortuNikah } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  calonIstri(),
  { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"]), f.text("exHusbandName", "Nama suami terdahulu (bila janda)", { optional: true })] },
  ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
  ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  DOC.aktaLahir,
];
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="N1" :sections="sections" :documents="documents" />
</template>
