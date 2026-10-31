<script>
// Surat Kuasa
// Template PDF: letters/letter-c/power-of-attorney-letter.blade.php
import { DOC, DOC_LETTER_C, DOC_PBB, f, OPT, forPublic } from "@/data/letterFields";

export const sections = forPublic([
  {
    title: "Data Pemberi Kuasa (Pihak Pertama)",
    fields: [
      f.text("name", "Nama"),
      f.text("birthPlaceDate", "Tempat/Tgl. Lahir", { placeholder: "Contoh: Sleman, 17 Agustus 1990" }),
      f.select("gender", "Jenis Kelamin", OPT.gender),
      f.text("nik", "NIK"),
      f.area("address", "Alamat", { span: 2 }),
    ],
  },
  {
    title: "Data Pewaris (Almarhum/Almarhumah)",
    fields: [
      f.text("deceasedName", "Nama Almarhum/Almarhumah"),
      f.text("deceasedDeathPlace", "Meninggal dunia di"),
    ],
  },
  {
    title: "Data Penerima Kuasa (Pihak Kedua)",
    fields: [
      f.text("attorneyName", "Nama"),
      f.text("attorneyBirthPlaceDate", "Tempat/Tgl. Lahir", { placeholder: "Contoh: Sleman, 17 Agustus 1990" }),
      f.select("attorneyGender", "Jenis Kelamin", OPT.gender),
      f.text("attorneyNik", "NIK"),
      f.area("attorneyAddress", "Alamat", { span: 2 }),
    ],
  },
  // TTD di xlsx (3): Penerima kuasa (attorneyName), Pemberi kuasa (name), Kalurahan/Notaris.
  // Penerima & pemberi kuasa SUDAH punya isian. Nama yang mengetahui (Kalurahan/Notaris) tidak dibuat field (tidak perlu).
  {
    title: "Mengetahui",
    fields: [
      f.text("endorserOffice", "Kelurahan/Notaris", { optional: true }),
    ],
  },
]);

export const documents = [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB, DOC.suratKematian, "Fotokopi KTP penerima kuasa"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Kuasa" code="KLC" :sections="sections" :documents="documents" />
</template>
