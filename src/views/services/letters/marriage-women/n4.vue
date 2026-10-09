<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Persetujuan Calon Pengantin
// Template PDF: letters/marriage-women/letters/n4.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, N7, calonIstri, calonSuami } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [calonSuami(N7), calonIstri(N7)];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="N4" :sections="sections" :documents="documents" />
</template>
