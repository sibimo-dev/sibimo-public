<script>
// sections & documents di-export supaya juga dibaca paket surat (data/letterBundles.js) dan halaman register.
// Ubah isian surat ini di sini saja; paket & register ikut berubah.
// Surat Keterangan Kematian
// Template PDF: letters/death/death-certificate.blade.php
// 1 file = 1 surat. Isi `sections` (langkah 1) dan `documents` (langkah 2).
// Langkah 3 (cek ulang, ceklis dokumen asli, kirim, pop-up hasil) sudah ditangani LetterWizard.
import { OPT, almarhum, arrange, birthWitness, dokJenazah, f, keluarga, ortu, pelaporKematian } from "@/data/letterFields";

// Langkah 1: isian sesuai surat yang diajukan
// Template terdiri dari: Nama Kepala Keluarga & Nomor KK, JENAZAH (15 baris), IBU (6), AYAH (6),
// PELAPOR (8), SAKSI (4), SAKSI II (4). Nomor surat diisi sistem/petugas.
// Hari meninggal dihitung dari tanggal meninggal di Blade.

// Tipe field baru: tanda tangan digital (nilai = data URL PNG). Dirender oleh SignaturePad.vue
// lewat LetterFormFields.vue. Kalau nanti dipakai di surat lain, pindahkan ke objek `f` di letterFields.js.
const signature = (key, label, opts = {}) => ({ key, label, type: "signature", span: 2, ...opts });

// Tanggal hari ini tanpa jam (DatePicker membutuhkan objek Date)
const today = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Jenazah: tambahan yang ada di template tapi belum ada di almarhum()
const deceased = almarhum();
deceased.fields.push(
  f.text("deceasedAge", "Umur (tahun)", { placeholder: "Contoh: 65" }),
  f.text("deceasedChildOrder", "Anak ke- (dengan huruf)"),
  f.text("deathLocation", "Tempat Kematian"),
  f.text("deathCertifiedBy", "Yang Menerangkan"),
);

// Pelapor: template memuat tempat/tanggal lahir, umur, pekerjaan, tanggal lapor, dan tanda tangan
const reporter = pelaporKematian();
reporter.fields.push(
  f.text("reporterBirthPlace", "Tempat Lahir", { from: "birthPlace" }),
  f.date("reporterBirthDate", "Tanggal Lahir", { from: "birthDate" }),
  f.text("reporterAge", "Umur (tahun)", { placeholder: "Contoh: 40" }),
  f.select("reporterOccupation", "Pekerjaan", OPT.occupation, { from: "occupation", editable: true }),
  f.date("reportDate", "Tanggal Lapor", { default: today() }),
  signature("reporterSignature", "Tanda Tangan Pelapor"),
);

const KTP_ADDRESS = { label: "Alamat (Sesuai KTP)" };

// arrange() hanya mengubah salinan untuk surat ini, surat lain tidak ikut berubah.
export const sections = arrange(
  [keluarga(), deceased, ortu("mother", "Data Ibu Almarhum/ah"), ortu("father", "Data Ayah Almarhum/ah"), reporter, birthWitness(1), birthWitness(2)],
  {
    fields: {
      "Data Keluarga": ["headOfFamilyName", "familyCardNumber"],
      "Data Almarhum/Almarhumah": [
        "deceasedNik", "deceasedName", "deceasedGender", "deceasedBirthPlace", "deceasedBirthDate", "deceasedAge", "deceasedReligion", "deceasedOccupation",
        "deceasedAddress", "deceasedChildOrder", "deathDate", "deathPlace", "deathTime", "deathCause", "deathLocation", "deathCertifiedBy",
      ],
      "Data Ibu Almarhum/ah": ["motherNik", "motherName", "motherBirthPlace", "motherBirthDate", "motherOccupation", "motherAddress", "motherNationality"],
      "Data Ayah Almarhum/ah": ["fatherNik", "fatherName", "fatherBirthPlace", "fatherBirthDate", "fatherOccupation", "fatherAddress", "fatherNationality"],
      "Data Pelapor": [
        "reporterNik", "reporterName", "reporterBirthPlace", "reporterBirthDate", "reporterAge", "reporterOccupation",
        "reporterAddress", "reportDate", "reporterSignature",
      ],
    },
    patch: {
      deceasedNik: { optional: false }, // NIK almarhum WAJIB
      motherNik: { optional: true, placeholder: "16 digit NIK (opsional)" }, // NIK ibu opsional
      fatherNik: { optional: true, placeholder: "16 digit NIK (opsional)" }, // NIK ayah opsional
      motherNationality: { default: "" }, // dikosongkan, diisi pemohon
      fatherNationality: { default: "" },
      motherAddress: KTP_ADDRESS,
      fatherAddress: KTP_ADDRESS,
      reporterAddress: KTP_ADDRESS,
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
  <LetterWizard title="Surat Keterangan Kematian" code="KKT" :sections="sections" :documents="documents" />
</template>