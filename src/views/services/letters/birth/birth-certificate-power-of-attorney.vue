<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Kuasa
// Template PDF: letters/birth/birth-certificate-power-of-attorney.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, f, opt, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [person("grantor", "Pemberi Kuasa (Ayah)", ["name", "occupation", "address"]), person("grantee", "Penerima Kuasa (Pelapor)", ["name", "occupation", "address"]),
     { title: "Data Anak", fields: [f.text("childName", "Nama Anak"), f.date("reportDate", "Tanggal Pelaporan")] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = ["Fotokopi KTP pemberi kuasa", "Fotokopi KTP penerima kuasa", DOC.kk, opt("Surat keterangan lahir")];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Kuasa" code="KAK" :sections="sections" :documents="documents" />
</template>
