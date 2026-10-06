<script setup>
// Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)
// Template PDF: letters/death/death-report-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { DOC, keluarga, saksi, almarhum, pelaporKematian } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  keluarga(),
  almarhum(),
  pelaporKematian(),
  saksi(1),
  saksi(2),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.suratKematian,
  DOC.kk,
  "Fotokopi KTP almarhum/almarhumah",
  "Fotokopi KTP pelapor",
  DOC.ktpSaksi,
];
</script>

<template>
  <LetterWizard title="Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)" code="LPM" :sections="sections" :documents="documents" />
</template>
