<script setup>
// Surat Pencatatan Kelahiran Terlambat
// Template PDF: letters/birth/late-birth-registration-approval-decree.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, person, DOC, opt, anak } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  anak(),
  { title: "Keterangan Tambahan", fields: [f.text("childBirthOrder", "Anak ke-"), f.area("lateReason", "Alasan keterlambatan pelaporan", { span: 2 })] },
  person("mother", "Data Ibu", ["name", "nik"]),
  person("father", "Data Ayah", ["name", "nik"]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Surat keterangan lahir dari dokter/bidan/penolong kelahiran",
  DOC.kk,
  "Fotokopi KTP ayah dan ibu",
  DOC.akta,
  opt("Surat pernyataan keterlambatan pelaporan"),
];
</script>

<template>
  <LetterWizard title="Surat Pencatatan Kelahiran Terlambat" code="SKT" :sections="sections" :documents="documents" />
</template>
