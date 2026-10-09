<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Permohonan Akta Kematian
// Template PDF: letters/death/death-certificate-application.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, deathDeceased, deathParent, keluarga } from "@/data/letterFields";

// Langkah 1: A. Keluarga, B. Jenazah, C. Ibu Kandung, D. Ayah Kandung (E. Pelapor diisi petugas)
export const sections = [
  keluarga(),
  deathDeceased(["nik", "name", "birthPlace", "birthDate", "deathPlace", "deathDate", "gender"], "Data Jenazah", { deathDate: "Tanggal Kematian" }),
  deathParent("mother", "Data Ibu Kandung", ["nik", "name", "address"]),
  deathParent("father", "Data Ayah Kandung", ["nik", "name", "address"]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Akta Kematian" code="AKM" :sections="sections" :documents="documents" />
</template>