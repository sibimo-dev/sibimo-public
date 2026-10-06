<script setup>
// Surat Kuasa Sidang Waris
// Template PDF: letters/heir-power-of-attorney-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, person, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  person("attorney", "Data Penerima Kuasa", ["name", "nik", "birth", "gender", "address"]),
  { title: "Data Pewaris (Almarhum/ah)", fields: [f.text("deceasedName", "Nama Pewaris"), f.text("deceasedDeathPlace", "Tempat Meninggal")] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Fotokopi KTP penerima kuasa",
  DOC.kk,
  DOC.suratKematian,
  opt("Surat keterangan ahli waris"),
];
</script>

<template>
  <LetterWizard title="Surat Kuasa Sidang Waris" code="KAW" :sections="sections" :documents="documents" />
</template>
