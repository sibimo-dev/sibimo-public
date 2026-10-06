<script setup>
// Surat Permohonan Cerai
// Template PDF: letters/divorce-lawsuit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, person, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  { title: "Pengadilan Tujuan", fields: [f.text("courtName", "Nama Pengadilan"), f.text("courtCity", "Kota Pengadilan")] },
  person("spouse", "Data Pasangan (Tergugat)", ["name", "birth", "occupation", "address"], [f.text("marriageCertNumber", "Nomor Akta/Buku Nikah")]),
  {
      title: "Alasan & Saksi",
      fields: [
        f.rows("reasons", "Alasan gugatan", [{ key: "text", label: "Alasan" }], { max: 6 }),
        f.rows("witnesses", "Saksi", [{ key: "name", label: "Nama Saksi" }, { key: "address", label: "Alamat" }], { optional: true, max: 4 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.akta,
  opt(DOC.bukti),
];
</script>

<template>
  <LetterWizard title="Surat Permohonan Cerai" code="GCR" :sections="sections" :documents="documents" />
</template>
