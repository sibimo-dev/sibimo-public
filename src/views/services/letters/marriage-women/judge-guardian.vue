<script setup>
// Surat Keterangan Wali Hakim
// Template PDF: letters/marriage-women/letters/judge-guardian.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, DOC, opt, calonSuami, calonIstri } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  calonIstri(),
  calonSuami(),
  { title: "Alasan Wali Hakim", fields: [f.area("judgeGuardianReason", "Sebab dilangsungkan dengan wali hakim", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  DOC.aktaLahir,
  opt("Surat keterangan kematian/ketiadaan wali"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Wali Hakim" code="PWH" :sections="sections" :documents="documents" />
</template>
