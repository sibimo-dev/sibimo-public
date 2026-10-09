<script>
// Surat Keterangan Tidak Mampu
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

export const sections = [
  pemohon(),
  {
      title: "Keterangan Ekonomi",
      fields: [
        f.text("income", "Penghasilan per bulan", { placeholder: "Contoh: Rp 1.000.000 (kosongkan jika tidak ada)", optional: true }),
        f.text("category", "Kategori", { placeholder: "Contoh: Pra Sejahtera" }),
        f.text("kkmNumber", "Nomor KKM/KRM", { optional: true }),
      ],
    },
  keperluan(),
];

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