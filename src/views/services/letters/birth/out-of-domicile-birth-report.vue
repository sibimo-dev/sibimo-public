<script setup>
// Laporan Kelahiran Luar Domisili
// Template PDF: letters/birth/out-of-domicile-birth-report.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC, keluarga, anak, ortu, perkawinanOrtu, saksi } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  { title: "Domisili", fields: [f.text("hamlet", "Dusun"), f.area("currentResidence", "Alamat domisili saat ini", { span: 2 })] },
  keluarga(),
  anak({ detail: true }),
  ortu("mother", "Data Ibu Kandung"),
  ortu("father", "Data Ayah Kandung"),
  perkawinanOrtu(),
  pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan bayi", { placeholder: "Contoh: Ayah, Ibu, Kakek" })]),
  saksi(1),
  saksi(2),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Surat keterangan lahir dari dokter/bidan/penolong kelahiran",
  DOC.kk,
  "Fotokopi KTP ayah dan ibu",
  DOC.akta,
  DOC.ktpSaksi,
];
</script>

<template>
  <LetterWizard title="Laporan Kelahiran Luar Domisili" code="PLD" :sections="sections" :documents="documents" />
</template>
