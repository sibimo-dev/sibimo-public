<script>
// Surat Keterangan Mohon SKCK
import { f, pemohon, keperluan, DOC, opt } from "@/data/letterFields";

export const sections = [
  pemohon(),
  keperluan("Keperluan", "Pergi ke (instansi tujuan)"),
  { title: "Keterangan Tambahan", fields: [f.text("occupationNote", "Keterangan pekerjaan", { placeholder: "Contoh: Karyawan swasta di PT ...", optional: true })] },
];

export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  opt(DOC.pasFoto),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Mohon SKCK" code="SKCK" :sections="sections" :documents="documents" />
</template>