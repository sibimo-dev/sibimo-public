<script setup>
// Formulir Keterangan Pindah WNI
// Template PDF: letters/relocation-certificate-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, DOC, opt, keluarga, alamat } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.kk("kkNumber", "Nomor KK Asal"), f.text("headOfFamily", "Nama Kepala Keluarga")]),
  alamat("origin", "Alamat Asal"),
  alamat("destination", "Alamat Tujuan Pindah"),
  {
      title: "Alasan & Jenis Kepindahan",
      fields: [
        f.select("relocationReason", "Alasan Pindah", ["Pekerjaan", "Pendidikan", "Keamanan", "Kesehatan", "Perumahan", "Keluarga", "Lainnya"]),
        f.text("relocationReasonOther", "Sebutkan alasan lainnya", { showIf: (form) => form.relocationReason === "Lainnya" }),
        f.select("relocationType", "Jenis Kepindahan", ["Kepala Keluarga", "Kepala Keluarga dan seluruh anggota keluarga", "Kepala Keluarga dan sebagian anggota keluarga", "Anggota Keluarga"]),
        f.select("originKkStatus", "Status KK bagi yang tidak pindah", OPT.kkStatus),
        f.select("destinationKkStatus", "Status KK bagi yang pindah", OPT.kkStatus),
      ],
    },
  {
      title: "Keluarga yang Pindah",
      fields: [
        f.rows("familyMembers", "Anggota keluarga yang ikut pindah", [
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
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Surat keterangan pekerjaan/sekolah di tempat tujuan"),
];
</script>

<template>
  <LetterWizard title="Formulir Keterangan Pindah WNI" code="SKP" :sections="sections" :documents="documents" />
</template>
