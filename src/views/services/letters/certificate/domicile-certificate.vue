<script setup>
// Surat Keterangan Domisili
// Template PDF: letters/domicile-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
import { f, pemohon, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
const sections = [
  pemohon(),
  {
      title: "Data Usaha/Lembaga",
      fields: [
        f.text("companyName", "Nama usaha/lembaga"),
        f.text("companyActivity", "Bidang kegiatan"),
        f.area("companyAddress", "Alamat usaha/lembaga", { span: 2 }),
        f.select("buildingStatus", "Status bangunan", ["Milik sendiri", "Sewa", "Kontrak", "Pinjam pakai"]),
        f.text("buildingUse", "Peruntukan bangunan"),
        f.text("personInCharge", "Penanggung jawab"),
        f.text("employeeCount", "Jumlah karyawan"),
        f.text("companyPhone", "Telepon", { optional: true }),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
  "Bukti kepemilikan/sewa tempat usaha",
  opt("NPWP/akta pendirian"),
];
</script>

<template>
  <LetterWizard title="Surat Keterangan Domisili" code="KDM" :sections="sections" :documents="documents" />
</template>
