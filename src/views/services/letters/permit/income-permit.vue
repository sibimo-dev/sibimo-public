<script setup>
// Surat Keterangan Penghasilan
// Template PDF: letters/income-permit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Keterangan Penghasilan", fields: [f.text("income", "Penghasilan per bulan", { placeholder: "Contoh: Rp 3.000.000" })] },
  keperluan("Keperluan", null),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Slip gaji/bukti usaha"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Penghasilan" code="KPH" :sections="sections" :documents="documents" />
</template>
