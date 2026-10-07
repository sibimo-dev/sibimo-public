/* Kumpulan "cetakan" isian yang dipakai berulang oleh file-file surat.
   Satu surat = satu file .vue yang menyusun `sections` + `documents` dari sini. */

/* ---------- Pilihan dropdown ---------- */
export const OPT = {
  gender: ["Laki-laki", "Perempuan"],
  religion: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Khonghucu"],
  marital: ["Belum Kawin", "Kawin", "Kawin Tercatat", "Kawin Belum Tercatat", "Cerai Hidup", "Cerai Mati"],
  education: ["Tidak/Belum Sekolah", "SD", "SMP", "SMA/SMK", "D1/D2/D3", "D4/S1", "S2", "S3"],
  occupation: ["Belum/Tidak Bekerja", "Pelajar/Mahasiswa", "Ibu Rumah Tangga", "Petani", "Buruh", "Wiraswasta", "Karyawan Swasta", "PNS/ASN", "TNI/Polri", "Pensiunan"],
  shdk: ["Kepala Keluarga", "Suami", "Istri", "Anak", "Menantu", "Cucu", "Orang Tua", "Mertua", "Famili Lain", "Pembantu", "Lainnya"],
  kkStatus: ["Numpang KK", "Membuat KK Baru", "Nomor KK Tetap"],
  delivery: ["Rumah Sakit", "Puskesmas", "Polindes", "Rumah Bersalin", "Rumah", "Lainnya"],
  attendant: ["Dokter", "Bidan", "Dukun", "Lainnya"],
  plurality: ["Tunggal", "Kembar 2", "Kembar 3", "Kembar 4", "Lainnya"],
};

/* ---------- Pembuat field ---------- */
const make = (type) => (key, label, opts = {}) => ({ key, label, type, ...opts });
export const f = {
  text: make("text"),
  area: make("textarea"),
  select: (key, label, options, opts = {}) => ({ key, label, type: "select", options, ...opts }),
  date: make("date"),
  time: make("time"),
  /** checkbox banyak pilihan (nilai = array) */
  checks: (key, label, options, opts = {}) => ({ key, label, type: "checks", options, ...opts }),
  /** daftar baris berulang (anggota keluarga, saksi, dst). columns = [{ key, label, type?, options? }] */
  rows: (key, label, columns, opts = {}) => ({ key, label, type: "rows", columns, ...opts }),
  nik: (key, label = "NIK", opts = {}) => ({ key, label, type: "text", digits: 16, placeholder: "16 digit NIK", ...opts }),
  kk: (key, label = "Nomor KK", opts = {}) => ({ key, label, type: "text", digits: 16, placeholder: "16 digit Nomor KK", ...opts }),
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Data pemohon (terisi otomatis dari data warga yang sudah diverifikasi) ---------- */
export const pemohon = (extra = []) => ({
  title: "Data Pemohon",
  hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
  fields: [
    f.text("name", "Nama Lengkap", { from: "fullName" }),
    f.nik("nik", "NIK", { from: "nik" }),
    f.text("birthPlace", "Tempat Lahir", { from: "birthPlace" }),
    f.date("birthDate", "Tanggal Lahir", { from: "birthDate" }),
    f.select("gender", "Jenis Kelamin", OPT.gender, { from: "gender" }),
    f.select("maritalStatus", "Status Perkawinan", OPT.marital, { from: "maritalStatus" }),
    f.select("religion", "Agama", OPT.religion, { from: "religion" }),
    f.select("occupation", "Pekerjaan", OPT.occupation, { from: "occupation", editable: true }),
    f.area("address", "Alamat", { from: "address", span: 2 }),
    ...extra,
  ],
});

/* Pemohon ringkas: untuk surat yang datanya didominasi orang lain (anak, almarhum, calon pengantin, dll). */
export const pemohonRingkas = (extra = []) => ({
  title: "Data Pemohon",
  hint: "Terisi otomatis dari data warga. Koreksi bila ada yang tidak sesuai.",
  fields: [
    f.text("name", "Nama Lengkap", { from: "fullName" }),
    f.nik("nik", "NIK", { from: "nik" }),
    f.area("address", "Alamat", { from: "address", span: 2 }),
    ...extra,
  ],
});

/* ---------- Data orang lain ----------
   parts: name nik birth gender religion occupation education nationality marital address
   Kunci field = prefix + bagian, contoh person("groom", ...) → groomName, groomNik, groomBirthPlace, ... */
const PART = {
  name: (p) => [f.text(`${p}Name`, "Nama Lengkap")],
  nik: (p) => [f.nik(`${p}Nik`)],
  birth: (p) => [f.text(`${p}BirthPlace`, "Tempat Lahir"), f.date(`${p}BirthDate`, "Tanggal Lahir")],
  gender: (p) => [f.select(`${p}Gender`, "Jenis Kelamin", OPT.gender)],
  religion: (p) => [f.select(`${p}Religion`, "Agama", OPT.religion)],
  occupation: (p) => [f.select(`${p}Occupation`, "Pekerjaan", OPT.occupation, { editable: true })],
  education: (p) => [f.select(`${p}Education`, "Pendidikan Terakhir", OPT.education)],
  nationality: (p) => [f.text(`${p}Nationality`, "Kewarganegaraan", { default: "WNI" })],
  marital: (p) => [f.select(`${p}Marital`, "Status Perkawinan", OPT.marital)],
  address: (p) => [f.area(`${p}Address`, "Alamat", { span: 2 })],
};
export const person = (prefix, title, parts = ["name", "nik", "birth", "address"], extra = [], hint) => ({
  title,
  hint,
  fields: [...parts.flatMap((part) => PART[part](prefix)), ...extra],
});

/* ---------- Keperluan surat ---------- */
export const keperluan = (purposeLabel = "Keperluan / Tujuan Surat", destinationLabel = "Surat ditujukan kepada / instansi") => ({
  title: "Keperluan Surat",
  fields: [
    f.area("purpose", purposeLabel, { span: 2, placeholder: "Jelaskan untuk apa surat ini diperlukan" }),
    ...(destinationLabel ? [f.text("destination", destinationLabel, { span: 2, placeholder: "Contoh: Bank BRI, Kantor Kecamatan, Sekolah, dst." })] : []),
  ],
});

/* ---------- Dokumen pendukung yang umum ---------- */
export const DOC = {
  ktp: "Fotokopi/foto KTP pemohon",
  kk: "Fotokopi/foto Kartu Keluarga (KK)",
  rt: "Surat pengantar RT/RW",
  akta: "Fotokopi buku nikah / kutipan akta perkawinan",
  aktaLahir: "Fotokopi akta kelahiran",
  suratKematian: "Surat keterangan kematian dari rumah sakit/dokter/RT",
  ktpSaksi: "Fotokopi KTP 2 (dua) orang saksi",
  pasFoto: "Pas foto terbaru berlatar belakang biru",
  bukti: "Dokumen/bukti pendukung lain yang relevan",
};
export const opt = (label) => ({ label, optional: true });

/* ---------- Blok data keluarga (kelahiran, kematian) dipakai beberapa surat ---------- */
export const keluarga = () => ({
  title: "Data Keluarga",
  fields: [f.kk("familyCardNumber"), f.text("headOfFamilyName", "Nama Kepala Keluarga")],
});

export const anak = ({ detail = false } = {}) => ({
  title: "Data Bayi/Anak",
  fields: [
    f.nik("childNik", "NIK Anak", { optional: true, placeholder: "Isi bila sudah ada" }),
    f.text("childName", "Nama Lengkap Anak"),
    f.select("childGender", "Jenis Kelamin", OPT.gender),
    f.text("childBirthPlace", "Tempat Kelahiran"),
    f.date("childBirthDate", "Tanggal Lahir"),
    ...(detail
      ? [
          f.time("childBirthTime", "Jam Kelahiran"),
          f.select("childDeliveryPlace", "Tempat Dilahirkan", OPT.delivery),
          f.select("childPlurality", "Jenis Kelahiran", OPT.plurality),
          f.text("childBirthOrder", "Kelahiran ke-"),
          f.select("childAttendant", "Penolong Kelahiran", OPT.attendant),
          f.text("childWeight", "Berat Bayi (Kg)"),
          f.text("childLength", "Panjang Bayi (Cm)"),
        ]
      : []),
  ],
});

export const ortu = (prefix, title) =>
  person(prefix, title, ["name", "nik", "birth", "occupation", "nationality", "address"]);

export const perkawinanOrtu = () => ({
  title: "Data Perkawinan Orang Tua",
  fields: [
    f.text("marriageCertificateNumber", "Nomor Kutipan Akta Perkawinan"),
    f.date("marriageDate", "Tanggal Perkawinan"),
    f.text("marriageRecordPlace", "Tempat Pencatatan Perkawinan", { optional: true }),
  ],
});

export const saksi = (n) => person(`witness${n}`, `Data Saksi ${n}`, ["name", "nik", "birth", "address"]);

export const almarhum = () => ({
  title: "Data Almarhum/Almarhumah",
  fields: [
    f.nik("deceasedNik", "NIK", { optional: true }),
    f.text("deceasedName", "Nama Lengkap"),
    f.select("deceasedGender", "Jenis Kelamin", OPT.gender),
    f.text("deceasedBirthPlace", "Tempat Lahir"),
    f.date("deceasedBirthDate", "Tanggal Lahir"),
    f.select("deceasedReligion", "Agama", OPT.religion),
    f.select("deceasedOccupation", "Pekerjaan", OPT.occupation, { editable: true }),
    f.date("deathDate", "Tanggal Meninggal"),
    f.time("deathTime", "Jam Meninggal"),
    f.text("deathPlace", "Tempat Meninggal"),
    f.text("deathCause", "Sebab Kematian"),
    f.area("deceasedAddress", "Alamat Terakhir", { span: 2 }),
  ],
});

export const pelaporKematian = () => ({
  title: "Data Pelapor",
  fields: [
    f.text("reporterName", "Nama Lengkap Pelapor", { from: "fullName" }),
    f.nik("reporterNik", "NIK Pelapor", { from: "nik" }),
    f.text("reporterRelation", "Hubungan dengan Almarhum/ah", { placeholder: "Contoh: Anak, Istri, Saudara" }),
    f.area("reporterAddress", "Alamat Pelapor", { from: "address", span: 2 }),
  ],
});

/* ---------- Pernikahan ---------- */
export const akad = () => ({
  title: "Rencana Akad Nikah",
  fields: [
    f.date("akadDate", "Tanggal Akad"),
    f.time("akadTime", "Jam Akad"),
    f.text("akadPlace", "Tempat Akad Nikah", { span: 2 }),
  ],
});
const NIKAH = ["name", "nik", "birth", "nationality", "religion", "occupation", "education", "address"];
export const calonSuami = (parts = NIKAH) => person("groom", "Data Calon Suami", parts, [f.text("groomBin", "Bin (nama ayah)")]);
export const calonIstri = (parts = NIKAH) => person("bride", "Data Calon Istri", parts, [f.text("brideBinti", "Binti (nama ayah)")]);
export const ortuNikah = (prefix, title, binLabel) =>
  person(prefix, title, ["name", "nik", "birth", "nationality", "religion", "occupation", "address"], [f.text(`${prefix}Bin`, binLabel)]);

/* ---------- Alamat lengkap (surat pindah/datang, dll) ---------- */
export const alamat = (prefix, title) => ({
  title,
  fields: [
    f.area(`${prefix}Address`, "Alamat (jalan/nomor)", { span: 2 }),
    f.text(`${prefix}Rt`, "RT"),
    f.text(`${prefix}Rw`, "RW"),
    f.text(`${prefix}Hamlet`, "Dusun/Dukuh/Kampung", { optional: true }),
    f.text(`${prefix}Village`, "Desa/Kelurahan"),
    f.text(`${prefix}District`, "Kecamatan"),
    f.text(`${prefix}Regency`, "Kabupaten/Kota"),
    f.text(`${prefix}Province`, "Provinsi"),
    f.text(`${prefix}PostalCode`, "Kode Pos", { optional: true }),
    f.text(`${prefix}Phone`, "Telepon", { optional: true }),
  ],
});

/* Jadikan semua isian dalam satu blok opsional (mis. data pasangan terdahulu). */
export const optional = (section) => ({ ...section, fields: section.fields.map((x) => ({ ...x, optional: true })) });

/* ---------- Blok & dokumen yang dipakai bersama beberapa surat paket (nikah, kelahiran, kematian, Letter C) ---------- */
export const N7 = ["name", "nik", "birth", "nationality", "religion", "occupation", "address"]; // bagian data tanpa pendidikan
export const eduNat = () => [f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })];
export const calonPengantin = () => ({ title: "Calon Pengantin", fields: [f.text("groomName", "Nama Calon Suami"), f.text("brideName", "Nama Calon Istri")] });

export const DOC_LAHIR = "Surat keterangan lahir dari dokter/bidan/penolong kelahiran";
export const bayi = () => [keluarga(), anak({ detail: true }), ortu("mother", "Data Ibu Kandung"), ortu("father", "Data Ayah Kandung"), perkawinanOrtu(),
  pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan bayi", { placeholder: "Contoh: Ayah, Ibu, Kakek" })]), saksi(1), saksi(2)];
export const dokBayi = () => [DOC_LAHIR, DOC.kk, "Fotokopi KTP ayah dan ibu", DOC.akta, DOC.ktpSaksi];

export const jenazah = () => [keluarga(), almarhum(), pelaporKematian(), saksi(1), saksi(2)];
export const dokJenazah = () => [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor", DOC.ktpSaksi];

export const DOC_LETTER_C = "Fotokopi Letter C / bukti kepemilikan tanah";
export const DOC_PBB = opt("Fotokopi SPPT PBB");
