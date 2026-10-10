<script>
// Surat Keterangan Belum Menikah Lagi
import { DOC, eduNat, f, opt, pemohon } from "@/data/letterFields";

export const sections = [{ ...pemohon(eduNat()), title: "Data Calon Suami" }, { title: "Data Pendaftaran Nikah", fields: [f.text("registrationNumber", "Nomor pendaftaran", { optional: true }), f.date("registrationDate", "Tanggal pendaftaran", { optional: true })] }];

export const documents = [DOC.ktp, DOC.kk, opt("Akta cerai/surat kematian pasangan terdahulu")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Menikah Lagi" code="PBM" :sections="sections" :documents="documents" />
</template>