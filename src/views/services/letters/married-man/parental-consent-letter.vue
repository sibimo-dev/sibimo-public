<script>
// Surat Izin Orang Tua
import { DOC, ortuNikah } from "@/data/letterFields";

export const sections = [ortuNikah("father", "Data Ayah Catin Pria", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu Catin Pria", "Binti (nama ayah dari ibu)"),
     ortuNikah("child", "Data Catin Pria (Anak yang Akan Menikah)", "Bin/Binti (nama ayah)"), ortuNikah("childSpouse", "Data Catin Wanita (Calon Pasangan Anak)", "Bin/Binti (nama ayah)")];

export const documents = ["Fotokopi KTP ayah dan ibu", "Fotokopi KTP anak", DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Izin Orang Tua" code="SOT" :sections="sections" :documents="documents" />
</template>