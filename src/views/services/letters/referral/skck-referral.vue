<script setup>
// Surat Keterangan Mohon SKCK
// Template PDF: letters/skck-referral-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  keperluan(),
  { title: "Keterangan Tambahan", fields: [f.text("occupationNote", "Keterangan pekerjaan", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt(DOC.pasFoto),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Mohon SKCK" code="SKCK" :sections="sections" :documents="documents" />
</template>
