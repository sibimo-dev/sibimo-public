<script>
// Surat Keterangan Jalan admin bisa memilih akan menggunakan kop pemerintah atau kop lurah
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

export const sections = [
  pemohon([f.kk("kkNumber", "Nomor KK"), f.text("phone", "Nomor telepon", { placeholder: "Contoh: 081234567890" })]),
  keperluan("Tujuan perjalanan", "Tempat tujuan"),
];

export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt("Surat tugas/undangan dari instansi"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Jalan" code="IPI" :sections="sections" :documents="documents" />
</template>