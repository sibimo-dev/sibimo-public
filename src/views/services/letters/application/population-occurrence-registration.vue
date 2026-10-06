<script setup>
// Formulir Pendaftaran Peristiwa Kependudukan
// Template PDF: letters/population-occurrence-registration-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohonRingkas, DOC, opt, keluarga } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohonRingkas([f.kk("familyCardNumber", "Nomor KK")]),
  {
      title: "Jenis Permohonan",
      hint: "Pilih satu atau lebih.",
      fields: [
        f.checks("applicationTypes", "Jenis permohonan", [
          "KK: Membentuk keluarga baru", "KK: Penggantian kepala keluarga", "KK: Pisah KK", "KK: Pindah datang",
          "KK: WNI LN karena pindah", "KK: Rentan adminduk", "KK: Menumpang dalam KK", "KK: Peristiwa penting",
          "KK: Perubahan elemen data", "KK: Hilang", "KK: Rusak",
          "KTP-el: Baru", "KTP-el: Pindah datang", "KTP-el: Hilang", "KTP-el: Rusak",
          "KTP-el: Perpanjangan ITAP", "KTP-el: Perubahan status kewarganegaraan", "KTP-el: Luar domicili",
        ]),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  opt(DOC.bukti),
];
</script>

<template>
  <LetterWizard title="Formulir Pendaftaran Peristiwa Kependudukan" code="PPK" :sections="sections" :documents="documents" />
</template>
