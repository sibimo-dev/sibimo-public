<script setup>
// Surat Keterangan Numpang Nikah
// Template PDF: letters/married-man/marriage-lodging-certificate-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, person, DOC, opt, akad } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.text("applicantBin", "Bin/Binti (nama ayah)"), f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })]),
  person("spouse", "Data Calon Pasangan", ["name", "nik", "birth", "nationality", "religion", "occupation", "address"], [f.text("spouseBin", "Bin/Binti (nama ayah)")]),
  { title: "Tempat Menikah", fields: [f.text("marriagePlace", "KUA/tempat akad nikah tujuan", { span: 2 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Fotokopi KTP calon pasangan"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Numpang Nikah" code="KNN" :sections="sections" :documents="documents" />
</template>
