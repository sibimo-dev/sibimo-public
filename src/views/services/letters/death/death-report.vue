<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Laporan Kematian
// Template PDF: letters/death/death-report.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { DOC, deathDeceased, deathSigner, signerNames, forPublic } from "@/data/letterFields";

// Langkah 1: Yang Bertanda Tangan (umur dihitung dari tanggal lahir) + Dengan Ini Melaporkan Kematian
export const sections = forPublic([
  deathSigner(["nik", "name", "birthDate", "occupation", "address", "relation"]),
  deathDeceased(
    ["name", "nik", "kk", "gender", "birthPlace", "religion", "occupation", "address", "deathDate", "deathDay", "deathTime", "deathCause", "deathCauseDetail", "informant", "deathPlace", "deathCity"],
    "Dengan Ini Melaporkan Kematian",
    { birthPlace: "Tempat Dilahirkan", deathPlace: "Tempat Meninggal" },
  ),
  // TTD di xlsx: Dukuh & Pelapor. Pelapor = Yang Bertanda Tangan di atas; Lurah/Petugas tidak jadi field (ada di otorisasi).
  signerNames(["hamletHead"], "Opsional. Tanda tangan Pelapor memakai data Yang Bertanda Tangan di atas. Isi nama Dukuh bila ingin dicetak; kosongkan bila ditulis tangan."),
]);

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor"];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Laporan Kematian" code="PLM" :sections="sections" :documents="documents" />
</template>
