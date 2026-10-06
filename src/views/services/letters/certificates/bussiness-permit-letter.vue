<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Usaha
// Template PDF: letters/bussiness-permit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  { title: "Data Usaha", fields: [f.text("businessName", "Nama usaha", { optional: true }), f.text("businessType", "Jenis usaha"), f.area("businessAddress", "Alamat usaha", { span: 2 })] },
  keperluan(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  "Foto tempat usaha",
  opt("NPWP/NIB"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Usaha" code="IZU" :sections="sections" :documents="documents" />
</template>
