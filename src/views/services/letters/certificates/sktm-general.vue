<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Tidak Mampu
// Template PDF: letters/sktm-general.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  {
      title: "Keterangan Ekonomi",
      fields: [
        f.text("income", "Penghasilan per bulan", { placeholder: "Contoh: Rp 1.000.000" }),
        f.text("category", "Kategori", { placeholder: "Contoh: Pra Sejahtera" }),
        f.text("kkmNumber", "Nomor KKM/KRM", { optional: true }),
      ],
    },
  keperluan(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Fotokopi kartu bantuan (KKS/KIP/PKH)"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Tidak Mampu" code="SKTM" :sections="sections" :documents="documents" />
</template>
