<script setup>
// Surat Permohonan KTP
// Template PDF: letters/ktp-application-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.kk("kkNumber", "Nomor KK"), f.text("rt", "RT"), f.text("rw", "RW")]),
  { title: "Jenis Permohonan", fields: [f.select("applicationType", "Jenis Permohonan KTP", ["Baru", "Perpanjangan", "Penggantian (hilang/rusak)"])] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.kk,
  opt("Surat keterangan kehilangan dari kepolisian (bila KTP hilang)"),
  opt("KTP lama (bila rusak/perpanjangan)"),
];
</script>

<template>
  <LetterWizard title="Surat Permohonan KTP" code="KTP" :sections="sections" :documents="documents" />
</template>
