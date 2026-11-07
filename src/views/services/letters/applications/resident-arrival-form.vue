<script>
// Formulir Permohonan Pindah Datang WNI
import { f, OPT, pemohon, DOC, wilayahDropdown, BIMOMARTANI, forPublic } from "@/data/letterFields";
import { signerSection } from "@/views/services/layout/signerFields.js";

// Desa/Kecamatan/Kab/Provinsi dijadikan dropdown (boleh diketik) oleh wilayahDropdown di bawah.
const alamatLengkap = (prefix, title, addressLabel = "Alamat") => ({
  title,
  fields: [
    f.area(`${prefix}Address`, addressLabel, { span: 2 }),
    f.text(`${prefix}Rt`, "RT"),
    f.text(`${prefix}Rw`, "RW"),
    f.text(`${prefix}Province`, "Provinsi"),
    f.text(`${prefix}Regency`, "Kabupaten/Kota"),
    f.text(`${prefix}District`, "Kecamatan"),
    f.text(`${prefix}Village`, "Desa/Kelurahan"),
    f.text(`${prefix}PostalCode`, "Kode Pos", { optional: true }),
    f.text(`${prefix}Phone`, "Nomor Telepon", { optional: true }),
  ],
});

// Data Pemohon: status kawin, agama, dan pekerjaan memakai daftar bernomor yang sama dengan Data Warga.
const pemohonPindah = () => {
  const coded = { maritalStatus: OPT.maritalKode, religion: OPT.religionKode, occupation: OPT.occupationKode };
  const section = pemohon();
  return { ...section, fields: section.fields.map((fld) => (coded[fld.key] ? { ...fld, options: coded[fld.key] } : fld)) };
};

export const sections = forPublic([
  {
    officerOnly: true, title: "Kode Dusun (Diisi Oleh Petugas)",
    hint: "Kode & nama Provinsi, Kab/Kota, Kecamatan, dan Desa sudah tercetak otomatis di PDF. Petugas mengisi kode dusun dan memilih dusun/dukuh tujuan (atau ketik manual).",
    fields: [f.text("hamletCode", "Kode Dusun", { optional: true, placeholder: "Contoh: 01" })],
  },

  {
    title: "Wilayah Tujuan",
    hint: "Pilih dari data dusun/dukuh yang tersedia atau ketik nama secara manual.",
    fields: [f.hamlet("hamlet", "Dusun/Dukuh/Kampung Tujuan")], // key sama dengan dropdown dusun di blok petugas (admin)
  },

  pemohonPindah(),

  {
    title: "Data KK Daerah Asal",
    fields: [
      f.kk("originKkNumber", "1. Nomor Kartu Keluarga (Asal)"),
      f.text("originHeadOfFamily", "2. Nama Kepala Keluarga (Asal)"),
    ],
  },

  // Alamat asal: dropdown (boleh diketik), kosong / dipilih sendiri
  wilayahDropdown(
    alamatLengkap("origin", "Alamat Asal", "Alamat"),
    "origin",
    undefined,
    {},
  ),

  {
    title: "Data Kepindahan",
    hint: "Dipakai untuk mengisi otomatis daftar keluarga yang datang.",
    fields: [
      f.select("relocationType", "Jenis Kepindahan", OPT.relocationType, { span: 2, optional: true }),
    ],
  },

  {
    title: "Data KK Daerah Tujuan",
    fields: [
      f.select("destinationKkStatus", "1. Status KK Bagi Yang Pindah", OPT.kkStatusNo),
      f.kk("destinationKkNumber", "2. Nomor Kartu Keluarga (Tujuan)"),
      f.text("destinationHeadOfFamily", "4. Nama Kepala Keluarga (Tujuan)"),
      f.date("arrivalDate", "5. Tanggal Kedatangan"),
    ],
  },

  // Alamat tujuan (di kalurahan ini): dropdown (boleh diketik), default Bimomartani/Ngemplak/Sleman/DIY
  wilayahDropdown(
    alamatLengkap("destination", "Alamat Tujuan (di kalurahan ini)", "Alamat yang Dituju"),
    "destination",
    undefined,
    BIMOMARTANI,
  ),

  {
    title: "Keluarga yang Datang",
    fields: [
      f.rows("familyMembers", "Anggota keluarga yang datang", [
        { key: "nik", label: "NIK" },
        { key: "name", label: "Nama" },
        { key: "shdk", label: "Status Hubungan dalam Keluarga", type: "select", options: OPT.shdkKode },
        { key: "validUntil", label: "Masa Berlaku KTP", type: "date", optional: true, lifetime: true },
      ], { max: 6, autoByType: "relocationType" }),
    ],
  },

  // TTD (3): 1. Petugas registrasi  2. Lurah Bimomartani  3. Pemohon (= Nama Lengkap pemohon di atas)
  signerSection([["officer", "Nama Petugas Registrasi", "registrationOfficer"]]),
]);

export const documents = [
  "Surat keterangan pindah (SKPWNI) dari daerah asal",
  DOC.ktp,
  DOC.kk,
  DOC.rt,
];
</script>

<script setup>
import LetterWizard from "@/views/services/layout/LetterWizard.vue";
</script>

<template>
  <LetterWizard title="Formulir Permohonan Pindah Datang WNI" code="SKD" :sections="sections" :documents="documents" />
</template>