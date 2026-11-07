<script>
// Surat Keterangan Keramaian
// Template PDF: letters/event-permit-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, DOC, OPT, forPublic } from "@/data/letterFields";

// Langkah 1: isian disesuaikan urut dengan template surat
export const sections = forPublic([
  {
    title: "Data Pemohon",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.text("name", "Nama Lengkap", { from: "fullName" }),
      f.nik("nik", "NIK", { from: "nik" }),
      f.text("birthPlace", "Tempat Lahir", { from: "birthPlace" }),
      f.date("birthDate", "Tanggal Lahir", { from: "birthDate" }),
      f.select("gender", "Jenis Kelamin", OPT.gender, { from: "gender" }),
      f.select("maritalStatus", "Status Perkawinan", OPT.marital, { from: "maritalStatus" }),
      f.select("religion", "Agama", OPT.religion, { from: "religion" }),
      f.occupation("occupation", "Pekerjaan", { from: "occupation" }),
      f.area("address", "Alamat", { from: "address", span: 2 }),
      f.text("destination", "Pergi ke", { placeholder: "Contoh: Bimomartani, Ngemplak, Sleman" }),
      f.text("necessity", "Keperluan", { placeholder: "Contoh: Mengadakan acara pernikahan" }),
    ],
  },
  {
    title: "Kegiatan/Acara",
    fields: [
      f.date("eventDate", "Pada Hari/Tanggal"),
      f.time("eventTime", "Jam"),
      f.text("eventPlace", "Tempat"),
      f.text("eventParticipants", "Peserta", { placeholder: "Contoh: Warga sekitar, ± 200 orang" }),
      f.text("eventObjective", "Tujuan"),
      f.text("responsiblePerson", "Penanggung Jawab"),
    ],
  },
]);

// Langkah 2: dokumen pendukung (hanya FC KTP & FC KK)
export const documents = [
  DOC.ktp,
  DOC.kk,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Keramaian" code="IZK" :sections="sections" :documents="documents" />
</template>