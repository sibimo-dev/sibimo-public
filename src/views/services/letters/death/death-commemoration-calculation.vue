<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Perhitungan Selamatan 3 Hari Sampai 1000 Hari
// Template PDF: letters/death/death-commemoration-calculation.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, f, opt, pemohonRingkas } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohonRingkas(), { title: "Data Almarhum/ah", fields: [f.text("deceasedName", "Nama Almarhum/ah"), f.area("deceasedAddress", "Alamat", { span: 2 }), f.date("deathDate", "Tanggal Meninggal"), f.time("deathTime", "Jam Meninggal")] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, opt(DOC.suratKematian)];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Perhitungan Selamatan 3 Hari Sampai 1000 Hari" code="HPK" :sections="sections" :documents="documents" />
</template>
