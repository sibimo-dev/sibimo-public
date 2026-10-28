/* Logika form yang dipakai LetterWizard (1 surat) dan BundleWizard (banyak surat).
   Tidak ada tampilan di sini — hanya fungsi murni supaya mudah dites. */

export const MAX_FILE_MB = 5;
export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];

export const toDate = (v) => (v instanceof Date ? v : v ? new Date(v) : null);
export const isFilled = (v) =>
  v instanceof Date ? !Number.isNaN(v.getTime()) : Array.isArray(v) ? v.length > 0 : String(v ?? "").trim() !== "";
export const emptyRow = (columns) => Object.fromEntries(columns.map((c) => [c.key, c.default ?? ""]));
export const visible = (field, form) => !field.showIf || field.showIf(form);

export const fmtDate = (d) =>
  d instanceof Date && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "";

export function display(field, v) {
  if (field.type === "date") return fmtDate(v) || "-";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "-";
  return isFilled(v) ? String(v) : "-";
}

export const filledRows = (field, form) => form[field.key].filter((r) => Object.values(r).some(isFilled));

const optionValue = (option) => option && typeof option === "object"
  ? option.value ?? option.label
  : option;
const bareOption = (value) => String(value ?? "")
  .replace(/^\s*\d+\s*[.)\-:]\s*/, "")
  .trim()
  .toLowerCase();
const numberedGender = (value) => {
  const bare = bareOption(value);
  if (bare === "laki-laki") return "1. Laki-laki";
  if (bare === "perempuan") return "2. Perempuan";
  return value;
};
const isGenderField = (field) => {
  const key = String(field.key ?? "").toLowerCase();
  const label = String(field.label ?? "").toLowerCase();
  return field.from === "gender" || key.includes("gender") || key.includes("jeniskelamin") || label.includes("jenis kelamin");
};
const catinStatusValue = (field, raw) => {
  const key = String(field.key ?? "").toLowerCase();
  if (key !== "groomstatus" && key !== "bridestatus") return undefined;
  const value = bareOption(raw);
  const isDivorced = /duda|janda|cerai|balu|widow/.test(value);
  if (key === "groomstatus") {
    if (isDivorced) return "Duda";
    if (/kawin|menikah|beristri|married/.test(value)) return "Beristri";
    if (/belum|lajang|jejaka|perawan|single|unmarried/.test(value)) return "Jejaka";
  } else {
    if (isDivorced) return "Janda";
    if (/belum|lajang|jejaka|perawan|single|unmarried/.test(value)) return "Perawan";
  }
  return undefined;
};
const selectValue = (field, raw) => {
  const catinStatus = catinStatusValue(field, raw);
  if (catinStatus !== undefined) return catinStatus;
  if (field.type !== "select" || !Array.isArray(field.options)) return isGenderField(field) ? numberedGender(raw) : raw;
  const hit = field.options.find((option) => bareOption(optionValue(option)) === bareOption(raw));
  return hit === undefined ? (isGenderField(field) ? numberedGender(raw) : raw) : optionValue(hit);
};

/* Normalisasi daftar dokumen: "Nama" atau { label, optional } → { id, label, optional }.
   Mendukung fungsi dinamis (form) => [] dan prefix unik untuk paket surat. */
export function normalizeDocs(documents = [], prefix = "", form = null) {
  const list = typeof documents === "function" ? documents(form) : documents;
  if (!Array.isArray(list)) return [];
  const seen = new Map();
  return list.map((d, i) => {
    const base = typeof d === "string" ? { label: d, optional: false } : { optional: false, ...d };
    const labelKey = base.label || String(i);
    const count = seen.get(labelKey) || 0;
    seen.set(labelKey, count + 1);
    const uniqueKey = count === 0 ? labelKey : `${labelKey}_${count}`;
    const id = base.id ?? (prefix ? `${prefix}::${uniqueKey}` : uniqueKey);
    return { ...base, id };
  });
}

export function formatResidentBirth(store) {
  const place = store?.resident?.birthPlace;
  const rawDate = store?.resident?.birthDate;
  const d = toDate(rawDate);
  const dateFormatted = d ? fmtDate(d) : rawDate;
  if (place && dateFormatted) return `${place}, ${dateFormatted}`;
  return place || dateFormatted || "";
}

/* Lookup data warga untuk fillForm.
   - "nik"               → NIK yang diverifikasi
   - "asFather:<kunci>"  → nilai warga HANYA bila jenis kelamin = Laki-laki (isi blok Ayah)
   - "asMother:<kunci>"  → nilai warga HANYA bila jenis kelamin = Perempuan (isi blok Ibu)
   - "parentRole"        → "Ayah" / "Ibu" menurut jenis kelamin
   Kunci lain dibaca langsung dari data warga. */
export function makeResidentLookup(store) {
  const gender = () => store.resident?.gender;
  const role = () => (gender() === "Laki-laki" ? "Father" : gender() === "Perempuan" ? "Mother" : null);
  const eligibleSpouseContext = () => {
    const resident = store.resident;
    const status = String(resident?.maritalStatus ?? "").trim().toLowerCase();
    const relation = String(resident?.familyRelationship ?? "").trim().toLowerCase();
    if (!resident?.spouse || !status || /belum|cerai|janda|duda|jejaka|perawan/i.test(status) || !/kawin|menikah/i.test(status)) return false;
    if (!relation || /anak|menantu|cucu|orang ?tua|saudara|famili/i.test(relation)) return false;
    return /suami|istri|kepala|\bkk\b/i.test(relation);
  };
  return (k) => {
    if (k === "parentRole") return role() === "Father" ? "Ayah" : role() === "Mother" ? "Ibu" : undefined;
    const m = /^as(Father|Mother):(.+)$/.exec(k);
    if (m) {
      if (role() !== m[1]) return undefined;
      k = m[2];
    }
    const couple = /^(asHusband|asWife):(.+)$/.exec(k);
    if (couple) {
      if (!eligibleSpouseContext()) return undefined;
      const requestedRole = couple[1] === "asHusband" ? "Laki-laki" : "Perempuan";
      const current = gender() === requestedRole ? store.resident : store.resident?.spouse;
      return current?.[couple[2]];
    }
    if (["nik", "nationalId", "applicantNik"].includes(k)) return store.nik;
    if (["birthPlaceDate", "birth", "birth_place_date"].includes(k)) return formatResidentBirth(store);
    const spouseFields = {
      spouseName: "fullName",
      spouseNik: "nik",
      spouseBirthPlace: "birthPlace",
      spouseBirthDate: "birthDate",
      spouseBirth: "birthPlaceDate",
      spouseReligion: "religion",
      spouseOccupation: "occupation",
      spouseAddress: "address",
      spouseGender: "gender",
      spouseFamilyRelationship: "familyRelationship",
      spouseMarriageCertificateNumber: "marriageCertificateNumber",
    };
    if (spouseFields[k]) {
      const spouse = store.resident?.spouse;
      if (!spouse) return undefined;
      // Reformat data lama dari sessionStorage juga, supaya nilai lama seperti
      // 28/10/1972 tidak tetap tampil setelah format Indonesia diberlakukan.
      if (spouseFields[k] === "birthPlaceDate") return formatResidentBirth({ resident: spouse }) || spouse.birthPlaceDate;
      return spouse[spouseFields[k]];
    }
    if (k === "rtRw") return [store.resident?.rt, store.resident?.rw].filter(Boolean).join(" / ");
    return store.resident?.[k];
  };
}

// Field generik yang sering dipakai surat tetapi belum selalu menuliskan
// `from` satu per satu. Selama field-nya masih kosong, field-field ini aman
// diambil dari hasil verifikasi NIK warga.
const RESIDENT_FIELD_SOURCES = Object.freeze({
  name: "fullName",
  applicantName: "fullName",
  applicantFullName: "fullName",
  fullName: "fullName",
  titleCode: "titleCode",
  nik: "nik",
  applicantNik: "nik",
  applicantNationalId: "nik",
  birthPlace: "birthPlace",
  birthDate: "birthDate",
  applicantBirth: "birthPlaceDate",
  applicantBirthPlace: "birthPlace",
  applicantBirthDate: "birthDate",
  birthPlaceDate: "birthPlaceDate",
  birth: "birthPlaceDate",
  gender: "gender",
  applicantGender: "gender",
  maritalStatus: "maritalStatus",
  applicantMaritalStatus: "maritalStatus",
  religion: "religion",
  applicantReligion: "religion",
  occupation: "occupation",
  applicantOccupation: "occupation",
  education: "education",
  applicantEducation: "education",
  nationality: "nationality",
  applicantNationality: "nationality",
  address: "address",
  applicantAddress: "address",
  ktpAddress: "ktpAddress",
  applicantKtpAddress: "ktpAddress",
  phoneNumber: "phoneNumber",
  applicantPhoneNumber: "phoneNumber",
  phone: "phoneNumber",
  whatsapp: "phoneNumber",
  familyCardNumber: "familyCardNumber",
  kkNumber: "familyCardNumber",
  kkmNumber: "familyCardNumber",
  headOfFamilyName: "headOfFamilyName",
  headOfFamily: "headOfFamilyName",
  householdHead: "headOfFamilyName",
  familyRelationship: "familyRelationship",
  dusun: "dusun",
  rt: "rt",
  rw: "rw",
  rtHeadName: "rtHeadName",
  rwHeadName: "rwHeadName",
  rtRw: "rtRw",
  village: "village",
  district: "district",
  regency: "regency",
  province: "province",
  postalCode: "postalCode",
  age: "age",
  reporterAge: "age",
  applicantAge: "age",
  applicantGender: "gender",
  bloodType: "bloodType",
  birthCertificateStatus: "birthCertificateStatus",
  birthCertificateNumber: "birthCertificateNumber",
  birthCertNumber: "birthCertificateNumber",
  marriageCertificateStatus: "marriageCertificateStatus",
  marriageCertificateNumber: "marriageCertificateNumber",
  marriageCertNumber: "marriageCertificateNumber",
  marriageDate: "marriageDate",
  divorceCertificateStatus: "divorceCertificateStatus",
  divorceCertificateNumber: "divorceCertificateNumber",
  divorceDate: "divorceDate",
  physicalDisability: "physicalDisability",
  disabilityStatus: "disabilityStatus",
  beliefOrganization: "beliefOrganization",
  previousAddress: "previousAddress",
  passportNumber: "passportNumber",
  passportExpiryDate: "passportExpiryDate",
  fatherNik: "fatherNationalId",
  fatherName: "fatherName",
  motherNik: "motherNationalId",
  motherName: "motherName",
});

const residentSourceFor = (field) => field.from ?? RESIDENT_FIELD_SOURCES[field.key];

/*
 * Beberapa surat paket tidak memiliki field generik `nik`/`name`; misalnya
 * surat nikah memakai `groomNik` dan `groomName`. Simpan identitas hasil
 * verifikasi pada field generik terlebih dahulu supaya alias paket dapat
 * mengisinya ke field yang sesuai tanpa menimpa isian manual.
 */
export function seedVerifiedApplicant(form, store) {
  const birthPlaceDate = formatResidentBirth(store);
  const values = {
    name: store.resident?.fullName,
    applicantName: store.resident?.fullName,
    fullName: store.resident?.fullName,
    titleCode: store.resident?.titleCode,
    nik: store.nik,
    applicantNik: store.nik,
    familyCardNumber: store.resident?.familyCardNumber,
    headOfFamilyName: store.resident?.headOfFamilyName,
    birthPlace: store.resident?.birthPlace,
    birthDate: store.resident?.birthDate,
    birthPlaceDate: birthPlaceDate,
    birth: birthPlaceDate,
    gender: store.resident?.gender,
    maritalStatus: store.resident?.maritalStatus,
    religion: store.resident?.religion,
    occupation: store.resident?.occupation,
    education: store.resident?.education,
    nationality: store.resident?.nationality,
    address: store.resident?.address,
    ktpAddress: store.resident?.ktpAddress,
    phoneNumber: store.resident?.phoneNumber,
    applicantAddress: store.resident?.address,
    familyRelationship: store.resident?.familyRelationship,
    dusun: store.resident?.dusun,
    rt: store.resident?.rt,
    rw: store.resident?.rw,
    rtHeadName: store.resident?.rtHeadName,
    rwHeadName: store.resident?.rwHeadName,
    rtRw: [store.resident?.rt, store.resident?.rw].filter(Boolean).join(" / "),
    village: store.resident?.village,
    district: store.resident?.district,
    regency: store.resident?.regency,
    province: store.resident?.province,
    postalCode: store.resident?.postalCode,
    age: store.resident?.age,
    bloodType: store.resident?.bloodType,
    birthCertificateStatus: store.resident?.birthCertificateStatus,
    birthCertificateNumber: store.resident?.birthCertificateNumber,
    marriageCertificateStatus: store.resident?.marriageCertificateStatus,
    marriageCertificateNumber: store.resident?.marriageCertificateNumber,
    marriageDate: store.resident?.marriageDate,
    divorceCertificateStatus: store.resident?.divorceCertificateStatus,
    divorceCertificateNumber: store.resident?.divorceCertificateNumber,
    divorceDate: store.resident?.divorceDate,
    physicalDisability: store.resident?.physicalDisability,
    disabilityStatus: store.resident?.disabilityStatus,
    beliefOrganization: store.resident?.beliefOrganization,
    previousAddress: store.resident?.previousAddress,
    passportNumber: store.resident?.passportNumber,
    passportExpiryDate: store.resident?.passportExpiryDate,
    fatherNik: store.resident?.fatherNationalId,
    fatherName: store.resident?.fatherName,
    motherNik: store.resident?.motherNationalId,
    motherName: store.resident?.motherName,
  };

  for (const [key, value] of Object.entries(values)) {
    if (!isFilled(form[key]) && isFilled(value)) form[key] = value;
  }
  return form;
}

/* Isi form dari data warga (field.from) / default. Aman dipanggil berkali-kali dan untuk
   banyak surat sekaligus: kunci yang sama dipakai bersama, nilai yang sudah diisi tidak ditimpa. */
export function fillForm(form, sections, lookup = () => undefined) {
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type === "rows") {
        if (!(field.key in form)) form[field.key] = Array.from({ length: field.min ?? (field.optional ? 0 : 1) }, () => emptyRow(field.columns));
        continue;
      }
      if (field.type === "checks") {
        if (!(field.key in form)) form[field.key] = [];
        continue;
      }
      let value = field.default ?? "";
      const source = residentSourceFor(field);
      if (source) {
        const fromStore = lookup(source);
        if (fromStore) value = field.type === "date" ? toDate(fromStore) : selectValue(field, fromStore);
      }
      if (!(field.key in form) || (!isFilled(form[field.key]) && isFilled(value))) form[field.key] = value;
    }
  }
  return form;
}

/* ---------- Validasi ---------- */
export function validateFields(sections, form) {
  const e = {};
  for (const section of sections) {
    for (const field of section.fields) {
      if (!visible(field, form)) continue;
      const v = form[field.key];
      if (field.type === "rows") {
        const rows = v.filter((r) => Object.values(r).some(isFilled));
        if (!field.optional && rows.length < (field.min ?? 1)) e[field.key] = `${field.label} minimal ${field.min ?? 1} baris.`;
        else if (rows.some((r) => field.columns.some((c) => !c.optional && !isFilled(r[c.key])))) e[field.key] = "Lengkapi semua kolom pada setiap baris yang diisi.";
        continue;
      }
      if (!isFilled(v)) {
        if (!field.optional && !section.requireOne) e[field.key] = `${field.label} wajib diisi.`;
        continue;
      }
      if (field.digits && !new RegExp(`^\\d{${field.digits}}$`).test(String(v).trim())) e[field.key] = `${field.label} harus ${field.digits} digit angka.`;
      if (field.key === "whatsapp" && !/^(\+62|62|0)8\d{7,12}$/.test(String(v).replace(/[\s-]/g, ""))) e[field.key] = "Nomor WhatsApp tidak valid.";
    }
    // section.requireOne: minimal satu isian di section ini harus terisi (mis. jenis permohonan pada F-1.02)
    if (section.requireOne && !section.fields.some((x) => isFilled(form[x.key]))) e[section.fields[0].key] = "Pilih minimal satu jenis permohonan.";
  }
  return e;
}

export function validateDocs(docs, files, reused = {}) {
  const e = {};
  for (const d of docs) if (!files[d.id] && !reused[d.id] && !d.optional) e[d.id] = `${d.label} wajib diunggah.`;
  return e;
}

/* Cek 1 file: kembalikan pesan error atau null. */
export function checkFile(file) {
  if (!file) return "File tidak terbaca.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `Ukuran file maksimal ${MAX_FILE_MB} MB (file ini ${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  const okType = ACCEPTED_TYPES.includes(file.type) || /\.(pdf|jpe?g|png|webp|heic)$/i.test(file.name || "");
  if (!okType) return "Format file harus JPG, PNG, atau PDF.";
  return null;
}

export const fileSizeLabel = (file) => {
  const kb = file.size / 1024;
  return kb < 1024 ? `${Math.max(1, Math.round(kb))} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

/* ---------- Isian otomatis antar surat ----------
   Banyak surat memakai kunci field berbeda untuk orang yang sama (mis. `name` = pemohon,
   `groomName` = calon suami). `aliases` = daftar pasangan kunci yang artinya sama; pasangan
   yang bersinggungan digabung jadi satu kelompok. */
export function buildAliasIndex(pairs = []) {
  const parent = new Map();
  const find = (k) => {
    if (!parent.has(k)) parent.set(k, k);
    while (parent.get(k) !== k) {
      parent.set(k, parent.get(parent.get(k)));
      k = parent.get(k);
    }
    return k;
  };
  for (const [a, b] of pairs) parent.set(find(a), find(b));
  const groups = new Map();
  for (const k of parent.keys()) {
    const r = find(k);
    if (!groups.has(r)) groups.set(r, []);
    groups.get(r).push(k);
  }
  const index = {};
  for (const members of groups.values()) for (const k of members) index[k] = members;
  return index;
}

/* Isi field yang MASIH KOSONG dari kunci setara yang sudah terisi. Nilai yang sudah ada
   (termasuk hasil revisi pengguna) tidak pernah ditimpa. Mengembalikan daftar kunci yang terisi. */
export function applyAliases(form, sections, index) {
  const filled = [];
  const aliasValue = (field, peer, value) => {
    if (field.key === "maritalStatus" && /status$/i.test(String(peer))) {
      const status = bareOption(value);
      if (/jejaka|perawan|belum|lajang|single|unmarried/.test(status)) return "Belum Kawin";
      if (/duda|janda|cerai|widow|balu/.test(status)) return "Cerai Hidup";
      if (/beristri|kawin|menikah|married/.test(status)) return "Kawin";
    }
    return value;
  };
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type === "rows" || field.type === "checks") continue;
      if (!visible(field, form) || isFilled(form[field.key])) continue;
      const peer = (index[field.key] ?? []).find((k) => k !== field.key && isFilled(form[k]));
      if (!peer) continue;
      const v = aliasValue(field, peer, form[peer]);
      form[field.key] = v instanceof Date ? new Date(v.getTime()) : v;
      filled.push(field.key);
    }
  }
  return filled;
}
