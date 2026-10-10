<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Laporan Kematian (KODE F-2.28)
// Template PDF: letters/death/death-report.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, OPT, f } from "@/data/letterFields";

// Langkah 1: isian sesuai urutan template surat
export const sections = [
  // Template: "Yang bertanda tangan di bawah ini saya" (1-6) + Hubungan dengan Yang Meninggal
  {
    title: "Data Pelapor",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.nik("reporterNik", "NIK Pelapor", { from: "nik" }), // 1. NIK
      f.text("reporterName", "Nama Lengkap Pelapor", { from: "fullName" }), // 2. Nama Lengkap
      f.date("reporterBirthDate", "Tanggal Lahir", { from: "birthDate" }), // 3. Tanggal Lahir
      f.text("reporterAge", "Umur (tahun)", { placeholder: "Contoh: 40" }), // 4. Umur
      f.select("reporterOccupation", "Pekerjaan", OPT.occupation, { from: "occupation", editable: true }), // 5. Pekerjaan
      f.area("reporterAddress", "Alamat Pelapor", { from: "address", span: 2 }), // 6. Alamat
      f.text("reporterRelation", "Hubungan dengan Yang Meninggal", {
        span: 2,
        placeholder: "Contoh: Anak, Istri, Saudara",
      }),
    ],
  },
  // Template: "Dengan ini melaporkan Kematian" (1-16)
  {
    title: "Data Almarhum/Almarhumah",
    fields: [
      f.text("deceasedName", "Nama Lengkap"), // 1
      f.nik("deceasedNik", "NIK"), // 2 — WAJIB (tanpa optional)
      f.kk("familyCardNumber", "No KK"), // 3
      f.select("deceasedGender", "Jenis Kelamin", OPT.gender), // 4
      f.text("deceasedBirthPlace", "Tempat Dilahirkan"), // 5
      f.select("deceasedReligion", "Agama", OPT.religion), // 6
      f.select("deceasedOccupation", "Pekerjaan", OPT.occupation, { editable: true }), // 7
      f.area("deceasedAddress", "Alamat", { span: 2 }), // 8
      f.text("deceasedChildOrder", "Anak ke (dengan huruf)", { placeholder: "Contoh: Kedua" }), // 9
      f.date("deathDate", "Meninggal Hari/Tanggal"), // 10 (nama hari dihitung di Blade)
      f.time("deathTime", "Jam Meninggal"), // 11 (tulisan "WIB" ditambah di Blade)
      f.text("deathCause", "Sebab"), // 12
      f.area("deathCauseDetail", "Rincian Sebab", { span: 2, optional: true }), // 13
      f.text("deathInformant", "Yang Menerangkan", { placeholder: "Contoh: Dokter / Bidan / Kepala Dusun" }), // 14
      f.text("deathPlace", "Tempat Meninggal"), // 15
      f.text("deathRegency", "Kab/Kota Meninggal"), // 16
    ],
  },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.suratKematian,
  DOC.kk,
  "Fotokopi KTP almarhum/almarhumah",
  "Fotokopi KTP pelapor",
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Laporan Kematian" code="PLM" :sections="sections" :documents="documents" />
</template>