<script setup>
// Formulir Permohonan Pindah Datang WNI
// Template PDF: letters/resident-arrival-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, DOC, keluarga, alamat } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.text("headOfFamily", "Nama Kepala Keluarga")]),
  {
      title: "Data KK Tujuan",
      fields: [f.kk("kkNumber", "Nomor KK"), f.date("arrivalDate", "Tanggal Kedatangan"), f.select("destinationKkStatus", "Status KK di tempat tujuan", OPT.kkStatus)],
    },
  alamat("origin", "Alamat Asal"),
  alamat("destination", "Alamat Tujuan (di kalurahan ini)"),
  {
      title: "Keluarga yang Datang",
      fields: [
        f.rows("familyMembers", "Anggota keluarga yang datang", [
          { key: "nik", label: "NIK" },
          { key: "name", label: "Nama" },
          { key: "shdk", label: "Status Hubungan dalam Keluarga", type: "select", options: OPT.shdk },
          { key: "validUntil", label: "KTP berlaku s/d", type: "date", optional: true },
        ], { max: 8 }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  "Surat keterangan pindah (SKPWNI) dari daerah asal",
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<template>
  <LetterWizard title="Formulir Permohonan Pindah Datang WNI" code="SKD" :sections="sections" :documents="documents" />
</template>
