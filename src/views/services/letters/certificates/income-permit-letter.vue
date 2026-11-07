<script>
// Surat Keterangan Penghasilan
// Template PDF: letters/income-permit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, DOC, OPT, forPublic } from "@/data/letterFields";

// Langkah 1: isian disesuaikan urut dengan template surat
export const sections = forPublic([
  {
    title: "Data Pemohon",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.text("name", "Nama Lengkap", { from: "fullName" }),
      f.nik("nik", "NIK", { from: "nik" }),
      f.text("birthPlace", "Tempat Lahir", { from: "birthPlace" }),
      f.date("birthDate", "Tanggal Lahir", { from: "birthDate" }),
      f.select("gender", "Jenis Kelamin", OPT.gender, { from: "gender" }),
      f.select("maritalStatus", "Status Perkawinan", OPT.marital, { from: "maritalStatus" }),
      f.select("religion", "Agama", OPT.religion, { from: "religion" }),
      f.occupation("occupation", "Pekerjaan", { from: "occupation" }),
      f.area("address", "Alamat", { from: "address", span: 2 }),
    ],
  },
  {
    title: "Keterangan Penghasilan",
    fields: [
      f.text("income", "Penghasilan per bulan", { placeholder: "Contoh: Rp 3.000.000" }),
    ],
  },
  {
    title: "Keperluan",
    fields: [
      f.area("purpose", "Surat Keterangan ini dipergunakan untuk", { span: 2 }),
    ],
  },
]);

// Langkah 2: dokumen pendukung (hanya FC KTP & FC KK)
export const documents = [
  DOC.ktp,
  DOC.kk,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Penghasilan" code="KPH" :sections="sections" :documents="documents" />
</template>