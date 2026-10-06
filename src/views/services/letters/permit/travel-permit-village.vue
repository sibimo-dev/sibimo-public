<script setup>
// Surat Keterangan Jalan (Desa)
// Template PDF: letters/travel-permit-letter-vill.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, keperluan, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.kk("kkNumber", "Nomor KK")]),
  keperluan("Tujuan perjalanan", "Tempat tujuan"),
  { title: "Waktu Perjalanan", fields: [f.date("departDate", "Tanggal berangkat", { optional: true }), f.date("returnDate", "Tanggal kembali", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Jalan (Desa)" code="IPD" :sections="sections" :documents="documents" />
</template>
