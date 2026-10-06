<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Mohon Akta Kelahiran
// Template PDF: letters/birth/birth-certificate-referral-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, f, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohon(), { title: "Data Anak", fields: [f.text("childName", "Nama anak")] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = ["Surat keterangan lahir dari dokter/bidan", DOC.ktp, DOC.kk, DOC.akta];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Mohon Akta Kelahiran" code="PAK" :sections="sections" :documents="documents" />
</template>
