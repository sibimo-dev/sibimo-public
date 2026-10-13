<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Belum Pernah Menikah
// Template PDF: letters/marriage-women/letters/unmarried-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, arrange, f, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Template memuat: Nama lengkap dan alias, NIK, Tempat dan tanggal lahir, Jenis kelamin,
// Agama, Pekerjaan, Tempat tinggal. Status Perkawinan tidak dicetak, jadi dibuang dari surat ini.
// Nama dan jabatan penanda tangan diambil dari data penanda tangan, bukan dari isian pemohon.
// arrange() hanya mengubah salinan untuk surat ini, surat lain tidak ikut berubah.
export const sections = arrange([pemohon([f.text("alias", "Alias", { optional: true })])], {
  fields: { "Data Pemohon": ["name", "alias", "nik", "birthPlace", "birthDate", "gender", "religion", "occupation", "address"] },
  drop: ["maritalStatus"],
});

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Pernah Menikah" code="KBM" :sections="sections" :documents="documents" />
</template>