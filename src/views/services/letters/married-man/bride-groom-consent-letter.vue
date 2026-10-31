<script>
// Persetujuan Calon Pengantin
import { DOC, N7, calonIstri, calonSuami, forPublic } from "@/data/letterFields";

export const sections = forPublic([{ ...calonSuami(N7), title: "Data Catin Pria" }, { ...calonIstri(N7), title: "Data Catin Wanita" }]);

export const documents = ["Fotokopi KTP calon suami", "Fotokopi KTP calon istri", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Persetujuan Calon Pengantin" code="SCM" :sections="sections" :documents="documents" />
</template>
