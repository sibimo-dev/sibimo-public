<script>
// Surat Keterangan Wali Hakim
import { DOC, N7, calonIstri, calonSuami, f, opt } from "@/data/letterFields";

export const sections = [calonIstri(N7), calonSuami(N7), { title: "Alasan Wali Hakim", fields: [f.area("judgeGuardianReason", "Sebab dilangsungkan dengan wali hakim", { span: 2 })] }];

export const documents = [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir, opt("Surat keterangan kematian/ketiadaan wali")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Wali Hakim" code="PWH" :sections="sections" :documents="documents" />
</template>