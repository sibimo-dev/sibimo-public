<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Pernyataan Tanggung Jawab Mutlak Kebenaran Sebagai Pasangan Suami Istri
// Template PDF: letters/birth/spousal-relationship-responsibility-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, f, pemohonRingkas, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohonRingkas([f.kk("kkNumber", "Nomor KK"), f.select("familyRelationship", "Status hubungan keluarga", ["Suami", "Istri", "Anak"])]),
     person("husband", "Data Suami", ["name", "nik", "birth", "occupation", "address"]),
     person("wife", "Data Istri", ["name", "nik", "birth", "occupation", "address"]),
     { title: "Saksi", fields: [f.rows("marriageWitnesses", "Saksi", [{ key: "name", label: "Nama" }, { key: "nik", label: "NIK" }], { min: 2, max: 2 })] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = ["Fotokopi KTP suami dan istri", DOC.kk, DOC.ktpSaksi];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pernyataan Tanggung Jawab Mutlak Kebenaran Sebagai Pasangan Suami Istri" code="PHS" :sections="sections" :documents="documents" />
</template>
