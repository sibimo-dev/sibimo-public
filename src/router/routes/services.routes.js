import { LETTER_REGISTRY } from "@/data/letterRegistry";

/* Auto-load semua file surat (1 surat = 1 file .vue):
     views/services/letters/<group>/<slug>.vue
   group = certificates, applications, orders, declarations, replies, cover-letters
           (sesuai kategori pemetaan Blade), serta birth, death, married-man, marriage-women, letter-c
   Judul, tab katalog (category) & group diambil dari data/letterRegistry.js. */
const letterFiles = import.meta.glob("@/views/services/letters/*/*.vue");

function letterRoutes(flow) {
  return LETTER_REGISTRY.filter((l) => l.flow === flow).flatMap((l) => {
    const suffix = `/letters/${l.group}/${l.slug}.vue`;
    const key = Object.keys(letterFiles).find((k) => k.endsWith(suffix));
    if (!key) {
      console.warn(`[router] File surat tidak ditemukan: ${suffix}`);
      return [];
    }
    return [{ path: l.category ? `${l.category}/${l.slug}` : l.slug, name: `${flow}-${l.slug}`, component: letterFiles[key] }];
  });
}

export { GENERAL_CATEGORIES } from "@/data/letterRegistry";

export default [
  /* 0. Landing: pilih Layanan Umum / Perizinan */
  {
    path: "/services",
    name: "services",
    component: () => import("@/views/services/general/ServicesLandingView.vue"),
  },

  /* 1. LAYANAN UMUM */
  {
    path: "/services/general",
    children: [
      { path: "", redirect: { name: "general-verify" } },

      // Cek NIK
      {
        path: "verify",
        name: "general-verify",
        component: () => import("@/views/services/general/verify/VerifyNikView.vue"),
      },

      // Daftar warga baru (NIK tidak ditemukan): wizard yang sama dengan paket surat
      // (Pilih Surat → Isian per surat → Dokumen → Cek & Kirim)
      {
        path: "register",
        name: "general-register-select-letters",
        component: () => import("@/views/services/general/register/RegisterWizardView.vue"),
        meta: { requiresNik: true },
      },

      // Katalog surat (hanya untuk warga terverifikasi)
      {
        path: "catalog",
        name: "general-catalog",
        component: () => import("@/views/services/general/catalog/GeneralCatalogView.vue"),
        meta: { requiresResident: true },
      },

      // Paket surat: ceklis surat -> isian & dokumen per surat -> cek ulang -> kirim
      {
        path: "bundle/:bundle",
        name: "general-bundle",
        component: () => import("@/views/services/general/bundle/BundleWizardView.vue"),
        meta: { requiresResident: true },
      },

      // Pengajuan surat: /services/general/letters/<kategori>/<slug>
      {
        path: "letters",
        meta: { requiresResident: true },
        children: letterRoutes("general"),
      },
    ],
  },

  /* 2. PERIZINAN */
  {
    path: "/services/permit",
    children: [
      {
        path: "",
        name: "permit-catalog",
        component: () => import("@/views/services/permit/PermitCatalogView.vue"),
      },
      // /services/permit/letters/<slug>
      { path: "letters", children: letterRoutes("permit") },
    ],
  },
];
