<script>
// Surat Keterangan Kematian untuk catin duda
import { DOC, f, pemohon, person } from "@/data/letterFields";

export const sections = [
  { ...pemohon([f.text("applicantBin", "Bin (nama ayah)"), f.text("nationality", "Kewarganegaraan", { default: "WNI" })]), title: "Data Catin Pria" },
  person("deceased", "Data Pasangan Terdahulu (Almarhum/ah)", ["name", "nik", "birth", "nationality", "religion", "occupation", "address"], [f.text("deceasedBinti", "Binti (nama ayah)"), f.date("deathDate", "Tanggal Meninggal"), f.text("deathPlace", "Tempat Meninggal")]),
];

export const documents = [DOC.suratKematian, DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Kematian" code="KKN" :sections="sections" :documents="documents" />
</template>