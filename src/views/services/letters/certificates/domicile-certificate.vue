<script>
// Surat Keterangan Domisili
// Template PDF: letters/domicile-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, DOC, OPT, forPublic } from "@/data/letterFields";

// Langkah 1: isian disesuaikan urut dengan template surat
export const sections = forPublic([
  {
    title: "Data Perusahaan/Yayasan",
    fields: [
      f.text("companyName", "Nama Perusahaan/Yayasan"),
      f.text("businessActivity", "Jenis Usaha/Kegiatan"),
      f.select("buildingStatus", "Status Bangunan", ["Milik Sendiri", "Sewa/Kontrak", "Pinjam Pakai"]),
      f.text("buildingUsage", "Kegunaan Bangunan", { placeholder: "Contoh: Kantor, Toko, Gudang" }),
      f.text("responsiblePerson", "Nama Penanggung Jawab/Pimpinan"),
      f.text("employeeCount", "Jumlah Karyawan", { placeholder: "Contoh: 5 orang" }),
      f.text("phone", "Nomor Telepon/HP"),
      f.area("domicileAddress", "Alamat domisili", { span: 2 }),
    ],
  },
  {
    title: "Identitas Pemilik",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.text("name", "Nama Lengkap", { from: "fullName" }),
      f.nik("nik", "NIK", { from: "nik" }),
      f.text("birthPlace", "Tempat Lahir", { from: "birthPlace" }),
      f.date("birthDate", "Tanggal Lahir", { from: "birthDate" }),
      f.select("gender", "Jenis Kelamin", OPT.gender, { from: "gender" }),
      f.select("maritalStatus", "Status Perkawinan", OPT.marital, { from: "maritalStatus" }),
      f.select("religion", "Agama", OPT.religion, { from: "religion" }),
      f.area("address", "Alamat", { from: "address", span: 2 }),
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
  <LetterWizard title="Surat Keterangan Domisili" code="KDM" :sections="sections" :documents="documents" />
</template>