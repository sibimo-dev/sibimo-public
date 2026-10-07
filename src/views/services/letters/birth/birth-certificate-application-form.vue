<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Permohonan Akta Kelahiran
// Template PDF: letters/birth/birth-certificate-application-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, DOC_LAHIR, anak, f, keluarga, opt, ortu, pemohonRingkas, perkawinanOrtu } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [keluarga(), anak(), ortu("mother", "Data Ibu Kandung"), ortu("father", "Data Ayah Kandung"), perkawinanOrtu(),
     pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan anak"), f.text("reporterPhone", "No. HP/Telepon aktif", { from: "phoneNumber" })])];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC_LAHIR, DOC.kk, "Fotokopi KTP ayah dan ibu/wali/pelapor", DOC.akta, DOC.ktpSaksi, opt("Surat kuasa dan fotokopi KTP penerima kuasa"), opt("Fotokopi paspor (bagi WNI bukan penduduk/orang asing)"), opt("SPTJM kebenaran data kelahiran"), opt("SPTJM kebenaran sebagai pasangan suami istri")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Akta Kelahiran" code="AKL" :sections="sections" :documents="documents" />
</template>
