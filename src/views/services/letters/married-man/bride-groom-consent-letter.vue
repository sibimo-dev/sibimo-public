<script>
// Persetujuan Calon Pengantin
import { DOC, calonIstri, calonSuami } from "@/data/letterFields";

export const sections = [{ ...calonSuami(), title: "Data Catin Pria" }, { ...calonIstri(), title: "Data Catin Wanita" }];

export const documents = ["Fotokopi KTP calon suami", "Fotokopi KTP calon istri", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="SCM" :sections="sections" :documents="documents" />
</template>