<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Permohonan Akta Kematian
// Template PDF: letters/death/death-certificate-application.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, almarhum, f, pelaporKematian, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [{ title: "Data Keluarga", fields: [f.kk("familyCardNumber"), f.text("headOfFamilyName", "Nama Kepala Keluarga")] }, almarhum(),
     person("mother", "Data Ibu Almarhum", ["name", "nik", "address"]), person("father", "Data Ayah Almarhum", ["name", "nik", "address"]), pelaporKematian()];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Permohonan Akta Kematian" code="AKM" :sections="sections" :documents="documents" />
</template>
