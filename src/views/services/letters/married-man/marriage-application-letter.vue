<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Permohonan Kehendak Nikah
// Template PDF: letters/married-man/marriage-application-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, akad, calonPengantin, pemohonRingkas } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohonRingkas(), calonPengantin(), akad()];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, "Fotokopi KTP calon pasangan", DOC.pasFoto, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Kehendak Nikah" code="KHN" :sections="sections" :documents="documents" />
</template>
