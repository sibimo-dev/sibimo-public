<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Persetujuan Calon Pengantin
// Template PDF: letters/married-man/bride-groom-consent-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, calonIstri, calonSuami } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [calonSuami(), calonIstri()];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = ["Fotokopi KTP calon suami", "Fotokopi KTP calon istri", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="SCM" :sections="sections" :documents="documents" />
</template>
