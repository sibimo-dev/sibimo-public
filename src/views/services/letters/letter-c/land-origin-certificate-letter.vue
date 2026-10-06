<script setup>
// Surat Keterangan Asal Tanah
// Template PDF: letters/letter-c/land-origin-certificate-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Data Tanah", fields: [f.text("certificateNumber", "Nomor Letter C/Sertifikat"),
        f.text("ownerName", "Nama pemilik"),
        f.text("area", "Luas tanah (m²)"),
        f.text("hamlet", "Dusun"), f.text("areaInWords", "Luas (dengan huruf)"), f.text("measurementLetterNumber", "Nomor surat ukur", { optional: true }), f.date("measurementLetterDate", "Tanggal surat ukur", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  "Fotokopi Letter C / bukti kepemilikan tanah",
  opt("Fotokopi SPPT PBB"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Asal Tanah" code="KAT" :sections="sections" :documents="documents" />
</template>
