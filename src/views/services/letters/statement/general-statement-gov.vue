<script setup>
// Surat Keterangan Umum (Kop Pemerintah Kalurahan)
// Template PDF: letters/general-statement-letter-gov.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Isi Pernyataan", fields: [f.area("purpose", "Hal yang dinyatakan", { span: 2, placeholder: "Tuliskan isi pernyataan" })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  opt("Surat permintaan dari instansi"),
  opt(DOC.bukti),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Umum (Kop Pemerintah Kalurahan)" code="SPI" :sections="sections" :documents="documents" />
</template>
