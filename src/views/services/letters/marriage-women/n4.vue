<script>
// Persetujuan Calon Pengantin
import { DOC, N7, calonIstri, calonSuami } from "@/data/letterFields";

export const sections = [calonSuami(N7), calonIstri(N7)];

export const documents = [DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="N4" :sections="sections" :documents="documents" />
</template>