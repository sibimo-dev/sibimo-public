<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Laporan Kelahiran Luar Domisili
// Template PDF: letters/birth/out-of-domicile-birth-report.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { bayi, dokBayi, f } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [{ title: "Domisili", fields: [f.text("hamlet", "Dusun"), f.area("currentResidence", "Alamat domisili saat ini", { span: 2 })] }, ...bayi()];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = dokBayi();
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Laporan Kelahiran Luar Domisili" code="PLD" :sections="sections" :documents="documents" />
</template>
