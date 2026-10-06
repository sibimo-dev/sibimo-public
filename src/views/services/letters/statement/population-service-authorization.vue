<script setup>
// Surat Kuasa Dalam Pelayanan Administrasi Kependudukan
// Template PDF: letters/population-service-authorization-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, person, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  person("attorney", "Data Penerima Kuasa", ["name", "nik", "birth", "occupation", "address"]),
  { title: "Kuasa", fields: [f.area("scope", "Layanan kependudukan yang dikuasakan", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Fotokopi KTP penerima kuasa",
  DOC.kk,
];
</script>

<template>
  <LetterWizard title="Surat Kuasa Dalam Pelayanan Administrasi Kependudukan" code="KPK" :sections="sections" :documents="documents" />
</template>
