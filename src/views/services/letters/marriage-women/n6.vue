<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Kematian
// Template PDF: letters/marriage-women/letters/n6.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, N7, calonIstri, f, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [person("exHusband", "Data Suami Terdahulu (Almarhum)", N7, [f.text("exHusbandBin", "Bin (nama ayah)"), f.date("exHusbandDiedAt", "Tanggal Meninggal"), f.text("exHusbandDiedPlace", "Tempat Meninggal")]), calonIstri()];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="N6" :sections="sections" :documents="documents" />
</template>
