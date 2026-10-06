<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Pelaporan Pencatatan Kelahiran
// Template PDF: letters/birth/birth-registration-report.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { bayi, dokBayi } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = bayi();

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = dokBayi();
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pelaporan Pencatatan Kelahiran" code="PCL" :sections="sections" :documents="documents" />
</template>
