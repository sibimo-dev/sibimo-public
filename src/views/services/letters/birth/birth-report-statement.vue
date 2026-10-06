<script setup>
// Laporan Kelahiran
// Template PDF: letters/birth/birth-report-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC, opt, anak, ortu } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  anak({ detail: true }),
  {
      title: "Keterangan Persalinan",
      fields: [
        f.text("deliveryAddress", "Alamat tempat dilahirkan", { span: 2 }),
        f.text("gestationalAge", "Usia kehamilan (minggu)"),
        f.text("deliveryMethod", "Cara persalinan", { placeholder: "Normal/Caesar" }),
        f.text("deliveryCost", "Biaya persalinan", { optional: true }),
      ],
    },
  ortu("mother", "Data Ibu"),
  ortu("father", "Data Ayah"),
  pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan bayi")]),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.kk,
  "Fotokopi KTP ayah dan ibu",
  DOC.akta,
  opt("Surat keterangan lahir dari penolong kelahiran"),
];
</script>

<template>
  <LetterWizard title="Laporan Kelahiran" code="PLK" :sections="sections" :documents="documents" />
</template>
