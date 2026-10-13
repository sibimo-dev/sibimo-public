<script>
// Pengantar Nikah
import { DOC, calonIstri, f, ortuNikah } from "@/data/letterFields";

export const sections = [calonIstri(),
     { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"]), f.text("exHusbandName", "Nama suami terdahulu (bila janda)", { optional: true })] },
     ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)")];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="N1" :sections="sections" :documents="documents" />
</template>