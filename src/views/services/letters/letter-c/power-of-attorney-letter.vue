<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Kuasa
// Template PDF: letters/letter-c/power-of-attorney-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, DOC_LETTER_C, DOC_PBB, f, pemohon, person } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [pemohon(),
     person("attorney", "Data Penerima Kuasa", ["name", "nik", "birth", "address"], [f.select("attorneyGender", "Jenis Kelamin", ["Laki-laki", "Perempuan"])]),
     { title: "Data Pewaris (Almarhum/ah)", fields: [f.text("deceasedName", "Nama Pewaris"), f.text("deceasedDeathPlace", "Tempat Meninggal")] },
     { title: "Mengetahui", fields: [f.text("endorserOffice", "Kelurahan/Notaris", { optional: true }), f.text("endorserName", "Nama yang mengetahui", { optional: true })] }];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB, DOC.suratKematian, "Fotokopi KTP penerima kuasa"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Kuasa" code="KLC" :sections="sections" :documents="documents" />
</template>
