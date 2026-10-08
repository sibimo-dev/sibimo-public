<script>
// Surat Keterangan Belum Kawin
import { person, DOC } from "@/data/letterFields";

export const sections = [
  person("applicant", "Data Pemohon", ["name", "nik", "birth", "gender", "religion", "occupation", "address"]),
];

export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Kawin" code="KSB" :sections="sections" :documents="documents" />
</template>