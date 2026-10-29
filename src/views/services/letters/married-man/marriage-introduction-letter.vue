<script>
// Pengantar Nikah
import { DOC, eduNat, f, ortuNikah, pemohon } from "@/data/letterFields";

const onlyWhen = (section, predicate) => ({
  ...section,
  fields: section.fields.map((field) => ({
    ...field,
    showIf: (form) => predicate(form) && (!field.showIf || field.showIf(form)),
  })),
});
const isDuda = (form) => /duda|cerai\s*(hidup|mati)/i.test(String(form.groomStatus ?? form.maritalStatus ?? "").trim());

export const sections = [{ ...pemohon([...eduNat(), ...onlyWhen({ fields: [f.text("previousSpouseName", "Nama istri terdahulu (bila ada)", { optional: true })] }, isDuda).fields]), title: "Data Calon Suami" },
     ortuNikah("father", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)")];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="PNK" :sections="sections" :documents="documents" />
</template>
