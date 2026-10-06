<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Umum (kop surat dipilih petugas/admin, bukan pemohon)
// Template PDF: letters/general-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  { title: "Isi Pernyataan", fields: [f.area("purpose", "Hal yang dinyatakan", { span: 2, placeholder: "Tuliskan isi pernyataan" })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  opt(DOC.bukti),
  opt("Surat permintaan dari instansi"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Umum" code="SPU" :sections="sections" :documents="documents" />
</template>