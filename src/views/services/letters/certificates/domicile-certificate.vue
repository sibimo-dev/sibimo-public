<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Keterangan Domisili
// Template PDF: letters/domicile-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohon, keperluan, DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohon(),
  {
      title: "Data Domisili",
      fields: [
        f.area("domicileAddress", "Alamat domisili saat ini", { span: 2 }),
        f.text("residenceDuration", "Lama bertempat tinggal"),
        f.select("residenceStatus", "Status tempat tinggal", ["Milik sendiri", "Sewa/Kontrak", "Kos", "Menumpang"]),
      ],
    },
  keperluan(),
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Domisili" code="KDM" :sections="sections" :documents="documents" />
</template>
