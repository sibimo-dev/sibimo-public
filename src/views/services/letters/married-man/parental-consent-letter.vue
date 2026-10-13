<script>
// Surat Izin Orang Tua
import { DOC, ortuNikah } from "@/data/letterFields";

export const sections = [ortuNikah("father", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)"),
     ortuNikah("child", "Data Calon Suami (Anak yang Akan Menikah)", "Bin/Binti (nama ayah)"), ortuNikah("childSpouse", "Data Calon Istri (Calon Pasangan Anak)", "Bin/Binti (nama ayah)")];

export const documents = ["Fotokopi KTP ayah dan ibu", "Fotokopi KTP anak", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Izin Orang Tua" code="SOT" :sections="sections" :documents="documents" />
</template>