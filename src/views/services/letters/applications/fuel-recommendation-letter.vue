<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Surat Rekomendasi Pembelian Jenis BBM Tertentu
// Template PDF: letters/fuel-recommendation-letter.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { f, pemohonRingkas, DOC, opt } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
export const sections = [
  pemohonRingkas(),
  {
      title: "Data Usaha",
      fields: [
        f.text("businessType", "Jenis usaha/kegiatan"),
        f.area("businessAddress", "Alamat usaha", { span: 2 }),
        f.text("consumer", "Konsumen"),
      ],
    },
  {
      title: "Kebutuhan BBM",
      fields: [
        f.rows("fuelItems", "Rincian kebutuhan BBM", [
          { key: "retailer", label: "Pengecer solar" },
          { key: "type", label: "Jenis BBM" },
          { key: "description", label: "Kebutuhan (liter/jam/hari/minggu/bulan)" },
        ], { max: 6 }),
        f.text("total", "Jumlah total"),
        f.text("volumeAllocation", "Alokasi volume"),
        f.text("pickupLocation", "Tempat pengambilan"),
        f.text("distributorNumber", "Nomor lembaga penyalur"),
        f.text("distributorLocation", "Lokasi lembaga penyalur"),
      ],
    },
];

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [
  DOC.ktp,
  DOC.kk,
  "Surat izin usaha (NIB/SKU)",
  opt("Foto lokasi/alat yang menggunakan BBM"),
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Rekomendasi Pembelian Jenis BBM Tertentu" code="BBM" :sections="sections" :documents="documents" />
</template>
