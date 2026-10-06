<script setup>
// Surat Keterangan Kematian
// Template PDF: letters/marriage-women/letters/n6.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, person, DOC, calonIstri } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  person("exHusband", "Data Suami Terdahulu (Almarhum)", ["name", "nik", "birth", "nationality", "religion", "occupation", "address"], [f.text("exHusbandBin", "Bin (nama ayah)"), f.date("exHusbandDiedAt", "Tanggal Meninggal"), f.text("exHusbandDiedPlace", "Tempat Meninggal")]),
  calonIstri(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.suratKematian,
  DOC.ktp,
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="N6" :sections="sections" :documents="documents" />
</template>
