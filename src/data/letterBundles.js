/* Paket surat (bundle): 1 pengajuan = banyak surat.
   Definisi tiap surat DISALIN apa adanya dari file surat aslinya (kunci field tidak diubah) supaya
   template PDF di backend tetap menerima kunci yang sama. Yang baru hanya pengelompokan + `aliases`.

   Cara menambah/mengurangi surat dalam paket: edit array `letters` pada paket terkait di bawah. */
import { f, OPT, pemohon, pemohonRingkas, person, keperluan, DOC, opt, optional, akad, calonSuami, calonIstri, ortuNikah, keluarga, anak, ortu, perkawinanOrtu, saksi, almarhum, pelaporKematian } from "./letterFields";

/* ---------- Pembuat surat ---------- */
const letter = (id, title, code, group, description, sections, documents = [], slug = "") => ({ id, title, code, group, description, sections, documents, slug });

const N7 = ["name", "nik", "birth", "nationality", "religion", "occupation", "address"]; // bagian data tanpa pendidikan
const eduNat = () => [f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })];
const calonPengantin = () => ({ title: "Calon Pengantin", fields: [f.text("groomName", "Nama Calon Suami"), f.text("brideName", "Nama Calon Istri")] });

/* ============ NIKAH ============
   Nama surat mengikuti daftar surat di scaffold (letters/married-man = 10 surat, letters/marriage-women = 12 surat).
   Isian & dokumen disalin dari berkas surat aslinya; argumen terakhir `letter(...)` = slug berkas itu di data/letterRegistry. */
const G_DAFTAR = "Pendaftaran Nikah";
const G_SURAT = "Pengantar & Keterangan";
const G_STATUS = "Status Perkawinan";
const G_SETUJU = "Persetujuan & Wali";

const NIKAH = {
  /* --- dipakai Laki-laki & Perempuan (judul sama atau dibedakan lewat id) --- */
  khn: () => letter("khn", "Permohonan Kehendak Nikah", "KHN", G_DAFTAR, "Permohonan kehendak nikah ke KUA.",
    [pemohonRingkas(), calonPengantin(), akad()],
    [DOC.ktp, DOC.kk, "Fotokopi KTP calon pasangan", DOC.pasFoto, DOC.aktaLahir], "marriage-application-letter"),
  dpn: () => letter("dpn", "Data Isian Pendaftaran Nikah", "DPN", G_DAFTAR, "Data lengkap kedua mempelai, orang tua, dan status.",
    [
      akad(),
      calonSuami(),
      { title: "Status Calon Suami", fields: [f.select("groomStatus", "Status", ["Jejaka", "Duda", "Beristri"])] },
      ortuNikah("groomFather", "Data Ayah Calon Suami", "Bin (nama ayah dari ayah)"),
      ortuNikah("groomMother", "Data Ibu Calon Suami", "Binti (nama ayah dari ibu)"),
      calonIstri(),
      { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"])] },
      ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"),
      ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"),
      optional(person("groomPrev", "Data Istri Terdahulu Calon Suami (bila duda)", N7, [f.date("groomPrevDeathDate", "Tanggal Meninggal"), f.text("groomPrevDeathPlace", "Tempat Meninggal")])),
      optional(person("bridePrev", "Data Suami Terdahulu Calon Istri (bila janda)", ["name", "nik"], [f.date("bridePrevDeathDate", "Tanggal Meninggal"), f.text("bridePrevDeathPlace", "Tempat Meninggal")])),
    ],
    [DOC.ktp, DOC.kk, DOC.aktaLahir, DOC.pasFoto, opt("Fotokopi KTP orang tua kedua calon"), opt("Akta cerai/surat kematian pasangan terdahulu")], "marriage-registration-data-sheet"),
  pnk: () => letter("pnk", "Pengantar Nikah", "PNK", G_SURAT, "Surat pengantar nikah dari kelurahan.",
    [pemohon([...eduNat(), f.text("previousSpouseName", "Nama istri/suami terdahulu (bila ada)", { optional: true })]),
     ortuNikah("father", "Data Ayah", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu", "Binti (nama ayah dari ibu)")],
    [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir], "marriage-introduction-letter"),
  skn: () => letter("skn", "Surat Pengantar Tes Kesehatan", "SKN", G_SURAT, "Surat keterangan umum untuk keperluan nikah.",
    [pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" }), f.text("behavior", "Kelakuan", { default: "Baik" })]),
     keperluan(),
     { title: "Keterangan Tambahan", fields: [f.area("additionalNote", "Keterangan lain-lain", { span: 2, optional: true })] }],
    [DOC.ktp, DOC.kk, DOC.rt], "general-certificate-letter"),
  knn: () => letter("knn", "Surat Keterangan Numpang Nikah", "KNN", G_SURAT, "Bila akad nikah dilangsungkan di luar wilayah.",
    [pemohon([f.text("applicantBin", "Bin/Binti (nama ayah)"), ...eduNat()]),
     person("spouse", "Data Calon Pasangan", N7, [f.text("spouseBin", "Bin/Binti (nama ayah)")]),
     { title: "Tempat Menikah", fields: [f.text("marriagePlace", "KUA/tempat akad nikah tujuan", { span: 2 })] }],
    [DOC.ktp, DOC.kk, DOC.rt, opt("Fotokopi KTP calon pasangan")], "marriage-lodging-certificate-letter"),
  kbp: () => letter("kbp", "Surat Keterangan Belum Pernah Menikah", "KBP", G_STATUS, "Keterangan belum pernah menikah.",
    [pemohon([f.text("alias", "Nama alias (bila ada)", { optional: true })])], [DOC.ktp, DOC.kk, DOC.rt], "never-married-certificate-letter"),
  pbm: () => letter("pbm", "Surat Keterangan Belum Menikah Lagi", "PBM", G_STATUS, "Untuk duda/janda yang belum menikah lagi.",
    [pemohon(eduNat()), { title: "Data Pendaftaran Nikah", fields: [f.text("registrationNumber", "Nomor pendaftaran", { optional: true }), f.date("registrationDate", "Tanggal pendaftaran", { optional: true })] }],
    [DOC.ktp, DOC.kk, opt("Akta cerai/surat kematian pasangan terdahulu")], "not-remarried-statement-letter"),
  kkn: () => letter("kkn", "Surat Keterangan Kematian", "KKN", G_STATUS, "Untuk calon suami yang berstatus duda cerai mati.",
    [pemohon(), person("deceased", "Data Pasangan Terdahulu (Almarhum/ah)", ["name", "birth", "nationality", "religion", "occupation", "address"], [f.date("deathDate", "Tanggal Meninggal"), f.text("deathPlace", "Tempat Meninggal")])],
    [DOC.suratKematian, DOC.ktp, DOC.kk, DOC.rt], "death-certificate-for-marriage-letter"),
  scm: () => letter("scm", "Persetujuan Calon Pengantin", "SCM", G_SETUJU, "Persetujuan kedua calon pengantin.",
    [calonSuami(), calonIstri()],
    ["Fotokopi KTP calon suami", "Fotokopi KTP calon istri", DOC.kk], "bride-groom-consent-letter"),
  sio: () => letter("sio", "Surat Izin Orang Tua", "SIO", G_SETUJU, "Izin orang tua bagi anak yang akan menikah.",
    [ortuNikah("father", "Data Ayah", "Bin (nama ayah dari ayah)"), ortuNikah("mother", "Data Ibu", "Binti (nama ayah dari ibu)"),
     ortuNikah("child", "Data Anak yang Akan Menikah", "Bin/Binti (nama ayah)"), ortuNikah("childSpouse", "Data Calon Pasangan Anak", "Bin/Binti (nama ayah)")],
    ["Fotokopi KTP ayah dan ibu", "Fotokopi KTP anak", DOC.kk], "parental-consent-letter"),

  /* --- khusus Perempuan --- */
  n2: () => letter("n2", "Permohonan Kehendak Nikah", "N2", G_DAFTAR, "Permohonan kehendak nikah (N2) — data calon pengantin dan rencana akad.",
    [pemohonRingkas(), calonPengantin(), akad()],
    ["Surat pengantar nikah dari desa/kelurahan (N1)", "Persetujuan calon mempelai (N3)", DOC.ktp, DOC.aktaLahir, DOC.kk, DOC.pasFoto, opt("Surat keterangan wali nikah")], "n2"),
  fpn: () => letter("fpn", "Data Isian Pendaftaran Nikah", "FPN", G_DAFTAR, "Data calon suami, calon istri, dan rencana akad.",
    [akad(), calonSuami(), calonIstri()],
    [DOC.ktp, DOC.kk, DOC.aktaLahir, DOC.pasFoto], "registration-form"),
  n1: () => letter("n1", "Pengantar Nikah", "N1", G_SURAT, "Pengantar nikah (N1) dari kelurahan — data calon istri dan orang tua.",
    [calonIstri(),
     { title: "Status Calon Istri", fields: [f.select("brideStatus", "Status", ["Perawan", "Janda"]), f.text("exHusbandName", "Nama suami terdahulu (bila janda)", { optional: true })] },
     ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)")],
    [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir], "n1"),
  phk: () => letter("phk", "Surat Pengantar Tes Kesehatan", "PHK", G_SURAT, "Surat keterangan/pengantar pemeriksaan kesehatan pranikah.",
    [pemohon([f.select("education", "Pendidikan Terakhir", OPT.education), f.text("nationality", "Kewarganegaraan", { default: "WNI" })]),
     { title: "Pemeriksaan Kesehatan", fields: [f.text("conduct", "Kelakuan", { default: "Baik" }), f.text("destination", "Tujuan ke", { placeholder: "Contoh: Puskesmas Ngemplak" }), f.text("need", "Keperluan", { placeholder: "Contoh: Pemeriksaan kesehatan pranikah" }), f.area("note", "Keterangan lain-lain", { span: 2, optional: true })] }],
    [DOC.ktp, DOC.kk, DOC.rt], "health-referral"),
  pnn: () => letter("pnn", "Surat Keterangan Numpang Nikah", "PNN", G_SURAT, "Bila akad nikah dilangsungkan di luar wilayah.",
    [calonIstri(), calonSuami()], [DOC.ktp, DOC.kk, DOC.rt], "marriage-lodging"),
  kbm: () => letter("kbm", "Surat Keterangan Belum Pernah Menikah", "KBM", G_STATUS, "Keterangan belum menikah untuk keperluan nikah.",
    [pemohon(eduNat())], [DOC.ktp, DOC.kk, DOC.rt], "unmarried-certificate"),
  pbn: () => letter("pbn", "Surat Keterangan Belum Menikah Lagi", "PBN", G_STATUS, "Pernyataan belum menikah lagi bermaterai.",
    [pemohon(eduNat())], [DOC.ktp, DOC.kk, DOC.rt], "unmarried-statement"),
  n6: () => letter("n6", "Surat Keterangan Kematian", "N6", G_STATUS, "Untuk calon istri yang berstatus janda cerai mati.",
    [person("exHusband", "Data Suami Terdahulu (Almarhum)", N7, [f.text("exHusbandBin", "Bin (nama ayah)"), f.date("exHusbandDiedAt", "Tanggal Meninggal"), f.text("exHusbandDiedPlace", "Tempat Meninggal")]), calonIstri()],
    [DOC.suratKematian, DOC.ktp, DOC.kk], "n6"),
  n4: () => letter("n4", "Persetujuan Calon Pengantin", "N4", G_SETUJU, "Persetujuan kedua calon pengantin (N4).",
    [calonSuami(N7), calonIstri(N7)],
    [DOC.ktp, DOC.kk], "n4"),
  n5: () => letter("n5", "Surat Izin Orang Tua", "N5", G_SETUJU, "Izin orang tua calon istri (N5).",
    [ortuNikah("brideFather", "Data Ayah Calon Istri", "Bin (nama ayah dari ayah)"), ortuNikah("brideMother", "Data Ibu Calon Istri", "Binti (nama ayah dari ibu)"), calonIstri(N7), calonSuami(N7)],
    ["Fotokopi KTP ayah dan ibu calon istri", DOC.kk], "n5"),
  swn: () => letter("swn", "Surat Keterangan Wali Nikah", "SWN", G_SETUJU, "Pernyataan wali nikah calon istri.",
    [person("guardian", "Data Wali Nikah", ["name", "nik", "birth", "occupation", "address"], [f.text("guardianBin", "Bin (nama ayah)"), f.text("guardianRelation", "Hubungan dengan calon istri"), f.area("guardianReason", "Keterangan/alasan", { span: 2 })]),
     calonIstri(["name", "nik", "birth", "address"]), calonSuami(["name", "nik", "birth", "address"])],
    ["Fotokopi KTP wali nikah", DOC.ktp, DOC.kk], "guardian-statement"),
  swh: () => letter("swh", "Surat Keterangan Wali Hakim", "SWH", G_SETUJU, "Bila akad nikah dilangsungkan dengan wali hakim.",
    [calonIstri(), calonSuami(), { title: "Alasan Wali Hakim", fields: [f.area("judgeGuardianReason", "Sebab dilangsungkan dengan wali hakim", { span: 2 })] }],
    [DOC.ktp, DOC.kk, DOC.rt, DOC.aktaLahir, opt("Surat keterangan kematian/ketiadaan wali")], "judge-guardian"),
};

/* ============ KELAHIRAN ============ */
const G_LAPOR = "Permohonan & Pelaporan";
const G_PENGANTAR = "Pengantar & Keterangan";
const G_KUASA = "Pernyataan & Kuasa";
const DOC_LAHIR = "Surat keterangan lahir dari dokter/bidan/penolong kelahiran";
const bayi = () => [keluarga(), anak({ detail: true }), ortu("mother", "Data Ibu Kandung"), ortu("father", "Data Ayah Kandung"), perkawinanOrtu(),
  pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan bayi", { placeholder: "Contoh: Ayah, Ibu, Kakek" })]), saksi(1), saksi(2)];
const dokBayi = () => [DOC_LAHIR, DOC.kk, "Fotokopi KTP ayah dan ibu", DOC.akta, DOC.ktpSaksi];
const DOC_TERLAMBAT = opt("Surat pernyataan keterlambatan pelaporan");

const LAHIR = {
  akl: () => letter("akl", "Permohonan Akta Kelahiran", "AKL", G_LAPOR, "Formulir permohonan akta kelahiran.",
    [keluarga(), anak(), ortu("mother", "Data Ibu Kandung"), ortu("father", "Data Ayah Kandung"), perkawinanOrtu(),
     pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan anak"), f.text("reporterPhone", "No. HP/Telepon aktif", { from: "phoneNumber" })])],
    [DOC_LAHIR, DOC.kk, "Fotokopi KTP ayah dan ibu/wali/pelapor", DOC.akta, DOC.ktpSaksi, opt("Surat kuasa dan fotokopi KTP penerima kuasa"), opt("Fotokopi paspor (bagi WNI bukan penduduk/orang asing)"), opt("SPTJM kebenaran data kelahiran"), opt("SPTJM kebenaran sebagai pasangan suami istri")]),
  lpk: () => letter("lpk", "Formulir Pelaporan Kelahiran (Untuk Mendapatkan Akta Kelahiran)", "LPK", G_LAPOR, "Formulir pelaporan kelahiran.", bayi(), dokBayi()),
  skt: () => letter("skt", "Surat Pencatatan Kelahiran Terlambat", "SKT", G_LAPOR, "Khusus pelaporan terlambat — memuat alasan keterlambatan.",
    [pemohonRingkas(), anak(), { title: "Keterangan Tambahan", fields: [f.text("childBirthOrder", "Anak ke-"), f.area("lateReason", "Alasan keterlambatan pelaporan", { span: 2 })] },
     person("mother", "Data Ibu", ["name", "nik"]), person("father", "Data Ayah", ["name", "nik"])],
    [DOC_LAHIR, DOC.kk, "Fotokopi KTP ayah dan ibu", DOC.akta, opt("Surat pernyataan keterlambatan pelaporan")]),
  pcl: () => letter("pcl", "Pelaporan Pencatatan Kelahiran", "PCL", G_PENGANTAR, "Pengantar pencatatan kelahiran dari kelurahan.", bayi(), dokBayi()),
  pak: () => letter("pak", "Surat Keterangan Mohon Akta Kelahiran", "PAK", G_PENGANTAR, "Pengantar pengurusan akta kelahiran.",
    [pemohon(), { title: "Data Anak", fields: [f.text("childName", "Nama anak")] }],
    ["Surat keterangan lahir dari dokter/bidan", DOC.ktp, DOC.kk, DOC.akta]),
  klh: () => letter("klh", "Surat Keterangan Kelahiran", "KLH", G_PENGANTAR, "Surat keterangan kelahiran.", bayi(), dokBayi()),
  pld: () => letter("pld", "Laporan Kelahiran Luar Domisili", "PLD", G_PENGANTAR, "Bila bayi lahir di luar domisili.",
    [{ title: "Domisili", fields: [f.text("hamlet", "Dusun"), f.area("currentResidence", "Alamat domisili saat ini", { span: 2 })] }, ...bayi()], dokBayi()),
  plk: () => letter("plk", "Laporan Kelahiran", "PLK", G_KUASA, "Pernyataan kebenaran data kelahiran.",
    [anak({ detail: true }),
     { title: "Keterangan Persalinan", fields: [f.text("deliveryAddress", "Alamat tempat dilahirkan", { span: 2 }), f.text("gestationalAge", "Usia kehamilan (minggu)"), f.text("deliveryMethod", "Cara persalinan", { placeholder: "Normal/Caesar" }), f.text("deliveryCost", "Biaya persalinan", { optional: true })] },
     ortu("mother", "Data Ibu"), ortu("father", "Data Ayah"), pemohonRingkas([f.text("reporterRelation", "Hubungan pelapor dengan bayi")])],
    [DOC.kk, "Fotokopi KTP ayah dan ibu", DOC.akta, opt("Surat keterangan lahir dari penolong kelahiran")]),
  sps: () => letter("sps", "Surat Pernyataan Tanggung Jawab Mutlak Kebenaran Sebagai Pasangan Suami Istri", "SPS", G_KUASA, "Pernyataan tanggung jawab mutlak kebenaran sebagai pasangan suami istri.",
    [pemohonRingkas([f.kk("kkNumber", "Nomor KK"), f.select("familyRelationship", "Status hubungan keluarga", ["Suami", "Istri", "Anak"])]),
     person("husband", "Data Suami", ["name", "nik", "birth", "occupation", "address"]),
     person("wife", "Data Istri", ["name", "nik", "birth", "occupation", "address"]),
     { title: "Saksi", fields: [f.rows("marriageWitnesses", "Saksi", [{ key: "name", label: "Nama" }, { key: "nik", label: "NIK" }], { min: 2, max: 2 })] }],
    ["Fotokopi KTP suami dan istri", DOC.kk, DOC.ktpSaksi]),
  kak: () => letter("kak", "Surat Kuasa", "KAK", G_KUASA, "Bila pengurusan dikuasakan kepada orang lain.",
    [person("grantor", "Pemberi Kuasa (Ayah)", ["name", "occupation", "address"]), person("grantee", "Penerima Kuasa (Pelapor)", ["name", "occupation", "address"]),
     { title: "Data Anak", fields: [f.text("childName", "Nama Anak"), f.date("reportDate", "Tanggal Pelaporan")] }],
    ["Fotokopi KTP pemberi kuasa", "Fotokopi KTP penerima kuasa", DOC.kk, opt("Surat keterangan lahir")]),
};

/* ============ KEMATIAN ============ */
const jenazah = () => [keluarga(), almarhum(), pelaporKematian(), saksi(1), saksi(2)];
const dokJenazah = () => [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor", DOC.ktpSaksi];

const MATI = {
  akm: () => letter("akm", "Permohonan Akta Kematian", "AKM", G_LAPOR, "Formulir permohonan akta kematian.",
    [{ title: "Data Keluarga", fields: [f.kk("familyCardNumber"), f.text("headOfFamilyName", "Nama Kepala Keluarga")] }, almarhum(),
     person("mother", "Data Ibu Almarhum", ["name", "nik", "address"]), person("father", "Data Ayah Almarhum", ["name", "nik", "address"]), pelaporKematian()],
    [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor"]),
  lpm: () => letter("lpm", "Formulir Pelaporan Kematian (Untuk Mendapatkan Akta Kematian)", "LPM", G_LAPOR, "Formulir pelaporan kematian.", jenazah(), dokJenazah()),
  pck: () => letter("pck", "Pelaporan Pencatatan Kematian", "PCK", G_PENGANTAR, "Pengantar pencatatan kematian dari kelurahan.", jenazah(), dokJenazah()),
  plm: () => letter("plm", "Laporan Kematian", "PLM", G_PENGANTAR, "Pengantar lapor kematian.",
    [keluarga(), almarhum(), pelaporKematian()], [DOC.suratKematian, DOC.kk, "Fotokopi KTP almarhum/almarhumah", "Fotokopi KTP pelapor"]),
  kkt: () => letter("kkt", "Surat Keterangan Kematian", "KKT", G_PENGANTAR, "Surat keterangan kematian.", jenazah(), dokJenazah()),
  hpk: () => letter("hpk", "Perhitungan Selamatan 3 Hari Sampai 1000 Hari", "HPK", G_PENGANTAR, "Perhitungan hari peringatan kematian.",
    [pemohonRingkas(), { title: "Data Almarhum/ah", fields: [f.text("deceasedName", "Nama Almarhum/ah"), f.area("deceasedAddress", "Alamat", { span: 2 }), f.date("deathDate", "Tanggal Meninggal"), f.time("deathTime", "Jam Meninggal")] }],
    [DOC.ktp, opt(DOC.suratKematian)]),
  pdm: () => letter("pdm", "Surat Pernyataan Tanggung Jawab Mutlak (SPTJM) Kebenaran Data Kematian", "PDM", G_KUASA, "Pernyataan kebenaran data kematian.",
    [pemohonRingkas(), almarhum(), { title: "Pernyataan", fields: [f.area("statement", "Isi pernyataan", { span: 2 })] }],
    [DOC.suratKematian, DOC.ktp, DOC.kk]),
  pku: () => letter("pku", "Surat Keterangan Mohon Akta Kematian", "PKU", G_KUASA, "Pernyataan kematian untuk keperluan umum.",
    [pemohon(), almarhum()], [DOC.suratKematian, DOC.ktp, DOC.kk]),
  kkm: () => letter("kkm", "Surat Kuasa", "KKM", G_KUASA, "Bila pengurusan dikuasakan kepada orang lain.",
    [pemohon(), person("attorney", "Data Penerima Kuasa", ["name", "occupation", "address"]), { title: "Data Almarhum/ah", fields: [f.text("deceasedName", "Nama Almarhum/ah")] }],
    [DOC.ktp, "Fotokopi KTP penerima kuasa", DOC.suratKematian, DOC.kk]),
};

/* ============ LETTER C ============
   Empat surat pada Form Identifikasi Layanan ("Pernyataan Permohonan Data Letter C"). Kunci isian dicocokkan
   dengan variabel yang dibaca berkas blade di letters/letter-c (applicant, attorney, deceased, endorser, letter_c, land)
   supaya template PDF tidak error karena variabel kosong. */
const G_PERNYATAAN_C = "Pernyataan & Kuasa";
const G_KET_TANAH = "Keterangan Tanah";
const DOC_LETTER_C = "Fotokopi Letter C / bukti kepemilikan tanah";
const DOC_PBB = opt("Fotokopi SPPT PBB");

const LETTERC = {
  /* blade: applicant{name,nik,birth,gender,address,occupation}, letter_c{hamlet,owner_name}, hamlet_head_name */
  plc: () => letter("plc", "Surat Pernyataan Permohonan Data Letter C", "PLC", G_PERNYATAAN_C, "Pernyataan pemohon atas data Letter C (warisan atau konversi).",
    [pemohon(), { title: "Data Letter C", fields: [f.text("hamlet", "Dusun"), f.text("letterCOwnerName", "Nama pemilik pada Letter C"), f.text("hamletHeadName", "Nama kepala dusun", { optional: true })] }],
    [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB,
     opt("Akta kematian pemilik Letter C (untuk warisan; sebelum 2010 boleh surat keterangan kematian)"),
     opt("Fotokopi KTP & KK ahli waris (untuk warisan)"),
     opt("Fotokopi KTP & KK pemilik Letter C (untuk konversi)")]),
  /* blade: applicant (pemberi kuasa), attorney{name,birth,gender,nik,address}, deceased{name,death_place}, endorser{office,name} */
  klc: () => letter("klc", "Surat Kuasa", "KLC", G_PERNYATAAN_C, "Bila pengurusan Letter C dikuasakan kepada orang lain.",
    [pemohon(),
     person("attorney", "Data Penerima Kuasa", ["name", "nik", "birth", "address"], [f.select("attorneyGender", "Jenis Kelamin", ["Laki-laki", "Perempuan"])]),
     { title: "Data Pewaris (Almarhum/ah)", fields: [f.text("deceasedName", "Nama Pewaris"), f.text("deceasedDeathPlace", "Tempat Meninggal")] },
     { title: "Mengetahui", fields: [f.text("endorserOffice", "Kelurahan/Notaris", { optional: true }), f.text("endorserName", "Nama yang mengetahui", { optional: true })] }],
    [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB, DOC.suratKematian, "Fotokopi KTP penerima kuasa"]),
  /* blade: number, signature{name}, land{certificate_number,area,owner_name,hamlet,village,district,regency,price_min,price_max} */
  kht: () => letter("kht", "Surat Keterangan Harga Tanah", "KHT", G_KET_TANAH, "Keterangan harga pasaran tanah dari kalurahan.",
    [pemohon(), { title: "Data Tanah", fields: [f.text("certificateNumber", "Nomor Letter C/Sertifikat/NIB"), f.text("ownerName", "Nama pemilik"), f.text("area", "Luas tanah (m²)"),
      f.text("hamlet", "Padukuhan"), f.text("village", "Kalurahan/Desa", { default: "Bimomartani" }), f.text("district", "Kapanewon", { default: "Ngemplak" }), f.text("regency", "Kota/Kabupaten", { default: "Sleman" })] },
     { title: "Harga Pasaran", fields: [f.text("priceMin", "Harga pasaran terendah (Rp)", { optional: true }), f.text("priceMax", "Harga pasaran tertinggi (Rp)", { optional: true })] }],
    [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB]),
  /* blade: number, signature{name}, land{certificate_number,owner_name,area,area_in_words,measurement_letter_number,measurement_letter_date,hamlet} */
  kat: () => letter("kat", "Surat Keterangan Asal Tanah", "KAT", G_KET_TANAH, "Keterangan asal usul tanah dari kalurahan.",
    [pemohon(), { title: "Data Tanah", fields: [f.text("certificateNumber", "Nomor Letter C/Sertifikat"), f.text("ownerName", "Nama pemilik"), f.text("area", "Luas tanah (m²)"),
      f.text("hamlet", "Dusun"), f.text("areaInWords", "Luas (dengan huruf)"), f.text("measurementLetterNumber", "Nomor surat ukur", { optional: true }), f.date("measurementLetterDate", "Tanggal surat ukur", { optional: true })] }],
    [DOC.ktp, DOC.kk, DOC_LETTER_C, DOC_PBB]),
};

/* ---------- Pasangan kunci yang artinya sama (isian otomatis antar surat) ---------- */
const SUF = ["Name", "Nik", "BirthPlace", "BirthDate", "Nationality", "Religion", "Occupation", "Education", "Address", "Bin"];
const link = (a, b, suffixes = SUF) => suffixes.map((s) => [a + s, b + s]);
const APPLICANT = ["name", "nik", "birthPlace", "birthDate", "religion", "occupation", "address", "education", "nationality"];
const asPrefix = (p) => ["Name", "Nik", "BirthPlace", "BirthDate", "Religion", "Occupation", "Address", "Education", "Nationality"].map((s) => p + s);
const applicantAs = (p) => APPLICANT.map((k, i) => [k, asPrefix(p)[i]]);

const ALIAS_NIKAH_LAKI = [
  ...applicantAs("groom"), ["applicantBin", "groomBin"],
  ...link("father", "groomFather"), ...link("mother", "groomMother"),
  ...link("spouse", "bride", SUF.filter((s) => s !== "Bin")), ["spouseBin", "brideBinti"],
  ["previousSpouseName", "groomPrevName"], ...link("deceased", "groomPrev", ["Name", "BirthPlace", "BirthDate", "Nationality", "Religion", "Occupation", "Address"]),
  ["deathDate", "groomPrevDeathDate"], ["deathPlace", "groomPrevDeathPlace"],
  ...link("child", "groom"), ...link("childSpouse", "bride", SUF.filter((x) => x !== "Bin")), ["childSpouseBin", "brideBinti"],
];
const ALIAS_NIKAH_PEREMPUAN = [
  ...applicantAs("bride"), ["applicantBin", "brideBinti"],
  ...link("father", "brideFather"), ...link("mother", "brideMother"),
  ...link("spouse", "groom", SUF.filter((s) => s !== "Bin")), ["spouseBin", "groomBin"],
  ["previousSpouseName", "exHusbandName"], ["exHusbandName", "bridePrevName"], ["exHusbandNik", "bridePrevNik"],
  ["exHusbandDiedAt", "bridePrevDeathDate"], ["exHusbandDiedPlace", "bridePrevDeathPlace"],
];
const ALIAS_LAHIR = [["grantorName", "fatherName"], ["grantorOccupation", "fatherOccupation"], ["grantorAddress", "fatherAddress"],
  ["granteeName", "name"], ["granteeAddress", "address"], ["granteeOccupation", "occupation"]];
const ALIAS_MATI = [["name", "reporterName"], ["nik", "reporterNik"], ["address", "reporterAddress"]];
const ALIAS_LETTER_C = [["letterCOwnerName", "ownerName"]]; // pemilik pada Letter C = pemilik tanah pada surat keterangan

/* ---------- Paket ---------- */
const SLUGS = {
  akl: "birth-certificate-application-form", lpk: "birth-report-form", skt: "late-birth-registration-approval-decree", pcl: "birth-registration-report", pak: "birth-certificate-referral-letter",
  klh: "birth-attestation-letter", pld: "out-of-domicile-birth-report", plk: "birth-report-statement", kak: "birth-certificate-power-of-attorney", sps: "spousal-relationship-responsibility-statement",
  akm: "death-certificate-application", lpm: "death-report-form", pck: "death-registration-report", plm: "death-report", kkt: "death-certificate",
  hpk: "death-commemoration-calculation", pdm: "death-data-statement", pku: "death-general-statement", kkm: "death-power-of-attorney",
  plc: "letter-c-data-statement-letter", klc: "power-of-attorney-letter", kht: "land-price-certificate-letter", kat: "land-origin-certificate-letter",
};
const pick = (map, ids) => ids.map((id) => { const l = map[id](); return { ...l, slug: l.slug || SLUGS[id] || "" }; });

// 10 surat (married-man) dan 12 surat (marriage-women), sama dengan daftar di scaffold.
const NIKAH_LAKI = ["khn", "dpn", "pnk", "skn", "knn", "kbp", "pbm", "kkn", "scm", "sio"];
const NIKAH_PEREMPUAN = ["n2", "fpn", "n1", "phk", "pnn", "kbm", "pbn", "n6", "n4", "n5", "swn", "swh"];
// Kelahiran = 10 surat (Lama: semua; Baru: tanpa Keputusan Pencatatan Terlambat). Kematian = 9 surat (Lama: semua; Baru: tanpa SPTJM Data Kematian).
const LAHIR_BARU = ["akl", "lpk", "pcl", "pak", "klh", "pld", "plk", "kak", "sps"];
const LAHIR_LAMA = ["akl", "lpk", "skt", "pcl", "pak", "klh", "pld", "plk", "kak", "sps"];
const MATI_BARU = ["akm", "lpm", "pck", "plm", "kkt", "hpk", "pku", "kkm"];
const MATI_LAMA = ["akm", "lpm", "pck", "plm", "kkt", "hpk", "pdm", "pku", "kkm"];
const LETTER_C = ["plc", "klc", "kht", "kat"];

/* Paket "lama" = pelaporan terlambat: surat utama menerima dokumen opsional tambahan. */
const lateDoc = (ls, ids) => ls.map((l) => (ids.includes(l.id) ? { ...l, documents: [...l.documents, DOC_TERLAMBAT] } : l));

export const BUNDLES = [
  {
    slug: "permohonan-nikah-laki-laki", shortCode: "PKT-NKL", hue: "sky", icon: "pi pi-heart",
    title: "Permohonan Nikah Laki-laki",
    description: "Paket surat pengurusan nikah untuk calon suami. Pilih surat yang dibutuhkan, isi dalam satu pengajuan.",
    letters: pick(NIKAH, NIKAH_LAKI), aliases: ALIAS_NIKAH_LAKI,
  },
  {
    slug: "permohonan-nikah-perempuan", shortCode: "PKT-NKP", hue: "rose", icon: "pi pi-heart-fill",
    title: "Permohonan Nikah Perempuan",
    description: "Paket surat pengurusan nikah untuk calon istri. Pilih surat yang dibutuhkan, isi dalam satu pengajuan.",
    letters: pick(NIKAH, NIKAH_PEREMPUAN), aliases: ALIAS_NIKAH_PEREMPUAN,
  },
  {
    slug: "permohonan-akta-kelahiran-baru", shortCode: "PKT-LHB", hue: "emerald", icon: "pi pi-user-plus",
    title: "Permohonan Akta Kelahiran Baru",
    description: "Paket surat kelahiran yang dilaporkan tepat waktu. Pilih surat yang dibutuhkan dalam satu pengajuan.",
    letters: pick(LAHIR, LAHIR_BARU), aliases: ALIAS_LAHIR,
  },
  {
    slug: "permohonan-akta-kelahiran-lama", shortCode: "PKT-LHL", hue: "teal", icon: "pi pi-history",
    title: "Permohonan Akta Kelahiran Lama",
    description: "Paket surat kelahiran yang dilaporkan terlambat, termasuk keputusan pencatatan kelahiran terlambat.",
    letters: lateDoc(pick(LAHIR, LAHIR_LAMA), ["akl", "lpk"]), aliases: ALIAS_LAHIR,
  },
  {
    slug: "permohonan-akta-kematian-baru", shortCode: "PKT-MTB", hue: "violet", icon: "pi pi-book",
    title: "Permohonan Akta Kematian Baru",
    description: "Paket surat kematian yang dilaporkan tepat waktu. Pilih surat yang dibutuhkan dalam satu pengajuan.",
    letters: pick(MATI, MATI_BARU), aliases: ALIAS_MATI,
  },
  {
    slug: "permohonan-akta-kematian-lama", shortCode: "PKT-MTL", hue: "fuchsia", icon: "pi pi-calendar-times",
    title: "Permohonan Akta Kematian Lama",
    description: "Paket surat kematian yang dilaporkan terlambat. Pilih surat yang dibutuhkan dalam satu pengajuan.",
    letters: lateDoc(pick(MATI, MATI_LAMA), ["akm", "lpm"]), aliases: ALIAS_MATI,
  },
  {
    slug: "permohonan-data-letter-c", shortCode: "PKT-LTC", hue: "amber", icon: "pi pi-map",
    title: "Permohonan Data Letter C",
    description: "Paket surat pengurusan data Letter C: pernyataan, surat kuasa, keterangan harga tanah, dan keterangan asal usul tanah.",
    letters: pick(LETTERC, LETTER_C), aliases: ALIAS_LETTER_C,
  },
];

export const findBundle = (slug) => BUNDLES.find((b) => b.slug === slug) ?? null;

/* Entri katalog (bentuk sama dengan GENERAL_SERVICES). `category` diisi oleh GeneralCatalogView. */
export const BUNDLE_SERVICES = BUNDLES.map((b) => ({
  slug: b.slug,
  title: b.title,
  description: b.description,
  icon: b.icon,
  badge: "Paket Surat",
  shortCode: b.shortCode,
  keywords: b.letters.flatMap((l) => [l.title, l.code]),
  bundle: { count: b.letters.length, hue: b.hue },
  to: { name: "general-bundle", params: { bundle: b.slug } },
}));

/* Surat yang sudah masuk paket → disembunyikan dari katalog sebagai kartu terpisah.
   Dicocokkan lewat slug berkas (nikah) ATAU judul (kelahiran/kematian). */
const norm = (x) => String(x ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const BUNDLED_TITLES = new Set(BUNDLES.flatMap((b) => b.letters.filter((l) => !l.slug).map((l) => norm(l.title))));
const BUNDLED_SLUGS = new Set(BUNDLES.flatMap((b) => b.letters.map((l) => l.slug).filter(Boolean)));
/* Surat dari folder-folder ini selalu masuk paket (nikah/kelahiran/kematian/Letter C), apa pun judulnya. */
const BUNDLED_GROUPS = new Set(["birth", "death", "letter-c", "married-man", "marriage-women"]);
export const isBundledLetter = (service) =>
  BUNDLED_GROUPS.has(service.group) || BUNDLED_SLUGS.has(service.slug) || BUNDLED_TITLES.has(norm(service.title));
export const isBundledTitle = (title) => BUNDLED_TITLES.has(norm(title));