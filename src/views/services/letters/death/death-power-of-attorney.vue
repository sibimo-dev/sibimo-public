<script setup>
// Surat Kuasa
// Template PDF: letters/death/death-power-of-attorney.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, person, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  person("attorney", "Data Penerima Kuasa", ["name", "occupation", "address"]),
  { title: "Data Almarhum/ah", fields: [f.text("deceasedName", "Nama Almarhum/ah")] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Fotokopi KTP penerima kuasa",
  DOC.suratKematian,
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Kuasa" code="KKM" :sections="sections" :documents="documents" />
</template>
