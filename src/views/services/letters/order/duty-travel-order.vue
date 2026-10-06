<script setup>
// SPPD
// Template PDF: letters/duty-travel-order-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas(),
  {
      title: "Pegawai yang Diperintah",
      fields: [
        f.text("issuingOfficial", "Pejabat yang memberi perintah"),
        f.text("employeeName", "Nama pegawai"),
        f.text("employeeRank", "Pangkat/Golongan"),
        f.text("employeePosition", "Jabatan"),
        f.text("travelLevel", "Tingkat perjalanan", { default: "Biasa" }),
      ],
    },
  {
      title: "Perjalanan Dinas",
      fields: [
        f.area("purpose", "Maksud perjalanan dinas", { span: 2 }),
        f.text("transport", "Alat angkutan"),
        f.text("companions", "Pengikut", { optional: true }),
        f.text("departurePlace", "Tempat berangkat"),
        f.text("destinationPlace", "Tempat tujuan"),
        f.date("departureDate", "Tanggal berangkat"),
        f.date("returnDueDate", "Tanggal harus kembali"),
        f.text("duration", "Lama perjalanan", { placeholder: "Contoh: 2 hari" }),
      ],
    },
  {
      title: "Anggaran & Keterangan",
      fields: [f.text("budgetAgency", "Instansi pembebanan anggaran"), f.text("budgetItem", "Mata anggaran"), f.area("notes", "Keterangan lain-lain", { span: 2, optional: true })],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  "Surat undangan/pemberitahuan kegiatan dari instansi tujuan",
];
</script>

<template>
  <LetterWizard title="SPPD" code="SPD" :sections="sections" :documents="documents" />
</template>
