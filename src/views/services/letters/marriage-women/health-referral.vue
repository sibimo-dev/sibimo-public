<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Pengantar Tes Kesehatan
// Template PDF: letters/marriage-women/letters/health-referral.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, OPT, arrange, f, pemohon } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Urutan data pemohon mengikuti template: Nama, Jenis Kelamin, Tempat/Tgl Lahir, NIK, Kewarganegaraan,
// Agama, Pendidikan, Pekerjaan, Status, Alamat. Lalu Kelakuan, Tujuan ke, Keperluan, Keterangan lain-lain.
export const sections = arrange(
  [
    pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan")]),
    {
      title: "Pemeriksaan Kesehatan",
      fields: [
        f.text("conduct", "Kelakuan"),
        f.text("destination", "Tujuan ke"),
        f.text("need", "Keperluan"),
        f.text("validDate", "Surat Pengantar Berlaku Tanggal"),
        f.area("note", "Keterangan lain-lain", { span: 2, optional: true }),
      ],
    },
  ],
  {
    fields: { "Data Pemohon": ["name", "gender", "birthPlace", "birthDate", "nik", "nationality", "religion", "education", "occupation", "maritalStatus", "address"] },
  },
);

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.ktp, DOC.kk, DOC.rt];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Pengantar Tes Kesehatan" code="PKS" :sections="sections" :documents="documents" />
</template>