<script>
// Surat Keterangan Wali Nikah
import { DOC, N7, calonIstri, calonSuami, f, person } from "@/data/letterFields";

export const sections = [
  person("guardian", "Data Wali Nikah", N7, [
    f.text("guardianBin", "Bin (nama ayah dari wali)"),
    f.text("guardianRelation", "Hubungan wali dengan calon istri (contoh: Ayah Kandung, Kakak Kandung)"),
    f.area("guardianReason", "Alasan wali bukan ayah kandung (kosongkan jika ayah kandung)", { span: 2, optional: true }),
  ]),
  calonIstri(N7),
  calonSuami(N7),
];

export const documents = ["Fotokopi KTP wali nikah", DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Wali Nikah" code="PWN" :sections="sections" :documents="documents" />
</template>