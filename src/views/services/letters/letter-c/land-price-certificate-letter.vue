<script>
// Surat Keterangan Harga Tanah
// Template PDF: letters/letter-c/land-price-certificate-letter.blade.php
import { DOC, DOC_PBB, f } from "@/data/letterFields";

export const sections = [
  {
    title: "Data Tanah",
    fields: [
      f.text("certificateNumber", "No. Sertifikat/NIB"),
      f.text("area", "Luas tanah (m²)", { placeholder: "Contoh: 250" }),
      f.text("ownerName", "Nama Pemilik"),
    ],
  },
  {
    title: "Letak Tanah",
    fields: [
      f.text("hamlet", "Padukuhan"),
      // Kalurahan layanan dikunci; harga pembanding tetap bisa berasal dari luar.
      f.text("village", "Kalurahan/Desa", { default: "Bimomartani", readonly: true }),
      f.text("district", "Kapanewon", { default: "Ngemplak", readonly: true }),
      f.text("city", "Kota/Kabupaten", { default: "Sleman", readonly: true }),
    ],
  },
  {
    title: "Harga Tanah Pasaran Berkisar",
    fields: [
      f.text("priceMin", "Harga terendah (Rp)", { placeholder: "Contoh: 1.500.000" }),
      f.text("priceMax", "Harga tertinggi (Rp)", { placeholder: "Contoh: 2.500.000" }),
    ],
  },
];

export const documents = [DOC.ktp, DOC.kk, DOC_PBB, "Fotokopi sertifikat/bukti kepemilikan tanah"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Harga Tanah" code="KHT" :sections="sections" :documents="documents" />
</template>
