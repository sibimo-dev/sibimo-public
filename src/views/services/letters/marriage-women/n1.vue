<script>
// Pengantar Nikah
import { DOC, calonIstri, f, ortuNikah } from "@/data/letterFields";

const onlyWhen = (section, predicate) => ({
  ...section,
  fields: section.fields.map((field) => ({
    ...field,
    showIf: (form) => predicate(form) && (!field.showIf || field.showIf(form)),
  })),
});
const isJanda = (form) => /^(janda|cerai\s*(hidup|mati))$/i.test(String(form.brideStatus ?? "").trim());

export const sections = [calonIstri(),
     { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"], { from: "maritalStatus" }), ...onlyWhen({ fields: [f.text("exHusbandName", "Nama suami terdahulu (bila janda)", { optional: true })] }, isJanda).fields] },
     ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)")];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="N1" :sections="sections" :documents="documents" />
</template>
