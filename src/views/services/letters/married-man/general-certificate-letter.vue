<script setup>
// Surat Pengantar Tes Kesehatan
// Template PDF: letters/married-man/general-certificate-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, keperluan, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" }), f.text("behavior", "Kelakuan", { default: "Baik" })]),
  keperluan(),
  { title: "Keterangan Tambahan", fields: [f.area("additionalNote", "Keterangan lain-lain", { span: 2, optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<template>
  <LetterWizard title="Surat Pengantar Tes Kesehatan" code="KUM" :sections="sections" :documents="documents" />
</template>
