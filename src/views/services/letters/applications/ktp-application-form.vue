<script>
// sections & documents di-export supaya juga dibaca halaman register (data/registrationLetters.js).
// Surat Permohonan KTP (F-107)
// Template PDF: letters/ktp-application-form.blade.php
// Mengikuti formulir PDF. Yang TIDAK menjadi field (diisi sistem/petugas): Pemerintah Provinsi/Kabupaten,
// Kecamatan, Desa, tanggal surat, serta tanggal tanda tangan. Nama penandatangan Dukuh dan Camat (Mengetahui) bersifat OPSIONAL; Lurah/Petugas Kalurahan tidak jadi field (ada di otorisasi)
// (section "Nama Penandatangan"); tanda tangan Pemohon memakai Nama Lengkap di atas.
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, DOC, opt, kodeWilayah, forPublic } from "@/data/letterFields";
import { signerSection } from "@/views/services/layout/signerFields.js";

// Langkah 1: urutan mengikuti formulir: jenis permohonan, Nama Lengkap, No KK, NIK, Alamat, RT, RW
export const sections = forPublic([
  // Kode dusun diisi petugas (officerOnly, tidak tampil di publik). Dusun dipilih pemohon lewat dropdown di bawah (key hamlet, sama dengan admin).
  kodeWilayah({ hamlet: false, hamletCode: true }, "Kode Dusun (Diisi Oleh Petugas)"),
  {
    title: "Dusun/Dukuh/Kampung",
    hint: "Pilih dari data dusun/dukuh yang tersedia atau ketik nama secara manual.",
    fields: [f.hamlet("hamlet", "Dusun/Dukuh/Kampung", { from: "dusun", optional: true })],
  },
  { title: "Jenis Permohonan", fields: [f.select("applicationType", "Permohonan KTP", ["Baru", "Perpanjangan", "Penggantian"])] },
  {
    title: "Data Pemohon",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.text("name", "Nama Lengkap", { from: "fullName" }),
      f.kk("kkNumber", "No KK", { from: "familyCardNumber" }),
      f.nik("nik", "NIK", { from: "nik" }),
      f.area("address", "Alamat", { from: "address", span: 2 }),
      f.text("rt", "RT", { from: "rt" }),
      f.text("rw", "RW", { from: "rw" }),
    ],
  },
  // TTD (4): 1. Pemohon (= name di atas)  2. Dukuh  3. Camat  4. Lurah/Petugas kalurahan
  signerSection(["applicant", "hamletHead", "districtHead"]),
]);

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
// Pas foto 3x4 dan spesimen tanda tangan/cap jempol adalah kotak isian di formulir PDF, jadi diunggah pemohon.
export const documents = [
  DOC.kk,
  "Pas foto 3x4",
  "Spesimen tanda tangan atau cap jempol",
  opt("Surat keterangan kehilangan dari kepolisian (bila KTP hilang)"),
  opt("KTP lama (bila rusak/perpanjangan)"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Permohonan KTP" code="KTP" :sections="sections" :documents="documents" />
</template>