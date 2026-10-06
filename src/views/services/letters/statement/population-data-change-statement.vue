<script setup>
// Surat Pernyataan Perubahan Elemen Data Kependudukan
// Template PDF: letters/statement-population-data-change.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohonRingkas, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas([f.kk("kkNumber", "Nomor KK")]),
  {
      title: "Anggota Keluarga dalam KK",
      fields: [
        f.rows("familyMembers", "Daftar anggota KK", [
          { key: "name", label: "Nama" },
          { key: "nik", label: "NIK" },
          { key: "shdk", label: "SHDK", type: "select", options: OPT.shdk },
          { key: "note", label: "Keterangan", optional: true },
        ], { max: 7 }),
      ],
    },
  {
      title: "Perubahan Data",
      fields: [
        f.rows("educationJobChanges", "Perubahan pendidikan & pekerjaan", [
          { key: "name", label: "Nama anggota keluarga" },
          { key: "educationBefore", label: "Pendidikan semula", optional: true },
          { key: "educationAfter", label: "Pendidikan menjadi", optional: true },
          { key: "jobBefore", label: "Pekerjaan semula", optional: true },
          { key: "jobAfter", label: "Pekerjaan menjadi", optional: true },
          { key: "basis", label: "Dasar perubahan" },
        ], { optional: true, max: 7 }),
        f.rows("otherChanges", "Perubahan agama & lainnya", [
          { key: "name", label: "Nama anggota keluarga" },
          { key: "element", label: "Elemen data (agama, tanggal nikah, dll)" },
          { key: "before", label: "Semula" },
          { key: "after", label: "Menjadi" },
          { key: "basis", label: "Dasar perubahan" },
        ], { optional: true, max: 7 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  "Dokumen dasar perubahan (ijazah, akta, surat keterangan, dll)",
];
</script>

<template>
  <LetterWizard title="Surat Pernyataan Perubahan Elemen Data Kependudukan" code="PDP" :sections="sections" :documents="documents" />
</template>
