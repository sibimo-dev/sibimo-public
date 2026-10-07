import { GENERAL_CATEGORIES as ALL_CATEGORIES, LETTER_REGISTRY as ALL_LETTERS } from "./letterRegistry";

/* Surat Balasan & Perintah tidak ditampilkan ke publik (hanya dipakai internal/kantor).
   Entri tetap ada di letterRegistry.js supaya template & route tidak hilang. */
const HIDDEN_CATEGORIES = new Set(["balasan", "perintah"]);
const HIDDEN_PUBLIC_SLUGS = new Set(["permit-followup-letter"]); // Surat Tindak Lanjut Permohonan Izin (jenis Balasan)

/* Surat penduduk/tinggal sementara hanya untuk warga luar yang NIK-nya belum terdaftar.
   Tidak ditampilkan di katalog Layanan Warga (terdaftar); entri tetap ada di letterRegistry.js
   & letterIndex.js supaya template dan route-nya tetap jalan. Alur NIK belum terdaftar memakai NON_RESIDENT_SERVICES. */
const NON_RESIDENT_SLUGS = new Set(["temporary-resident-request", "temporary-stay-application-form"]);

const LETTER_REGISTRY = ALL_LETTERS.filter((l) => !HIDDEN_CATEGORIES.has(l.category) && !HIDDEN_PUBLIC_SLUGS.has(l.slug) && !NON_RESIDENT_SLUGS.has(l.slug));
const GENERAL_CATEGORIES = ALL_CATEGORIES.filter((c) => !HIDDEN_CATEGORIES.has(c.value));

const CATEGORY_META = {
  permohonan: { badge: "Umum", icon: "pi pi-file-edit" },
  pernyataan: { badge: "Sosial", icon: "pi pi-verified" },
  keterangan: { badge: "Sosial", icon: "pi pi-id-card" },
  perintah: { badge: "Umum", icon: "pi pi-send" },
  pengantar: { badge: "Umum", icon: "pi pi-envelope" },
  balasan: { badge: "Umum", icon: "pi pi-reply" },
};

function decorate(item) {
  const meta = item.flow === "permit" ? { badge: "Ekonomi", icon: "pi pi-briefcase" } : CATEGORY_META[item.category];
  return {
    ...item,
    badge: meta.badge,
    icon: meta.icon,
    shortCode: item.slug.split("-").map((w) => w[0]).join("").toUpperCase(),
    description: `Ajukan ${item.title} secara online.`,
    to: item.flow === "permit"
      ? `/services/permit/letters/${item.slug}`
      : `/services/general/letters/${item.category}/${item.slug}`,
  };
}

export { GENERAL_CATEGORIES };
export const GENERAL_SERVICES = LETTER_REGISTRY.filter((l) => l.flow === "general").map(decorate);
export const PERMIT_SERVICES = LETTER_REGISTRY.filter((l) => l.flow === "permit").map(decorate);
export const NON_RESIDENT_SERVICES = ALL_LETTERS.filter((l) => l.flow === "general" && NON_RESIDENT_SLUGS.has(l.slug)).map(decorate);