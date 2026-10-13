<script>
// Surat Izin Orang Tua
import { DOC, N7, calonIstri, calonSuami, ortuNikah } from "@/data/letterFields";

export const sections = [ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"), calonIstri(N7), calonSuami(N7)];

export const documents = ["Fotokopi KTP ayah dan ibu calon istri", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Izin Orang Tua" code="N5" :sections="sections" :documents="documents" />
</template>