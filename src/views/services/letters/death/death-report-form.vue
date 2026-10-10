<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)
// Template PDF: letters/death/death-report-form.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { OPT, almarhum, arrange, birthWitness, dokJenazah, f, keluarga, ortu, pelaporKematian } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Template terdiri dari: No. KK & Kepala Keluarga, JENAZAH (14 baris), IBU (6), AYAH (6),
// PELAPOR (7), SAKSI I (4), SAKSI II (4). "Data Administrasi" diisi petugas, bukan pemohon.
// Hari meninggal dihitung dari tanggal meninggal di Blade.
// Tanggal Lapor diisi sistem/petugas saat pengajuan masuk.

// Jenazah: tambahan yang ada di template tapi belum ada di almarhum()
const deceased = almarhum();
deceased.fields.push(
  f.text("deceasedAge", "Umur (tahun)", { placeholder: "Contoh: 65" }),
  f.text("deceasedChildOrder", "Anak ke- (dengan huruf)"),
  f.text("deathCertifiedBy", "Yang Menerangkan"),
);

// Pelapor: template memuat tempat/tanggal lahir dan pekerjaan
const reporter = pelaporKematian();
reporter.fields.push(
  f.text("reporterBirthPlace", "Tempat Lahir", { from: "birthPlace" }),
  f.date("reporterBirthDate", "Tanggal Lahir", { from: "birthDate" }),
  f.select("reporterOccupation", "Pekerjaan", OPT.occupation, { from: "occupation", editable: true }),
);

// arrange() hanya mengubah salinan untuk surat ini, surat lain tidak ikut berubah.
export const sections = arrange(
  [keluarga(), deceased, ortu("mother", "Data Ibu Almarhum/ah"), ortu("father", "Data Ayah Almarhum/ah"), reporter, birthWitness(1), birthWitness(2)],
  {
    fields: {
      "Data Keluarga": ["familyCardNumber", "headOfFamilyName"],
      "Data Almarhum/Almarhumah": [
        "deceasedNik", "deceasedName", "deceasedGender", "deceasedBirthPlace", "deceasedBirthDate", "deceasedAge", "deceasedReligion", "deceasedOccupation",
        "deceasedAddress", "deceasedChildOrder", "deathDate", "deathTime", "deathCause", "deathPlace", "deathCertifiedBy",
      ],
      "Data Ibu Almarhum/ah": ["motherNik", "motherName", "motherBirthPlace", "motherBirthDate", "motherOccupation", "motherAddress", "motherNationality"],
      "Data Ayah Almarhum/ah": ["fatherNik", "fatherName", "fatherBirthPlace", "fatherBirthDate", "fatherOccupation", "fatherAddress", "fatherNationality"],
      "Data Pelapor": ["reporterNik", "reporterName", "reporterBirthPlace", "reporterBirthDate", "reporterOccupation", "reporterAddress"],
    },
    patch: {
      deceasedNik: { optional: false }, // NIK almarhum WAJIB
      motherNik: { optional: true, placeholder: "16 digit NIK (opsional)" }, // NIK ibu opsional
      fatherNik: { optional: true, placeholder: "16 digit NIK (opsional)" }, // NIK ayah opsional
      motherNationality: { default: "" }, // dikosongkan, diisi pemohon
      fatherNationality: { default: "" },
    },
    drop: ["reporterRelation"], // tidak dicetak di template ini
  },
);

// Langkah 2: dokumen pendukung (opt(...) = tidak wajib)
export const documents = dokJenazah();
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)" code="LPM" :sections="sections" :documents="documents" />
</template>