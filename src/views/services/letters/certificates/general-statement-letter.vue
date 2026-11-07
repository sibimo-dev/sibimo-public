<script>
// Surat Keterangan Umum
// Template PDF: letters/general-statement-letter-gov.blade.php
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
    title: "Isi Pernyataan",
    fields: [
      f.area("purpose", "Menerangkan Bahwa", { span: 2, placeholder: "Tuliskan isi pernyataan" }),
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
  <LetterWizard title="Surat Keterangan Umum" code="SPI" :sections="sections" :documents="documents" />
</template>