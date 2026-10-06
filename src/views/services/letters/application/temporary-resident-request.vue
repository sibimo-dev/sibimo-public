<script setup>
// Surat Permohonan Menjadi Penduduk Sementara / SKTS
// Template PDF: letters/temporary-resident-request.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, OPT, pemohon, DOC, opt, keluarga } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon([f.select("education", "Pendidikan Terakhir", OPT.education)]),
  {
      title: "Alamat Asal",
      fields: [
        f.area("originAddress", "Alamat", { span: 2 }),
        f.text("originVillage", "Desa/Kelurahan"),
        f.text("originDistrict", "Kecamatan"),
        f.text("originRegency", "Kabupaten/Kota"),
        f.text("originProvince", "Provinsi"),
      ],
    },
  {
      title: "Tempat Tinggal Sementara",
      fields: [
        f.area("reason", "Alasan Menjadi Penduduk Sementara", { span: 2 }),
        f.area("destinationAddress", "Alamat Tujuan", { span: 2 }),
        f.text("destinationRt", "RT"),
        f.text("destinationRw", "RW"),
        f.text("destinationHamlet", "Dusun"),
      ],
    },
  {
      title: "Menumpang Keluarga",
      fields: [
        f.text("hostName", "Nama kepala keluarga yang ditumpangi"),
        f.kk("hostFamilyCardNumber", "Nomor KK yang ditumpangi"),
        f.rows("familyMembers", "Keluarga yang turut", [{ key: "name", label: "Nama" }, { key: "nik", label: "NIK" }], { optional: true }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Surat keterangan kos/kontrak/tempat tinggal"),
];
</script>

<template>
  <LetterWizard title="Surat Permohonan Menjadi Penduduk Sementara / SKTS" code="PPS" :sections="sections" :documents="documents" />
</template>
