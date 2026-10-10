<script>
// Pengantar Nikah
import { DOC, eduNat, f, ortuNikah, pemohon } from "@/data/letterFields";

export const sections = [{ ...pemohon([...eduNat(), f.text("previousSpouseName", "Nama istri/suami terdahulu (bila ada)", { optional: true })]), title: "Data Calon Suami" },
     ortuNikah("father", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)")];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="PNK" :sections="sections" :documents="documents" />
</template>