<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Permohonan Tinggal Sementara
// Template PDF: letters/temporary-stay-application-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  {
    title: "Tempat Tinggal Sementara",
    fields: [
      f.area("destinationAddress", "Alamat tinggal sementara", { span: 2 }),
      f.text("destinationRt", "RT"),
      f.text("destinationRw", "RW"),
      f.text("destinationHamlet", "Dusun"),
      f.area("reason", "Alasan tinggal sementara", { span: 2 }),
      f.text("stayDuration", "Lama tinggal sementara"),
    ],
  },
  {
    title: "Pemilik / Penanggung Jawab Tempat Tinggal",
    fields: [
      f.text("hostName", "Nama pemilik/penanggung jawab"),
      f.text("hostRelation", "Hubungan dengan pemohon", { optional: true }),
    ],
  },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Surat keterangan kos/kontrak/tempat tinggal"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Tinggal Sementara" code="TSM" :sections="sections" :documents="documents" />
</template>
