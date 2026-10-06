<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Jalan (kop surat dipilih petugas/admin, bukan pemohon)
// Template PDF: letters/travel-permit-letter-gov.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon([f.kk("kkNumber", "Nomor KK")]),
  keperluan("Tujuan perjalanan", "Tempat tujuan"),
  { title: "Waktu Perjalanan", fields: [f.date("departDate", "Tanggal berangkat", { optional: true }), f.date("returnDate", "Tanggal kembali", { optional: true })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Surat tugas/undangan dari instansi"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Jalan" code="IPI" :sections="sections" :documents="documents" />
</template>