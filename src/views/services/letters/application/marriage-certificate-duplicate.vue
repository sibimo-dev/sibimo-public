<script setup>
// Surat Pengantar Duplikat Nikah
// Template PDF: letters/marriage-certificate-duplicate-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Data Akta Nikah", fields: [f.text("marriageCertificateNumber", "Nomor Akta/Buku Nikah", { optional: true }), f.date("marriageDate", "Tanggal Menikah", { optional: true })] },
  keperluan("Alasan permohonan duplikat", "Surat ditujukan kepada"),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  opt("Surat kehilangan dari kepolisian (bila hilang)"),
  opt("Fotokopi buku nikah (bila rusak)"),
];
</script>

<template>
  <LetterWizard title="Surat Pengantar Duplikat Nikah" code="DAN" :sections="sections" :documents="documents" />
</template>
