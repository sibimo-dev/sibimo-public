/* Logika form yang dipakai LetterWizard (1 surat) dan BundleWizard (banyak surat).
   Tidak ada tampilan di sini — hanya fungsi murni supaya mudah dites. */

export const MAX_FILE_MB = 5;
export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];

/* String yang bukan tanggal (mis. "SEUMUR HIDUP" pada Masa Berlaku KTP) menghasilkan null, bukan Invalid Date. */
export const toDate = (v) => {
  if (v instanceof Date) return v;
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
export const isFilled = (v) =>
  v instanceof Date ? !Number.isNaN(v.getTime()) : Array.isArray(v) ? v.length > 0 : String(v ?? "").trim() !== "";
export const emptyRow = (columns) => Object.fromEntries(columns.map((c) => [c.key, c.default ?? ""]));
export const visible = (field, form) => !field.showIf || field.showIf(form);

export const fmtDate = (d) =>
  d instanceof Date && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
    : "";

/* Label pilihan untuk nilai bernomor ({ value: "2", label: "2. Perempuan" }): tampilan cek ulang memakai label, bukan kode. */
const optionLabelOf = (options, value) => {
  if (!Array.isArray(options)) return null;
  const hit = options.find((o) => o && typeof o === "object" && String(o.value) === String(value ?? ""));
  return hit ? hit.label : null;
};
export const cellText = (column, value) => {
  if (column.type === "date") return typeof value === "string" ? value : fmtDate(value);
  if (column.type === "select") return optionLabelOf(column.options, value) ?? value;
  return value;
};

export function display(field, v) {
  if (field.type === "select") {
    const label = optionLabelOf(field.options, v);
    if (label && isFilled(v)) return label;
  }
  if (field.type === "date") return (typeof v === "string" && v.trim() ? v : fmtDate(v)) || "-";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "-";
  return isFilled(v) ? String(v) : "-";
}

export const filledRows = (field, form) => form[field.key].filter((r) => Object.values(r).some(isFilled));

/* ---------- Keluarga yang pindah mengikuti "Jenis Kepindahan" (sama dengan admin) ----------
   Field rows dengan `autoByType: "<key jenis kepindahan>"` (surat pindah / datang) TIDAK diisi lewat "Tambah baris",
   tetapi otomatis dari anggota KK pemohon (data warga yang sudah diverifikasi lewat NIK di awal), menurut pilihan Jenis Kepindahan:
     1. Kep. Keluarga                          → hanya kepala keluarga           (otomatis, terkunci)
     2. Kep. Keluarga dan seluruh Angg.        → semua anggota KK                (otomatis, terkunci)
     3. Kep. Keluarga dan sbg Angg. Keluarga   → kepala keluarga otomatis + anggota lain DITAMBAH MANUAL
     4. Anggota Keluarga                       → semua anggota KK kecuali kepala keluarga (otomatis, terkunci)
   Bila pilihan otomatis tidak menghasilkan satu pun anggota (atau data KK belum tersedia), baris dibuka sebagai isian MANUAL.
   Daftar anggota KK dibaca dari `resident.household` (hasil verifikasi NIK) dan disimpan di autoFilled.__household
   (bukan di form, jadi tidak ikut terkirim). Tidak ada pencarian NIK baru di dalam form. */
const isHead = (p) => /kepala\s+keluarga/i.test(String(p?.familyRelationship ?? ""));
export const relocationMode = (value) => ({ 1: "head", 2: "all", 3: "partial", 4: "others" })[parseInt(String(value ?? "").trim(), 10)] ?? null;
export const householdOf = (autoFilled) => (Array.isArray(autoFilled?.__household) ? autoFilled.__household : []);
export const pickFamily = (mode, household = []) => {
  const heads = household.filter(isHead);
  const others = household.filter((p) => !isHead(p));
  if (mode === "head" || mode === "partial") return heads;
  if (mode === "all") return [...heads, ...others];
  if (mode === "others") return others;
  return [];
};
/* Mode efektif untuk tampilan: null bila tidak ada anggota KK yang cocok dengan pilihan Jenis Kepindahan,
   sehingga baris tidak dikunci dan pemohon bisa mengisi manual. */
export const familyModeFor = (value, household = []) => {
  const mode = relocationMode(value);
  if (!mode) return null;
  return pickFamily(mode, household).length ? mode : null;
};

/* ---------- Daftar anggota dari KK (field rows dengan `fromHousehold`) ----------
   `fromHousehold` = { kunciKolom: "properti warga" }. Satu baris dibuat per anggota KK (kepala keluarga lebih dulu),
   semua kolom boleh dikoreksi manual. Kolom select bernomor dicocokkan lewat `source` (nilai di Data Warga) atau label. */
const lc = (v) => String(v ?? "").trim().toLowerCase();
const bareNumber = (v) => String(v ?? "").replace(/^\s*\d+\s*[.)\-:]\s*/, "").trim();
const canon = (v) => String(v ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
export function matchCode(column, raw) {
  if (canon(raw) === "belumada") raw = "Tidak Ada"; // Data Warga menyimpan "Belum Ada" untuk pilihan "1. Tidak Ada"
  const options = Array.isArray(column.options) ? column.options : [];
  const src = (o) => (o && typeof o === "object" ? (o.source ?? o.value) : o);
  const lab = (o) => (o && typeof o === "object" ? o.label : o);
  const hit = options.find((o) => lc(src(o)) === lc(raw) || lc(bareNumber(lab(o))) === lc(bareNumber(raw)))
    ?? options.find((o) => canon(src(o)) === canon(raw) || canon(lab(o)) === canon(raw));
  return hit === undefined ? "" : (hit && typeof hit === "object" ? hit.value : hit);
}
export function rowFromPerson(field, person) {
  const row = emptyRow(field.columns);
  for (const c of field.columns) {
    const prop = field.fromHousehold[c.key];
    const raw = prop ? person?.[prop] : undefined;
    if (!isFilled(raw)) continue;
    row[c.key] = c.type === "date" ? toDate(raw) : c.type === "select" ? matchCode(c, raw) : String(raw).trim();
  }
  // kolom yang tidak berlaku (mis. akta kawin saat belum kawin) dikosongkan, sama seperti saat dipilih manual
  for (const c of field.columns) if (c.disabledWhen && c.disabledWhen(row)) row[c.key] = c.default ?? "";
  return row;
}
const familyRow = (p) => ({ nik: p.nik ?? "", name: p.fullName ?? "", validUntil: "", shdk: p.familyRelationship ?? "" });

/* Susun ulang baris keluarga sesuai Jenis Kepindahan. Dipanggil saat data KK tersedia dan saat Jenis Kepindahan diganti.
   Mengembalikan daftar key field yang berubah. `prevHousehold` = KK sebelumnya (supaya barisnya ikut dibersihkan). */
export function syncFamilyRows(form, sections, autoFilled = {}, prevHousehold = []) {
  const household = householdOf(autoFilled);
  const nikSet = (list) => new Set(list.map((p) => String(p.nik ?? "")));
  const headNiks = nikSet([...pickFamily("head", household), ...pickFamily("head", prevHousehold)]);
  const currNiks = nikSet(household);
  const prevOnly = new Set([...nikSet(prevHousehold)].filter((n) => !currNiks.has(n)));
  const changed = [];
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type !== "rows" || !field.autoByType) continue;
      const old = Array.isArray(form[field.key]) ? form[field.key] : [];
      const minRows = field.min ?? (field.optional ? 0 : 1);
      const pad = (rows) => [...rows, ...Array.from({ length: Math.max(0, minRows - rows.length) }, () => emptyRow(field.columns))];
      const mode = relocationMode(form[field.autoByType]);
      const prevMode = autoFilled[`__mode_${field.key}`]; // baris dari mode otomatis (1/2/4) tidak dianggap input manual
      if (!household.length) {
        // KK tidak tersedia: buang baris otomatis milik KK lama, sisanya (manual) dibiarkan.
        if (prevHousehold.length) {
          form[field.key] = pad(old.filter((r) => !prevHousehold.some((p) => String(p.nik ?? "") === String(r.nik ?? ""))));
          delete autoFilled[field.key];
          delete autoFilled[`__mode_${field.key}`];
          changed.push(field.key);
        }
        continue;
      }
      if (!mode) continue; // Jenis Kepindahan belum dipilih
      const picked = pickFamily(mode, household);
      if (!picked.length) {
        // Tidak ada anggota KK yang cocok dengan pilihan ini: jangan sisakan baris kosong yang terkunci.
        const wasAuto = !!prevMode && prevMode !== "partial" && prevMode !== "manual";
        const autoNiks = new Set([...nikSet(household), ...nikSet(prevHousehold)]);
        const keep = old.filter((r) => Object.values(r).some(isFilled) && !(wasAuto && autoNiks.has(String(r.nik ?? ""))));
        form[field.key] = pad(keep);
        delete autoFilled[field.key];
        autoFilled[`__mode_${field.key}`] = "manual";
        changed.push(field.key);
        continue;
      }
      const validByNik = new Map(old.filter((r) => r.nik && r.validUntil).map((r) => [String(r.nik), r.validUntil]));
      const auto = picked.map((p) => ({ ...familyRow(p), validUntil: validByNik.get(String(p.nik)) ?? "" }));
      const manual = mode === "partial" && (!prevMode || prevMode === "partial" || prevMode === "manual") ? old.filter((r) => Object.values(r).some(isFilled) && !headNiks.has(String(r.nik ?? "")) && !prevOnly.has(String(r.nik ?? ""))) : [];
      form[field.key] = pad([...auto, ...manual].slice(0, field.max ?? 20));
      autoFilled[field.key] = true;
      autoFilled[`__mode_${field.key}`] = mode;
      changed.push(field.key);
    }
  }
  return changed;
}

/* Pasang data KK dari warga terverifikasi ke form: isi baris `fromHousehold` (Biodata Keluarga) dan susun baris `autoByType`
   (surat pindah/datang). Aman dipanggil berulang; isian manual tidak ditimpa. Mengembalikan daftar key yang terisi. */
export function applyHousehold(form, sections, resident, autoFilled = {}) {
  const hasFamilyRows = sections.some((s) => s.fields.some((x) => x.type === "rows" && (x.autoByType || x.fromHousehold)));
  if (!hasFamilyRows) return [];
  const prevHousehold = householdOf(autoFilled);
  autoFilled.__household = Array.isArray(resident?.household) ? resident.household : [];
  const filled = [];
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.type !== "rows" || field.autoByType || !field.fromHousehold) continue;
      const household = householdOf(autoFilled);
      const current = form[field.key];
      const manual = Array.isArray(current) && current.some((row) => Object.values(row).some(isFilled)) && !autoFilled[field.key];
      if (household.length && !manual) {
        const heads = pickFamily("head", household);
        const ordered = [...heads, ...household.filter((p) => !heads.includes(p))].slice(0, field.max ?? 20);
        form[field.key] = ordered.map((p) => rowFromPerson(field, p));
        autoFilled[field.key] = true;
        filled.push(field.key);
      } else if (!household.length && autoFilled[field.key]) {
        form[field.key] = Array.from({ length: field.min ?? (field.optional ? 0 : 1) }, () => emptyRow(field.columns));
        delete autoFilled[field.key];
      }
    }
  }
  for (const key of syncFamilyRows(form, sections, autoFilled, prevHousehold)) if (!filled.includes(key)) filled.push(key);
  return filled;
}

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
  // Opsi bernomor { value, label, source }: cocokkan juga dengan label & nilai asli di Data Warga (source).
  const hit = field.options.find((option) => bareOption(optionValue(option)) === bareOption(raw)
    || (option && typeof option === "object" && (bareOption(option.label) === bareOption(raw) || bareOption(option.source) === bareOption(raw))));
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
  const MALE = ["laki-laki", "laki laki", "l", "male", "pria", "1. laki-laki"];
  const FEMALE = ["perempuan", "p", "female", "wanita", "2. perempuan"];
  const coupleRole = () => {
    const g = String(store.resident?.gender ?? "").trim().toLowerCase();
    return MALE.includes(g) ? "asGroom" : FEMALE.includes(g) ? "asBride" : null;
  };
  // Properti orang lain (ayah/ibu/pasangan) dari objek resident; bila objek tidak ada, pakai kolom datar (fatherName, dst.).
  const personProp = (person, property, flat = {}) => {
    const direct = person?.[property];
    if (isFilled(direct)) return direct;
    if (property === "birthPlaceDate" && person) return formatResidentBirth({ resident: person }) || undefined;
    return flat[property];
  };
  const lookup = (k) => {
    if (k === "parentRole") return role() === "Father" ? "Ayah" : role() === "Mother" ? "Ibu" : undefined;
    // Blok calon pengantin & orang tuanya (sama dengan admin): hanya terisi bila jenis kelamin warga cocok.
    const rel = /^(asGroom|asBride|parentFather|parentMother|spouse):(.+)$/.exec(k);
    if (rel) {
      const [, relation, property] = rel;
      const current = store.resident;
      if (!current) return undefined;
      if (relation === "spouse") return personProp(current.spouse, property);
      if (relation === "parentFather") return personProp(current.father, property, { fullName: current.fatherName, nik: current.fatherNationalId });
      if (relation === "parentMother") return personProp(current.mother, property, { fullName: current.motherName, nik: current.motherNationalId });
      return relation === coupleRole() ? lookup(property) : undefined;
    }
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
  return lookup;
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

// `noAutofill`: isian milik orang lain (mis. data anak pada KIA) tidak boleh terisi dari data pemohon lewat kunci generik.
const residentSourceFor = (field) => field.from ?? (field.noAutofill ? undefined : RESIDENT_FIELD_SOURCES[field.key]);

/*
 * Beberapa surat paket tidak memiliki field generik `nik`/`name`; misalnya
 * surat nikah memakai `groomNik` dan `groomName`. Simpan identitas hasil
 * verifikasi pada field generik terlebih dahulu supaya alias paket dapat
 * mengisinya ke field yang sesuai tanpa menimpa isian manual.
 */
export function seedVerifiedApplicant(form, store, sections = []) {
  // Kunci milik orang lain (field `noAutofill` tanpa `from`) tidak ikut diisi dengan data pemohon.
  const blocked = new Set(sections.flatMap((section) => section.fields).filter((x) => x.noAutofill && !x.from).map((x) => x.key));
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
    if (blocked.has(key)) continue;
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

/* Setelah "Lanjut" gagal validasi: scroll ke isian wajib pertama (urutan tampil di layar) yang belum terisi lalu fokuskan.
   keys = key isian yang error. Elemen dicari lewat atribut data-field-key di LetterFormFields. */
export function focusFirstInvalid(keys = []) {
  if (typeof document === "undefined") return;
  const wanted = new Set(keys.filter((k) => k && !k.startsWith("_")));
  const go = (tries = 0) => {
    const el = [...document.querySelectorAll("[data-field-key]")].find((n) => wanted.has(n.dataset.fieldKey));
    if (!el) return tries < 5 ? requestAnimationFrame(() => go(tries + 1)) : undefined;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.querySelector("input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])")?.focus({ preventScroll: true });
  };
  requestAnimationFrame(() => go());
}


/* Pasangan kunci yang SELALU dianggap sama di semua paket surat (digabung dengan `bundle.aliases`).
   Dipakai BundleWizard: isian yang masih kosong terisi otomatis dari surat lain yang sudah diisi, walau nama kuncinya beda.
   Kunci yang namanya persis sama sudah otomatis dibagi antar surat (satu form untuk semua surat dalam paket).
   Sengaja TIDAK memasukkan alamat (address ↔ originAddress): di surat pindah datang/SKTS alamat asal berbeda dengan alamat pemohon. */
export const COMMON_ALIASES = [
  // Nomor KK (KTP/Pindah WNI = kkNumber, F-1.02/Akta/SKTS = familyCardNumber, Pindah Datang = originKkNumber)
  ["kkNumber", "familyCardNumber"],
  ["kkNumber", "originKkNumber"],
  // Nama Kepala Keluarga
  ["headOfFamily", "headOfFamilyName"],
  ["headOfFamily", "originHeadOfFamily"],
  // Nomor telepon / WhatsApp pemohon
  ["whatsapp", "phone"],
  ["phone", "applicantPhone"],
];