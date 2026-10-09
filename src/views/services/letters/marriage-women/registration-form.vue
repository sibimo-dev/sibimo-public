<script>
// Data Isian Pendaftaran Nikah
import { DOC, N7, akad, calonIstri, calonSuami, f, opt, ortuNikah, person } from "@/data/letterFields";

export const sections = [
  akad(),
  calonSuami(N7),
  calonIstri(N7),
  { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"])] },
  person("exHusband", "Data Suami Terdahulu (isi jika janda)", N7, [
    f.text("exHusbandBin", "Bin (nama ayah)"),
    f.date("exHusbandDiedAt", "Tanggal meninggal"),
    f.text("exHusbandDiedPlace", "Tempat meninggal"),
  ]),
  ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
  ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
  person("guardian", "Data Wali Nikah (isi jika wali nasab bukan ayah kandung)", N7, [
    f.text("guardianBin", "Bin (nama ayah dari wali)"),
    f.text("guardianRelation", "Hubungan wali dengan calon istri"),
    f.area("guardianReason", "Sebab wali bukan ayah kandung", { span: 2, optional: true }),
  ]),
  { title: "Wali Hakim", fields: [f.area("judgeGuardianReason", "Sebab wali hakim (isi jika wali hakim)", { span: 2, optional: true })] },
];

export const documents = [DOC.ktp, DOC.kk, DOC.aktaLahir, DOC.pasFoto, opt(DOC.suratKematian)];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Data Isian Pendaftaran Nikah" code="FPN" :sections="sections" :documents="documents" />
</template>