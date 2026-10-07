<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Pengantar Nikah
// Template PDF: letters/marriage-women/letters/n1.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, calonIstri, f, ortuNikah } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [calonIstri(),
     { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"]), f.text("exHusbandName", "Nama suami terdahulu (bila janda)", { optional: true })] },
     ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)")];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="N1" :sections="sections" :documents="documents" />
</template>
