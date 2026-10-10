<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Numpang Nikah
// Template PDF: letters/marriage-women/letters/numpang-nikah.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, N7, arrange, calonIstri, calonSuami } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Calon istri: 9 baris di template (termasuk pendidikan terakhir) -> calonIstri() bawaan.
// Calon suami: 8 baris di template (tanpa pendidikan) -> calonSuami(N7), N7 = bagian data tanpa pendidikan.
// Urutan isian di form mengikuti urutan baris di template PDF.
export const sections = arrange([calonIstri(), calonSuami(N7)], {
  fields: {
    "Data Calon Istri": ["brideName", "brideBinti", "brideNik", "brideBirthPlace", "brideBirthDate", "brideNationality", "brideReligion", "brideOccupation", "brideAddress", "brideEducation"],
    "Data Calon Suami": ["groomName", "groomBin", "groomNik", "groomBirthPlace", "groomBirthDate", "groomNationality", "groomReligion", "groomOccupation", "groomAddress"],
  },
});

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Numpang Nikah" code="PNN" :sections="sections" :documents="documents" />
</template>