<script>
// Surat Keterangan Numpang Nikah
import { DOC, calonIstri, calonSuami, opt, forPublic } from "@/data/letterFields";

export const sections = forPublic([{ ...calonSuami(), title: "Data Catin Pria" }, { ...calonIstri(), title: "Data Catin Wanita" }]);

export const documents = [DOC.ktp, DOC.kk, DOC.rt, opt("Fotokopi KTP calon pasangan")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Numpang Nikah" code="KNN" :sections="sections" :documents="documents" />
</template>
