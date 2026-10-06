<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Keramaian
// Template PDF: letters/event-permit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  {
      title: "Data Acara",
      fields: [
        f.text("eventObjective", "Nama/tujuan acara"),
        f.date("eventDate", "Tanggal acara"),
        f.time("eventTime", "Jam acara"),
        f.text("eventPlace", "Tempat acara"),
        f.text("eventParticipants", "Perkiraan jumlah peserta"),
        f.text("responsiblePerson", "Penanggung jawab acara"),
      ],
    },
  keperluan(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  "Proposal/rincian acara",
  opt("Surat izin pemilik tempat"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Keramaian" code="IZK" :sections="sections" :documents="documents" />
</template>
