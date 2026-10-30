<script>
// Data Isian Pendaftaran Nikah
import { DOC, OPT, N7, akad, calonIstri, calonSuami, f, opt, optional, ortuNikah, person } from "@/data/letterFields";

const onlyWhen = (section, predicate) => ({
  ...section,
  fields: section.fields.map((field) => ({
    ...field,
    showIf: (form) => predicate(form) && (!field.showIf || field.showIf(form)),
  })),
});
const isDuda = (form) => /^(duda|cerai\s*(hidup|mati))$/i.test(String(form.groomStatus ?? "").trim());
const isJanda = (form) => /^(janda|cerai\s*(hidup|mati))$/i.test(String(form.brideStatus ?? "").trim());

export const sections = [
      akad(),
      { ...calonSuami(), title: "Data Calon Suami" },
      { title: "Pendidikan & Status Calon Suami", fields: [f.select("groomEducation", "Pendidikan Terakhir", OPT.education), f.select("groomStatus", "Status", ["Jejaka", "Duda", "Beristri"], { from: "maritalStatus" })] },
      ortuNikah("groomFather", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"),
      ortuNikah("groomMother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)"),
      { ...calonIstri(), title: "Data Calon Istri" },
      { title: "Pendidikan & Status Calon Istri", fields: [f.select("brideEducation", "Pendidikan Terakhir", OPT.education), f.select("brideStatus", "Status", ["Perawan", "Janda"], { from: "maritalStatus" })] },
      ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
      ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
      onlyWhen(optional(person("groomPrev", "Data Istri Terdahulu Calon Suami (bila duda)", N7, [f.text("groomPrevBin", "Bin/Binti (nama ayah)"), f.text("groomPrevParentName", "Nama orang tua istri terdahulu"), f.date("groomPrevDeathDate", "Tanggal Meninggal"), f.text("groomPrevDeathPlace", "Tempat Meninggal")])), isDuda),
      onlyWhen(optional(person("bridePrev", "Data Suami Terdahulu Calon Istri (bila janda)", ["name", "nik"], [f.text("bridePrevBin", "Bin (nama ayah)"), f.date("bridePrevDeathDate", "Tanggal Meninggal"), f.text("bridePrevDeathPlace", "Tempat Meninggal")])), isJanda),
    ];

export const documents = [DOC.ktp, DOC.kk, DOC.aktaLahir, DOC.pasFoto, opt("Fotokopi KTP orang tua kedua calon"), opt("Akta cerai/surat kematian pasangan terdahulu")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Data Isian Pendaftaran Nikah" code="DPN" :sections="sections" :documents="documents" />
</template>
