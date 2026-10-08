<script>
// Surat Keterangan Tidak Mampu Sekolah
import { f, pemohon, person, DOC, opt } from "@/data/letterFields";

export const sections = [
  pemohon(),
  person("student", "Data Siswa", ["name", "nik", "birth", "gender", "address"], [f.text("studentEducation", "Jenjang pendidikan"), f.text("studentClass", "Kelas/Semester", { placeholder: "Contoh: VII / Ganjil" })]),
  {
      title: "Keterangan Ekonomi",
      fields: [
        f.text("income", "Penghasilan per bulan", { placeholder: "Contoh: Rp 1.000.000 (kosongkan jika tidak ada)", optional: true }),
        f.text("category", "Kategori", { placeholder: "Contoh: Pra Sejahtera" }),
        f.text("kkmNumber", "Nomor KKM/KRM", { optional: true }),
      ],
    },
];

export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  "Surat keterangan siswa / kartu pelajar",
  opt("Fotokopi kartu bantuan (KKS/KIP/PKH)"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Tidak Mampu Sekolah" code="SKTS" :sections="sections" :documents="documents" />
</template>