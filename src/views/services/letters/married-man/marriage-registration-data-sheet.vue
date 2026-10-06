<script setup>
// Data Isian Pendaftaran Nikah
// Template PDF: letters/married-man/marriage-registration-data-sheet.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, person, DOC, opt, akad, calonSuami, calonIstri, ortuNikah, optional } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  akad(),
  calonSuami(),
  { title: "Status Calon Suami", fields: [f.select("groomStatus", "Status", ["Jejaka", "Duda", "Beristri"])] },
  ortuNikah("groomFather", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"),
  ortuNikah("groomMother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)"),
  calonIstri(),
  { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"])] },
  ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
  ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
  optional(person("groomPrev", "Data Istri Terdahulu Calon Suami (bila duda)", ["name", "nik", "birth", "nationality", "religion", "occupation", "address"], [f.date("groomPrevDeathDate", "Tanggal Meninggal"), f.text("groomPrevDeathPlace", "Tempat Meninggal")])),
  optional(person("bridePrev", "Data Suami Terdahulu Calon Istri (bila janda)", ["name", "nik"], [f.date("bridePrevDeathDate", "Tanggal Meninggal"), f.text("bridePrevDeathPlace", "Tempat Meninggal")])),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.aktaLahir,
  DOC.pasFoto,
  opt("Fotokopi KTP orang tua kedua calon"),
  opt("Akta cerai/surat kematian pasangan terdahulu"),
];
</script>

<template>
  <LetterWizard title="Data Isian Pendaftaran Nikah" code="DPN" :sections="sections" :documents="documents" />
</template>
