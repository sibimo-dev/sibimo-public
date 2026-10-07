<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Wali Nikah
// Template PDF: letters/marriage-women/letters/guardian-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, calonIstri, calonSuami, f, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [person("guardian", "Data Wali Nikah", ["name", "nik", "birth", "occupation", "address"], [f.text("guardianBin", "Bin (nama ayah)"), f.text("guardianRelation", "Hubungan dengan calon istri"), f.area("guardianReason", "Keterangan/alasan", { span: 2 })]),
     calonIstri(["name", "nik", "birth", "address"]), calonSuami(["name", "nik", "birth", "address"])];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = ["Fotokopi KTP wali nikah", DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Wali Nikah" code="PWN" :sections="sections" :documents="documents" />
</template>
