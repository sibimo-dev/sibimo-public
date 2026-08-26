export const navMenuItems = [
  { label: "Beranda", route: { name: "home" } },
  {
    label: "Profil Desa",
    route: { name: "profile" },
    items: [
      { label: "Sejarah Kalurahan", route: { name: "profile", hash: "#history" } },
      { label: "Visi & Misi", route: { name: "profile", hash: "#vision-mission" } },
      { label: "Struktur Organisasi", route: { name: "profile", hash: "#org-structure" } },
    ],
  },
  {
    label: "Layanan Surat",
    route: { name: "services" },
  },
  {
    label: "Informasi",
    items: [
      { label: "Berita Desa", route: { name: "news" } },
      { label: "Agenda Desa", route: { name: "events" } },
      { label: "Gallery Desa", route: { name: "gallery" } },
    ],
  },
  { label: "Aduan", route: { name: "complaints" } },
  { label: "Potensi Desa", route: { name: "potential" } },
];


export const navCta = { label: "Unduh Dokumen", icon: "pi-download", route: { name: "my-documents" } };


export const mobileBottomNav = [
  { label: "Beranda", icon: "pi pi-home", route: { name: "home" } },
  { label: "Layanan", icon: "pi pi-file", route: { name: "services" } },
  { label: "Aduan", icon: "pi pi-megaphone", route: { name: "complaints" } },
  { label: "Berita", icon: "pi pi-images", route: { name: "news" } },
  { label: "Lainnya", icon: "pi pi-bars", action: "more" },
];

// Contents of the mobile "Lainnya" bottom sheet.
export const mobileMoreLinks = [
  { label: "Profil Desa", icon: "pi pi-building", route: { name: "profile" } },
  { label: "Agenda Desa", icon: "pi pi-calendar", route: { name: "events" } },
  { label: "Gallery Desa", icon: "pi pi-image", route: { name: "gallery" } },
  { label: "Potensi Desa", icon: "pi pi-map", route: { name: "potential" } },
  { label: "Unduh Dokumen", icon: "pi pi-download", route: { name: "my-documents" } },
];