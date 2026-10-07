<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Pernyataan Permohonan Data Letter C
// Template PDF: letters/letter-c/letter-c-data-statement-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, DOC_LETTER_C, DOC_PBB, f, opt, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohon(), { title: "Data Letter C", fields: [f.text("hamlet", "Dusun"), f.text("letterCOwnerName", "Nama pemilik pada Letter C"), f.text("hamletHeadName", "Nama kepala dusun", { optional: true })] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB,
     opt("Akta kematian pemilik Letter C (untuk warisan; sebelum 2010 boleh surat keterangan kematian)"),
     opt("Fotokopi KTP & KK ahli waris (untuk warisan)"),
     opt("Fotokopi KTP & KK pemilik Letter C (untuk konversi)")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pernyataan Permohonan Data Letter C" code="PLC" :sections="sections" :documents="documents" />
</template>
