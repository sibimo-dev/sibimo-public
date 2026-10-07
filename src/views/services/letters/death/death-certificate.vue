<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Kematian
// Template PDF: letters/death/death-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { dokJenazah, jenazah } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = jenazah();

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = dokJenazah();
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="KKT" :sections="sections" :documents="documents" />
</template>
