<script setup>
// Surat Keterangan Mohon Akta Kematian
// Template PDF: letters/death/death-general-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { pemohon, DOC, almarhum } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  almarhum(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.suratKematian,
  DOC.ktp,
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Mohon Akta Kematian" code="PKU" :sections="sections" :documents="documents" />
</template>
