<script>
// Pengantar Nikah
import { DOC, eduNat, f, ortuNikah, pemohon, forPublic } from "@/data/letterFields";

const onlyWhen = (section, predicate) => ({
  ...section,
  fields: section.fields.map((field) => ({
    ...field,
    showIf: (form) => predicate(form) && (!field.showIf || field.showIf(form)),
  })),
});
const isDuda = (form) => /duda|cerai\s*(hidup|mati)/i.test(String(form.groomStatus ?? form.maritalStatus ?? "").trim());

const catinPria = pemohon([
  ...eduNat(),
  ...onlyWhen({ fields: [f.text("previousSpouseName", "Nama istri terdahulu (bila ada)", { optional: true })] }, isDuda).fields,
]);
catinPria.title = "Data Catin Pria";
catinPria.fields = catinPria.fields.map((field) =>
  field.key === "maritalStatus"
    ? f.select("maritalStatus", "Status Perkawinan", ["Jejaka", "Duda", "Beristri"], { from: "maritalStatus" })
    : field
);

export const sections = forPublic([
  catinPria,
  ortuNikah("father", "Data Ayah Catin", "Bin (nama ayah dari ayah)"),
  ortuNikah("mother", "Data Ibu Catin", "Binti (nama ayah dari ibu)"),
]);

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Pengantar Nikah" code="PNK" :sections="sections" :documents="documents" />
</template>
