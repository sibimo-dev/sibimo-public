import publicService from "./publicService";
import { getOnlineLetterConfig } from "@/data/letterBackendMap";

let typesPromise;

const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

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
    ["kk", "kk"],
    ["kartutanda", "ktp"],
    ["ktp", "ktp"],
    ["pasfoto", "foto"],
  ];
  const alias = aliases.find(([needle]) => normalizedLabel.includes(needle));
  if (alias) {
    const match = documents.find((document) => normalize(document.document_name).includes(alias[1]));
    if (match) return match.letter_type_document_id;
  }

  const fallback = documents.find((document) => !document.is_required && /lain|pendukung|tambahan/i.test(document.document_name));
  return fallback?.letter_type_document_id ?? documents[0]?.letter_type_document_id ?? null;
}

export async function submitOnlineLetter({ slug, form, files, documents, resident }) {
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
  );
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

  for (const document of documents ?? []) {
    const file = files?.[document.id];
    if (!file) continue;
    const documentId = resolveDocumentId(document.label, type.documents ?? []);
    if (!documentId) throw new Error(`Dokumen ${document.label} belum memiliki konfigurasi backend.`);
    payload.append("attachments[]", file, file.name);
    payload.append("attachment_document_ids[]", String(documentId));
  }

  const response = await publicService.submitLetterRequest(payload);
  return response.data?.data ?? {};
}

export function clearOnlineLetterTypeCache() {
  typesPromise = undefined;
}
