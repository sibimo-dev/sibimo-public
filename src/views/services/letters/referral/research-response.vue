<script setup>
// Surat Balasan Penelitian
// Template PDF: letters/research-response-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  {
      title: "Data Peneliti",
      fields: [
        f.text("researcherName", "Nama peneliti", { from: "fullName" }),
        f.text("nim", "NIM/NIP"),
        f.text("studyProgram", "Program studi"),
        f.text("faculty", "Fakultas"),
      ],
    },
  {
      title: "Permohonan Penelitian",
      fields: [
        f.text("recipient", "Asal instansi/universitas"),
        f.text("refNumber", "Nomor surat permohonan dari kampus"),
        f.area("researchTopic", "Judul/topik penelitian", { span: 2 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Surat permohonan izin penelitian dari kampus",
  opt("Proposal penelitian singkat"),
];
</script>

<template>
  <LetterWizard title="Surat Balasan Penelitian" code="BIP" :sections="sections" :documents="documents" />
</template>
