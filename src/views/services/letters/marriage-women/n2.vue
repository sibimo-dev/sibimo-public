<script>
// Permohonan Kehendak Nikah
import { DOC, akad, calonPengantin, opt, pemohonRingkas } from "@/data/letterFields";

export const sections = [{ ...pemohonRingkas(), title: "Data Calon Istri" }, calonPengantin(), akad()];

export const documents = ["Surat pengantar nikah dari desa/kelurahan (N1)", "Persetujuan calon mempelai (N3)", DOC.ktp, DOC.aktaLahir, DOC.kk, DOC.pasFoto, opt("Surat keterangan wali nikah")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Kehendak Nikah" code="N2" :sections="sections" :documents="documents" />
</template>