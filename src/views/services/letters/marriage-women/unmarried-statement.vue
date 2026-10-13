<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Belum Menikah Lagi
// Template PDF: letters/marriage-women/letters/unmarried-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, arrange, eduNat, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Semua isian template sudah ada di pemohon() + eduNat(); di sini hanya diurutkan sesuai template:
// Nama, NIK, Jenis Kelamin, Tempat dan tanggal lahir, Warganegara, Agama, Pekerjaan,
// Pendidikan Terakhir, Alamat, Status Perkawinan.
export const sections = arrange([pemohon(eduNat())], {
  fields: { "Data Pemohon": ["name", "nik", "gender", "birthPlace", "birthDate", "nationality", "religion", "occupation", "education", "address", "maritalStatus"] },
});

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Menikah Lagi" code="PBN" :sections="sections" :documents="documents" />
</template>