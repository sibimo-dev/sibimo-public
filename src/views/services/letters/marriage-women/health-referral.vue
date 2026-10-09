<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Pengantar Tes Kesehatan
// Template PDF: letters/marriage-women/letters/health-referral.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, OPT, f, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })]),
     { title: "Pemeriksaan Kesehatan", fields: [f.text("conduct", "Kelakuan", { default: "Baik" }), f.text("destination", "Tujuan ke", { placeholder: "Contoh: Puskesmas Ngemplak" }), f.text("need", "Keperluan", { placeholder: "Contoh: Pemeriksaan kesehatan pranikah" }), f.area("note", "Keterangan lain-lain", { span: 2, optional: true })] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pengantar Tes Kesehatan" code="PKS" :sections="sections" :documents="documents" />
</template>
