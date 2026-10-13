<script>
// Permohonan Kehendak Nikah
import { DOC, akad, calonPengantin, pemohonRingkas } from "@/data/letterFields";

export const sections = [{ ...pemohonRingkas(), title: "Data Calon Suami" }, { ...calonPengantin(), title: "Data Calon Suami dan Calon Istri" }, akad()];

export const documents = [DOC.ktp, DOC.kk, "Fotokopi KTP calon pasangan", DOC.pasFoto, DOC.aktaLahir, "Surat keterangan wali nikah"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Kehendak Nikah" code="KHN" :sections="sections" :documents="documents" />
</template>