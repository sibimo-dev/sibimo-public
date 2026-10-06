<script setup>
// Surat Keterangan Kematian
// Template PDF: letters/married-man/death-certificate-for-marriage-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, person, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  person("deceased", "Data Pasangan Terdahulu (Almarhum/ah)", ["name", "birth", "nationality", "religion", "occupation", "address"], [f.date("deathDate", "Tanggal Meninggal"), f.text("deathPlace", "Tempat Meninggal")]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.suratKematian,
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="KKN" :sections="sections" :documents="documents" />
</template>
