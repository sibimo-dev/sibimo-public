<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian
// Template PDF: letters/death/death-data-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, deathDeceased, deathSigner, signerNames, forPublic } from "@/data/letterFields";

// Langkah 1: Yang Bertanda Tangan (umur dihitung dari tanggal lahir) + Identitas Yang Dilaporkan
export const sections = forPublic([
  deathSigner(["nik", "name", "birthPlace", "birthDate", "occupation", "address"]),
  deathDeceased(["name", "nik", "birthPlace", "birthDate", "deathDate", "deathDay", "deathTime", "deathPlace"], "Identitas Yang Dilaporkan", { deathPlace: "Tempat Meninggal" }),
  // TTD di xlsx (7): Yang menyatakan (= Yang Bertanda Tangan di atas), Saksi I, Saksi II, Ketua RT, Ketua RW, Dukuh, Lurah/Petugas.
  // Lurah/Petugas tidak jadi field (ada di otorisasi).
  signerNames(["witness1", "witness2", "rtHead", "rwHead", "hamletHead"], "Opsional. Tanda tangan Yang Menyatakan memakai data Yang Bertanda Tangan di atas. Isi nama Saksi, Ketua RT/RW, dan Dukuh bila ingin dicetak; kosongkan bila ditulis tangan."),
]);

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian" code="PDM" :sections="sections" :documents="documents" />
</template>
