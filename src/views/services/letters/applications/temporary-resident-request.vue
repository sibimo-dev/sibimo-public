<script setup>
// Permohonan Tinggal Sementara

import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Field wilayah a-d (Desa/Kelurahan, Kecamatan, Kabupaten, Provinsi) dengan prefix key
const wilayah = (prefix) => [
  f.text(`${prefix}Village`, "a. Desa/Kelurahan"),
  f.text(`${prefix}District`, "b. Kecamatan"),
  f.text(`${prefix}Regency`, "c. Kabupaten"),
  f.text(`${prefix}Province`, "d. Provinsi"),
];

// Langkah 1: isian sesuai surat yang diajukan (nomor mengikuti formulir)
const sections = [
  // 1. Nama Lengkap Pemohon (dari pemohon()), 2. NIK Pemohon, 3. Nomor Kartu Keluarga
  pemohon([
    f.text("applicantNik", "NIK Pemohon"),
    f.kk("kkNumber", "Nomor Kartu Keluarga"),
  ]),

  // 4. Alamat Asal Pemohon + a-d
  {
    title: "Alamat Asal Pemohon",
    fields: [f.area("originAddress", "Alamat Asal", { span: 2 }), ...wilayah("origin")],
  },

  // 5. Alasan Tinggal Sementara, 6. Alamat yang Dituju
  {
    title: "Tinggal Sementara",
    fields: [
      f.area("reason", "Alasan Tinggal Sementara", { span: 2 }),
      f.area("destinationAddress", "Alamat yang Dituju", { span: 2 }),
    ],
  },

  // 7. Nama Orang Tua/Wali/Keluarga Dekat, 8. Alamat + a-d
  {
    title: "Orang Tua / Wali / Keluarga Dekat",
    fields: [
      f.text("guardianName", "Nama Orang Tua/Wali/Keluarga Dekat", { span: 2 }),
      f.area("guardianAddress", "Alamat Orang Tua/Wali", { span: 2 }),
      ...wilayah("guardian"),
    ],
  },

  // 9. Nama Penjamin, 10. NIK Penjamin, 11. Alamat Penjamin + a-d
  {
    title: "Penjamin di Alamat Baru",
    fields: [
      f.text("sponsorName", "Nama Penjamin di Alamat Baru"),
      f.text("sponsorNik", "NIK Penjamin"),
      f.area("sponsorAddress", "Alamat Penjamin", { span: 2 }),
      ...wilayah("sponsor"),
    ],
  },

  // 12. Nama dan NIK anggota keluarga yang ikut tinggal sementara (5 baris)
  {
    title: "Anggota Keluarga yang Ikut",
    fields: [
      f.rows("familyMembers", "Anggota keluarga yang ikut tinggal sementara (maks. 5 orang)", [
        { key: "name", label: "Nama" },
        { key: "nik", label: "NIK" },
      ], { optional: true, max: 5 }),
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
  <LetterWizard title="Permohonan Tinggal Sementara" code="PPS" :sections="sections" :documents="documents" />
</template>