<script setup>
// Surat Pernyataan Tanggung Jawab Mutlak Perkawinan Belum Tercatat
// Template PDF: letters/unregistered-marriage-responsibility-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, person, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  person("husband", "Data Suami", ["name", "nik", "birth", "occupation", "address"]),
  person("wife", "Data Istri", ["name", "nik", "birth", "occupation", "address"]),
  {
      title: "Data Perkawinan & Anak",
      fields: [
        f.date("marriageDate", "Tanggal Menikah"),
        f.rows("marriageWitnesses", "Saksi perkawinan", [{ key: "name", label: "Nama" }, { key: "nik", label: "NIK" }], { min: 2, max: 2 }),
        f.rows("children", "Anak (bila ada)", [
          { key: "name", label: "Nama" },
          { key: "nik", label: "NIK", optional: true },
          { key: "birthCertificateNumber", label: "No. Akta Kelahiran", optional: true },
          { key: "shdk", label: "Status dalam Keluarga", type: "select", options: OPT.shdk },
        ], { optional: true, max: 6 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Fotokopi KTP suami dan istri",
  DOC.kk,
  DOC.ktpSaksi,
];
</script>

<template>
  <LetterWizard title="Surat Pernyataan Tanggung Jawab Mutlak Perkawinan Belum Tercatat" code="PNB" :sections="sections" :documents="documents" />
</template>
