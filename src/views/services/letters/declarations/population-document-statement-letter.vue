<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Pernyataan Tidak Memiliki Dokumen Kependudukan
// Template PDF: letters/population-document-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohonRingkas, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohonRingkas([f.text("birthPlace", "Tempat Lahir"), f.date("birthDate", "Tanggal Lahir"), f.text("fatherName", "Nama Ayah"), f.text("motherName", "Nama Ibu")]),
  { title: "Pernyataan", fields: [f.area("documentStatement", "Dokumen kependudukan yang dinyatakan", { span: 2, placeholder: "Contoh: akta kelahiran hilang/belum dimiliki" })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pernyataan Tidak Memiliki Dokumen Kependudukan" code="PDK" :sections="sections" :documents="documents" />
</template>
