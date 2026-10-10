<script>
// Surat Pengantar Tes Kesehatan
import { DOC, OPT, f, keperluan, pemohon } from "@/data/letterFields";

export const sections = [{ ...pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" }), f.text("behavior", "Kelakuan", { default: "Baik" })]), title: "Data Calon Suami" },
     keperluan("Keperluan", "Tujuan ke"),
     { title: "Keterangan Tambahan", fields: [f.date("validUntil", "Surat pengantar berlaku sampai tanggal"), f.area("additionalNote", "Keterangan lain-lain", { span: 2, optional: true })] }];

export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pengantar Tes Kesehatan" code="KUM" :sections="sections" :documents="documents" />
</template>