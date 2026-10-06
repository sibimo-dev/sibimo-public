<script setup>
// Surat Penawaran Sewa Kontrak Gedung BRI Unit Ngemplak II
// Template PDF: letters/lease-offer-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  { title: "Penerima Penawaran", fields: [f.text("recipient", "Ditujukan kepada"), f.area("recipientAddress", "Alamat penerima", { span: 2 })] },
  { title: "Objek Sewa", fields: [f.text("buildingName", "Nama bangunan/tanah"), f.text("durationYears", "Lama sewa (tahun)"), f.area("buildingAddress", "Alamat bangunan/tanah", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Bukti kepemilikan/penguasaan bangunan atau tanah",
];
</script>

<template>
  <LetterWizard title="Surat Penawaran Sewa Kontrak Gedung BRI Unit Ngemplak II" code="SPS" :sections="sections" :documents="documents" />
</template>
