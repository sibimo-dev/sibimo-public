<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Permohonan Penerbitan KIA
// Template PDF: letters/kia-application-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, OPT, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan (kunci mengikuti $kia di template PDF)
export const sections = [
  {
    title: "Data Anak",
    fields: [
      f.nik("nik", "NIK Anak"),
      f.text("name", "Nama Lengkap Anak"),
      f.text("birthPlace", "Tempat Lahir"),
      f.date("birthDate", "Tanggal Lahir"),
      f.select("gender", "Jenis Kelamin", OPT.gender),
      f.select("bloodType", "Golongan Darah", ["A", "B", "AB", "O", "Tidak Tahu"], { optional: true }),
      f.select("religion", "Agama", OPT.religion),
      f.text("citizenship", "Kewarganegaraan", { default: "WNI" }),
      f.text("birthCertNumber", "Nomor Akta Kelahiran"),
    ],
  },
  {
    title: "Data Keluarga",
    fields: [
      f.kk("kkNumber", "Nomor Kartu Keluarga"),
      f.text("householdHead", "Nama Kepala Keluarga"),
    ],
  },
  {
    title: "Alamat",
    fields: [
      f.area("address", "Alamat", { span: 2 }),
      f.text("rt", "RT"),
      f.text("rw", "RW"),
      f.text("village", "Kalurahan", { default: "Bimomartani" }),
      f.text("district", "Kapanewon", { default: "Ngemplak" }),
    ],
  },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.kk,
  DOC.aktaLahir,
  "Pas foto anak ukuran 3x4",
  opt("Fotokopi KTP orang tua"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Permohonan Penerbitan KIA" code="KIA" :sections="sections" :documents="documents" />
</template>
