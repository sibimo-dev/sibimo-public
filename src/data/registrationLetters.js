/* Menyusun "paket" pendaftaran warga baru dari berkas surat (views/services/letters/<group>/<slug>.vue).
   Satu dokumen register (data/registrationDocs.js) menunjuk satu/lebih surat lewat `letters: [slug]`.
   Isian & dokumen pendukung DIBACA dari `sections` & `documents` yang di-export berkas surat itu, jadi diubah di
   berkas suratnya. Hasilnya berbentuk sama dengan paket surat (data/letterBundles.js) sehingga memakai BundleWizard yang sama:
   1 dokumen = 1 "surat" = 1 halaman isian (step di dalam step). */
import { docsForType, residentTypeOf } from "./registrationDocs";
import { LETTER_INDEX } from "@/views/services/layout/letterIndex";

const modules = import.meta.glob("@/views/services/letters/*/*.vue");
const cache = new Map();

async function partsOfLetter(slug) {
  if (cache.has(slug)) return cache.get(slug);
  const path = Object.keys(modules).find((p) => p.endsWith(`/${slug}.vue`));
  let parts = { sections: [], documents: [] };
  if (!path) console.warn(`[register] Berkas surat tidak ditemukan: ${slug}.vue`);
  else {
    const mod = await modules[path]();
    if (Array.isArray(mod.sections)) parts = { sections: mod.sections, documents: mod.documents ?? [] };
    else console.warn(`[register] ${slug}.vue belum meng-export \`sections\` (pindahkan ke <script> biasa dengan "export const").`);
  }
  cache.set(slug, parts);
  return parts;
}

const labelOf = (d) => (typeof d === "string" ? d : d.label);

/* Gabungkan beberapa surat jadi satu halaman isian: isian dengan kunci yang sama hanya muncul sekali,
   section yang jadi kosong dibuang; dokumen dengan label sama hanya sekali (wajib bila wajib di salah satunya). */
function merge(parts) {
  if (parts.length === 1) return parts[0];
  const seen = new Set();
  const sections = [];
  for (const s of parts.flatMap((p) => p.sections)) {
    const fields = s.fields.filter((fl) => !seen.has(fl.key));
    fields.forEach((fl) => seen.add(fl.key));
    if (fields.length) sections.push({ ...s, fields });
  }
  const docs = new Map();
  for (const d of parts.flatMap((p) => p.documents)) {
    const cur = docs.get(labelOf(d));
    const optional = typeof d === "string" ? false : !!d.optional;
    if (!cur) docs.set(labelOf(d), typeof d === "string" ? d : { ...d });
    else if (!optional) docs.set(labelOf(d), labelOf(d));
  }
  return { sections, documents: [...docs.values()] };
}

/* Dokumen dengan `separate: true` TIDAK digabung: tiap surat di `letters` jadi satu langkah isian sendiri
   (id langkah = slug surat; judul & kode dari data/letterIndex.js). Di langkah "Pilih Surat" hanya muncul SATU kartu
   (judul/deskripsi/kode dokumen); memilihnya otomatis memilih semua suratnya (surat ke-2 dst. `hidden`, dibawa lewat `with`).
   Isian dengan kunci yang sama tetap terisi otomatis di langkah berikutnya karena form dipakai bersama. */
const letterMeta = (slug) => {
  const row = LETTER_INDEX.find((r) => r[0] === slug && r[1] === "general");
  return { title: row?.[3] ?? slug, code: row?.[4] ?? slug.toUpperCase() };
};

/* Paket pendaftaran untuk jenis pendaftaran tertentu. `ui` = penyesuaian teks/navigasi BundleWizard. */
export async function buildRegisterBundle({ type, nik, preselected = [], ui = {} }) {
  const docs = docsForType(type);
  const info = residentTypeOf(type);
  const group = info?.label ?? "Surat yang tersedia";
  const letters = (
    await Promise.all(
      docs.map(async (d) => {
        if (d.separate) {
          return Promise.all(
            d.letters.map(async (slug, i) => {
              const { sections, documents } = await partsOfLetter(slug);
              const { title, code } = letterMeta(slug);
              const base = { id: slug, slug, title, code, group, description: d.description, hue: d.hue, icon: d.icon, sections, documents };
              return i === 0
                ? { ...base, with: d.letters.slice(1), cardTitle: d.label, cardDescription: d.description, cardCode: d.code }
                : { ...base, hidden: true };
            }),
          );
        }
        const { sections, documents } = merge(await Promise.all(d.letters.map(partsOfLetter)));
        return [{ id: d.value, slug: d.letters[0], title: d.label, code: d.code, group, description: d.description, hue: d.hue, icon: d.icon, sections, documents }];
      }),
    )
  ).flat();
  // pilihan awal berupa nilai dokumen → ubah ke id langkah (dokumen `separate` = semua suratnya)
  const preselectedIds = preselected.flatMap((v) => {
    const d = docs.find((x) => x.value === v);
    return d?.separate ? d.letters : [v];
  });
  return {
    slug: "pendaftaran-warga-baru",
    title: "Pendaftaran Warga Baru",
    description: `NIK ${nik || "-"} belum terdaftar. Pilih surat/dokumen kependudukan yang Anda butuhkan untuk mendaftar.`,
    icon: "pi pi-user-plus",
    hue: "violet",
    aliases: [],
    letters,
    ui: { preselected: preselectedIds, ...ui },
  };
}