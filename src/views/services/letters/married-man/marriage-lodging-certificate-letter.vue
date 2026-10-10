<script>
// Surat Keterangan Numpang Nikah
import { DOC, N7, eduNat, f, opt, pemohon, person } from "@/data/letterFields";

export const sections = [{ ...pemohon([f.text("applicantBin", "Bin/Binti (nama ayah)"), ...eduNat()]), title: "Data Calon Suami" },
     person("spouse", "Data Calon Istri", N7, [f.text("spouseBin", "Binti (nama ayah)")])];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, opt("Fotokopi KTP calon pasangan")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Numpang Nikah" code="KNN" :sections="sections" :documents="documents" />
</template>