<script>
// Surat Keterangan Kematian
import { DOC, N7, calonIstri, f, person } from "@/data/letterFields";

export const sections = [person("exHusband", "Data Suami Terdahulu (Almarhum)", N7, [f.text("exHusbandBin", "Bin (nama ayah)"), f.date("exHusbandDiedAt", "Tanggal Meninggal"), f.text("exHusbandDiedPlace", "Tempat Meninggal")]), calonIstri(N7)];

export const documents = [DOC.suratKematian, DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="N6" :sections="sections" :documents="documents" />
</template>