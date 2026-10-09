/* Pencari berkas surat untuk kartu katalog.
   Kartu katalog (GENERAL_SERVICES / PERMIT_SERVICES) dicocokkan ke berkas surat lewat:
     1) slug kartu  = nama berkas letters/<kategori>/<slug>.vue atau nama template PDF
     2) judul kartu = judul pada <LetterWizard title="...">
     3) kode kartu  = kode surat, hanya bila kodenya unik di lingkup itu
   Catatan: berkas yang sama (mis. Surat Keterangan Usaha/Penghasilan/Keramaian/Jalan di letters/certificates) dipakai oleh alur "general" dan "permit".
   Bila ada kartu yang slug/judulnya berbeda dari berkas, isi LETTER_ALIASES di bawah: { "slug-kartu": "slug-berkas" }. */
import { LETTER_INDEX } from "./letterIndex";

export const LETTER_ALIASES = {};

const modules = import.meta.glob("../letters/*/*.vue");
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

const ENTRIES = LETTER_INDEX.map(([file, scope, category, title, code, blade]) => {
  const path = Object.keys(modules).find((p) => p.endsWith(`/${file}.vue`));
  return { file, scope, category, title, code, blade, load: modules[path] };
}).filter((e) => e.load);

export function findLetter(service, scope = "general") {
  if (!service) return null;
  const pool = ENTRIES.filter((e) => e.scope === scope);
  const alias = LETTER_ALIASES[service.slug];
  if (alias) return pool.find((e) => e.file === alias) ?? null;

  const slug = norm(service.slug);
  const title = norm(service.title);
  const code = norm(service.shortCode ?? service.code);
  const byCode = code ? pool.filter((e) => norm(e.code) === code) : [];

  return (
    (slug && pool.find((e) => norm(e.file) === slug || norm(e.blade) === slug)) ||
    (title && pool.find((e) => norm(e.title) === title)) ||
    (byCode.length === 1 ? byCode[0] : null) ||
    null
  );
}

/* Dipakai LetterOutlet: ambil berkas surat persis berdasarkan nama berkas (nilai ?letter= di URL). */
export const findLetterByFile = (file, scope = "general") => ENTRIES.find((e) => e.scope === scope && e.file === file) ?? null;
