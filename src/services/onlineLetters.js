import publicService from "./publicService";
import { getOnlineLetterConfig } from "@/data/letterBackendMap";
import { compressImage } from "./imageCompressor";

let typesPromise;

const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function documentTypeOf(value) {
  const name = String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ");
  let base = "lainnya";
  if (name.includes("kehilangan") || name.includes("kepolisian") || name.includes("laporan polisi")) base = "lainnya";
  else if (name.includes("kartu keluarga") || /\bkk\b/.test(name)) base = "kk";
  else if (name.includes("paspor") || name.includes("passport")) base = "paspor";
  else if (name.includes("akta kelahiran") || name.includes("akta lahir") || name.includes("surat keterangan lahir")) base = "akta_kelahiran";
  else if (name.includes("akta perkawinan") || name.includes("buku nikah") || name.includes("akta nikah")) base = "akta_perkawinan";
  else if (name.includes("akta perceraian") || name.includes("surat cerai") || name.includes("cerai")) base = "akta_perceraian";
  else if (name.includes("surat kematian") || name.includes("akta kematian") || name.includes("meninggal") || name.includes("almarhum")) base = "surat_kematian";
  else if (name.includes("pas foto") || name.includes("pass photo") || /\bpas\s*foto\b/.test(name) || (name.includes("foto") && !name.includes("fotokopi") && !name.includes("fotocopy"))) base = "pas_foto";
  else if (name.includes("pbb")) base = "pbb";
  else if (name.includes("shm") || name.includes("letter c")) base = "letter_c";
  else if (name.includes("rt rw") || name.includes("rt atau rw")) base = "surat_rt_rw";
  else if (name.includes("ktp") || name.includes("kartu tanda penduduk")) base = "ktp";
  if (!["ktp", "kk", "akta_kelahiran", "akta_perkawinan", "akta_perceraian", "surat_kematian", "paspor"].includes(base)) {
    return base === "lainnya" ? `lainnya:${(name.trim() || "dokumen").slice(0, 71)}` : base;
  }
  const scope = name.includes("pasangan") || name.includes("suami") || name.includes("istri") || name.includes("calon")
    ? "spouse"
    : name.includes("ayah") || name.includes("ibu") || name.includes("orang tua") || name.includes("wali")
      ? "parent"
      : name.includes("ahli waris")
        ? "heir"
        : name.includes("saksi")
          ? "witness"
          : name.includes("penerima kuasa") || name.includes("pemberi kuasa")
            ? "attorney"
            : name.includes("kematian") || name.includes("meninggal") || name.includes("almarhum") || name.includes("jenazah")
              ? "deceased"
              : "applicant";
  return `${base}:${scope}`;
}

export async function getOnlineLetterTypes() {
  typesPromise ??= publicService.getLetterTypes().then((response) => response.data?.data ?? []);
  return typesPromise;
}

export async function getOnlineLetterTypeBySlug(slug) {
  const config = getOnlineLetterConfig(slug);
  if (!config) return null;
  const types = await getOnlineLetterTypes();
  return types.find((type) => type.code === config.code) ?? null;
}

export async function getReusableDocuments({ nik, letterTypeCode }) {
  const response = await publicService.getReusableCitizenDocuments({ nik, letterTypeCode });
  return response.data?.data ?? [];
}

const PLACEHOLDER_NAMES = new Set(["wargauji"]);

const hasValue = (value) => value !== undefined && value !== null && String(value).trim() !== "";

const isPlaceholderName = (value) => PLACEHOLDER_NAMES.has(normalize(value));

function applicantValue(form, resident, ...keys) {
  let placeholder = "";
  for (const key of keys) {
    const value = form?.[key];
    if (!hasValue(value)) continue;
    // Mode uji backend memakai nama "Warga Uji". Jangan biarkan nilai sintetis
    // menimpa nama yang benar bila form surat memakai key khusus (groomName,
    // brideName, reporterName, dan sebagainya).
    if (isPlaceholderName(value)) {
      placeholder ||= value;
      continue;
    }
    return value;
  }
  if (hasValue(placeholder)) return placeholder;

  for (const key of keys) {
    const value = resident?.[key];
    if (hasValue(value)) return value;
  }
  return "";
}

const isGenderKey = (key) => /(?:gender|jenis[_-]?kelamin)/i.test(String(key ?? ""));
const normalizeGenderValue = (value) => {
  const normalized = String(value ?? "")
    .replace(/^\s*\d+\s*[.)\-:]\s*/, "")
    .trim()
    .toLowerCase();
  if (normalized === "laki-laki") return "Laki-laki";
  if (normalized === "perempuan") return "Perempuan";
  return value;
};

function cleanFormValue(value, key = "") {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (isGenderKey(key)) return normalizeGenderValue(value);
  if (Array.isArray(value)) return value.map((item) => cleanFormValue(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, item]) => [childKey, cleanFormValue(item, childKey)]));
  }
  return value;
}

export function resolveDocumentId(label, documents, usedIds = new Set()) {
  const targetType = documentTypeOf(label);
  const normalizedLabel = normalize(label);

  // 1. Cocokkan nama dokumen secara persis
  const exact = documents.find((doc) => !usedIds.has(doc.letter_type_document_id) && normalize(doc.document_name) === normalizedLabel);
  if (exact) return exact.letter_type_document_id;

  // 2. Cocokkan tipe dokumen yang sama (mis. pas_foto -> Pass Photo, kk:applicant -> Fotocopy KK, ktp:applicant -> Fotocopy KTP)
  const byType = documents.find((doc) => !usedIds.has(doc.letter_type_document_id) && documentTypeOf(doc.document_name) === targetType);
  if (byType) return byType.letter_type_document_id;

  // 3. Cocokkan alias kata kunci (hindari 'foto' mencocokkan 'fotocopy' / 'fotokopi')
  const aliases = [
    { needles: ["kk", "kartukeluarga"], candidates: ["kartukeluarga", "kk"] },
    { needles: ["ktp", "kartutanda"], candidates: ["kartutandapenduduk", "ktp"] },
    { needles: ["pasfoto", "passfoto", "passphoto", "foto3x4", "foto4x6"], candidates: ["passphoto", "pasfoto", "photo"] },
  ];
  const alias = aliases.find(({ needles }) => needles.some((needle) => normalizedLabel.includes(needle)));
  if (alias) {
    const match = documents.find((document) => !usedIds.has(document.letter_type_document_id) && alias.candidates.some((candidate) => normalize(document.document_name).includes(candidate)));
    if (match) return match.letter_type_document_id;
  }

  // 4. Fallback ke dokumen pendukung lainnya
  const fallback = documents.find((document) => !usedIds.has(document.letter_type_document_id) && !document.is_required && /lain|pendukung|tambahan/i.test(document.document_name));
  if (fallback) return fallback.letter_type_document_id;

  const unused = documents.find((doc) => !usedIds.has(doc.letter_type_document_id));
  return unused?.letter_type_document_id ?? documents[0]?.letter_type_document_id ?? null;
}

export async function submitOnlineLetter({ slug, form, files, documents, reusedDocuments = {}, resident, serviceFlow, isNewResident }) {
  const config = getOnlineLetterConfig(slug);
  if (!config) throw new Error("Surat ini belum tersedia untuk pengajuan online.");

  const type = await getOnlineLetterTypeBySlug(slug);
  if (!type) throw new Error("Tipe surat online belum tersedia di server.");

  const applicantName = applicantValue(
    form,
    resident,
    "name",
    "applicantName",
    "fullName",
    "groomName",
    "brideName",
    "reporterName",
    "ownerName",
    "letterCOwnerName",
    "headOfFamilyName",
    "husbandName",
    "wifeName",
  );
  const applicantNik = applicantValue(
    form,
    resident,
    "nik",
    "nationalId",
    "applicantNik",
    "groomNik",
    "brideNik",
    "reporterNik",
    "ownerNik",
    "letterCOwnerNik",
  ) || resident?.nik || "";
  const applicantAddress = applicantValue(
    form,
    resident,
    "address",
    "applicantAddress",
    "ktpAddress",
    "groomAddress",
    "brideAddress",
    "reporterAddress",
    "ownerAddress",
    "letterCOwnerAddress",
  )
    // Surat tanpa isian alamat pemohon (mis. surat pindah): pakai alamat asal / alamat KTP warga agar backend tidak menolak.
    || applicantValue(form, resident, "originAddress", "ktpAddress", "destinationAddress");
  const applicantPhone = applicantValue(form, resident, "whatsapp", "phone", "applicantPhone", "phoneNumber");
  const formData = cleanFormValue({
    ...form,
    applicant_name: applicantName,
    applicant_nik: applicantNik,
    applicant_address: applicantAddress,
    phone: applicantPhone,
  });

  const payload = new FormData();
  payload.append("letter_type_code", config.code);
  payload.append("applicant_name", String(applicantName));
  payload.append("applicant_nik", String(applicantNik));
  payload.append("applicant_phone", String(applicantPhone));
  payload.append("applicant_address", String(applicantAddress));
  payload.append("form_data", JSON.stringify(formData));
  if (serviceFlow) payload.append("service_flow", String(serviceFlow));
  if (isNewResident) payload.append("is_new_resident", "1");

  const usedDocumentIds = new Set();

  for (const document of documents ?? []) {
    let file = files?.[document.id];
    const documentId = resolveDocumentId(document.label, type.documents ?? [], usedDocumentIds);
    if (!documentId) throw new Error(`Dokumen ${document.label} belum memiliki konfigurasi backend.`);
    if (file) {
      file = await compressImage(file);
      payload.append("attachments[]", file, file.name);
      payload.append("attachment_document_ids[]", String(documentId));
      payload.append("attachment_document_labels[]", document.label);
      usedDocumentIds.add(documentId);
    } else if (reusedDocuments[document.id]) {
      payload.append(`reused_document_ids[${documentId}]`, String(reusedDocuments[document.id].citizen_document_id ?? reusedDocuments[document.id]));
      payload.append(`reused_document_labels[${documentId}]`, document.label);
      usedDocumentIds.add(documentId);
    }
  }

  const response = await publicService.submitLetterRequest(payload);
  return response.data?.data ?? {};
}

export function clearOnlineLetterTypeCache() {
  typesPromise = undefined;
}
