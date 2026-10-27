<script>
// Surat Keterangan Belum Kawin
import { DOC, f } from "@/data/letterFields";

// Gunakan sumber data warga secara eksplisit agar semua field tetap terisi
// walaupun session lama hanya menyimpan nama, NIK, dan alamat.
export const sections = [
  {
    title: "Data Pemohon",
    hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
    fields: [
      f.text("applicantName", "Nama Lengkap", { from: "fullName" }),
      f.nik("applicantNik", "NIK", { from: "nik" }),
      f.text("applicantBirthPlace", "Tempat Lahir", { from: "birthPlace" }),
      f.date("applicantBirthDate", "Tanggal Lahir", { from: "birthDate" }),
      f.select("applicantGender", "Jenis Kelamin", ["Laki-laki", "Perempuan"], { from: "gender" }),
      f.select("applicantReligion", "Agama", ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"], { from: "religion" }),
      f.select("applicantOccupation", "Pekerjaan", ["Belum/Tidak Bekerja", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Petani", "Buruh", "Wiraswasta", "Karyawan Swasta", "PNS/ASN", "TNI/Polri", "Pensiunan"], { from: "occupation", editable: true }),
      f.area("applicantAddress", "Alamat", { from: "address", span: 2 }),
    ],
  },
];

export const documents = [
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Surat Keterangan Belum Kawin" code="KSB" :sections="sections" :documents="documents" />
</template>
