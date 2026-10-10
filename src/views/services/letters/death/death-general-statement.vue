<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Mohon Akta Kematian
// Template PDF: letters/death/death-general-statement.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC } from "@/data/letterFields";

// Langkah 1: isian sesuai urutan template surat
// (Nama pejabat, Jabatan, Nomor surat, dan Keperluan diisi sistem/petugas di Blade, bukan oleh pemohon)
export const sections = [
  {
    title: "Data Yang Diterangkan",
    fields: [
      { key: "nama", label: "Nama", type: "text", required: true },
      { key: "tempat_lahir", label: "Tempat Lahir", type: "text", required: true },
      { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date", required: true },
      { key: "nik", label: "NIK", type: "nik", required: true },
      {
        key: "jenis_kelamin",
        label: "Jenis Kelamin",
        type: "select",
        options: ["Laki-laki", "Perempuan"],
        required: true,
      },
      {
        key: "status_perkawinan",
        label: "Status Perkawinan",
        type: "select",
        options: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"],
        required: true,
      },
      {
        key: "agama",
        label: "Agama",
        type: "select",
        options: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu", "Kepercayaan"],
        required: true,
      },
      { key: "pekerjaan", label: "Pekerjaan", type: "text", required: true },
      { key: "alamat", label: "Alamat", type: "textarea", required: true },
      { key: "pergi_ke", label: "Pergi ke", type: "text", placeholder: "contoh: Kantor Dukcapil", required: true },
    ],
  },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.ktp, DOC.kk];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Mohon Akta Kematian" code="PKU" :sections="sections" :documents="documents" />
</template>