<script>
// Surat Keterangan Belum Pernah Menikah
import { DOC, f, pemohon } from "@/data/letterFields";

export const sections = [{ ...pemohon([f.text("alias", "Nama alias (bila ada)", { optional: true })]), title: "Data Catin Pria" }];

export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Pernah Menikah" code="KBP" :sections="sections" :documents="documents" />
</template>