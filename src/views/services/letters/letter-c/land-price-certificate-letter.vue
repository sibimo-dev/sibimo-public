<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Harga Tanah
// Template PDF: letters/letter-c/land-price-certificate-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, DOC_LETTER_C, DOC_PBB, f, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohon(), { title: "Data Tanah", fields: [f.text("certificateNumber", "Nomor Letter C/Sertifikat/NIB"), f.text("ownerName", "Nama pemilik"), f.text("area", "Luas tanah (m²)"),
      f.text("hamlet", "Padukuhan"), f.text("village", "Kalurahan/Desa", { default: "Bimomartani" }), f.text("district", "Kapanewon", { default: "Ngemplak" }), f.text("regency", "Kota/Kabupaten", { default: "Sleman" })] },
     { title: "Harga Pasaran", fields: [f.text("priceMin", "Harga pasaran terendah (Rp)", { optional: true }), f.text("priceMax", "Harga pasaran tertinggi (Rp)", { optional: true })] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Harga Tanah" code="KHT" :sections="sections" :documents="documents" />
</template>
