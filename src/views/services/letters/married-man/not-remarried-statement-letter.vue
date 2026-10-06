<script setup>
// Surat Keterangan Belum Menikah Lagi
// Template PDF: letters/married-man/not-remarried-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })]),
  { title: "Data Pendaftaran Nikah", fields: [f.text("registrationNumber", "Nomor pendaftaran", { optional: true }), f.date("registrationDate", "Tanggal pendaftaran", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  opt("Akta cerai/surat kematian pasangan terdahulu"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Menikah Lagi" code="PBM" :sections="sections" :documents="documents" />
</template>
