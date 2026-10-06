<script setup>
// Surat Tindak Lanjut Permohonan Izin
// Template PDF: letters/permit-followup-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  { title: "Surat Sebelumnya", fields: [f.text("recipient", "Ditujukan kepada"), f.area("recipientAddress", "Alamat penerima", { span: 2 }), f.text("refNumber", "Nomor surat izin sebelumnya")] },
  { title: "Acara", fields: [f.date("eventDate", "Tanggal"), f.time("eventTime", "Jam"), f.text("eventPlace", "Tempat"), f.text("eventObjective", "Tujuan acara")] },
  { title: "Tembusan & Saksi", fields: [f.rows("tembusan", "Tembusan", [{ key: "name", label: "Ditujukan kepada" }], { optional: true, max: 5 }), f.rows("witnesses", "Saksi", [{ key: "name", label: "Nama" }], { optional: true, max: 4 })] },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Salinan surat izin sebelumnya",
];
</script>

<template>
  <LetterWizard title="Surat Tindak Lanjut Permohonan Izin" code="TLP" :sections="sections" :documents="documents" />
</template>
