import publicService from "./publicService";
import { getOnlineLetterConfig } from "@/data/letterBackendMap";

let typesPromise;

const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function documentTypeOf(value) {
  const name = String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ");
  let base = "lainnya";
  if (name.includes("kartu keluarga") || /\bkk\b/.test(name)) base = "kk";
  else if (name.includes("paspor") || name.includes("passport")) base = "paspor";
  else if (name.includes("akta kelahiran") || name.includes("akta lahir") || name.includes("surat keterangan lahir")) base = "akta_kelahiran";
  else if (name.includes("akta perkawinan") || name.includes("buku nikah") || name.includes("akta nikah")) base = "akta_perkawinan";
  else if (name.includes("akta perceraian") || name.includes("surat cerai") || name.includes("cerai")) base = "akta_perceraian";
  else if (name.includes("surat kematian") || name.includes("akta kematian") || name.includes("meninggal") || name.includes("almarhum")) base = "surat_kematian";
  else if (name.includes("pas foto") || name.includes("pass photo") || /\bfoto\b/.test(name)) base = "pas_foto";
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

function cleanFormValue(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(cleanFormValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, cleanFormValue(item)]));
  return value;
}

function resolveDocumentId(label, documents) {
  const normalizedLabel = normalize(label);
  const exact = documents.find((document) => normalize(document.document_name) === normalizedLabel);
  if (exact) return exact.letter_type_document_id;

  const aliases = [
    { needles: ["kk"], candidates: ["kk"] },
    { needles: ["kartutanda", "ktp"], candidates: ["ktp", "kartutanda"] },
    // Backend menggunakan "Pass Photo (3x4)", sedangkan label form publik
    // menggunakan "Pas foto 3x4". Keduanya harus menunjuk dokumen yang sama.
    { needles: ["pasfoto", "passfoto", "passphoto", "foto"], candidates: ["pasfoto", "passfoto", "passphoto", "foto", "photo"] },
  ];
  const alias = aliases.find(({ needles }) => needles.some((needle) => normalizedLabel.includes(needle)));
  if (alias) {
    const match = documents.find((document) => alias.candidates.some((candidate) => normalize(document.document_name).includes(candidate)));
    if (match) return match.letter_type_document_id;
  }

  const fallback = documents.find((document) => !document.is_required && /lain|pendukung|tambahan/i.test(document.document_name));
  return fallback?.letter_type_document_id ?? documents[0]?.letter_type_document_id ?? null;
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
  );
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

  for (const document of documents ?? []) {
    const file = files?.[document.id];
    const documentId = resolveDocumentId(document.label, type.documents ?? []);
    if (!documentId) throw new Error(`Dokumen ${document.label} belum memiliki konfigurasi backend.`);
    if (file) {
      payload.append("attachments[]", file, file.name);
      payload.append("attachment_document_ids[]", String(documentId));
    } else if (reusedDocuments[document.id]) {
      payload.append(`reused_document_ids[${documentId}]`, String(reusedDocuments[document.id].citizen_document_id ?? reusedDocuments[document.id]));
    }
  }

  const response = await publicService.submitLetterRequest(payload);
  return response.data?.data ?? {};
}

export function clearOnlineLetterTypeCache() {
  typesPromise = undefined;
}
