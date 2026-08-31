export const navMenuItems = [
  { label: "Beranda", route: { name: "home" } },
  {
    label: "Profil Desa",
    route: { name: "profile" },
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
  { label: "Data", route: { name: "data" } },
];


export const navMenuItemsMobile = [
  { label: "Profil Kalurahan", route: { name: "profile" } },
  { label: "Agenda", route: { name: "events" } },
  { label: "Galeri", route: { name: "gallery" } },
  { label: "Potensi Kalurahan", route: { name: "potential" } },
  { label: "Data Kalurahan", route: { name: "data" } },
];

export const navCta = { label: "Unduh ", icon: "pi-download", route: { name: "my-documents" } };

export const mobileBottomNav = [
  { label: "Beranda", icon: "pi pi-home", route: { name: "home" } },
  { label: "Surat", icon: "pi pi-file", route: { name: "services" } },
  { label: "Aduan", icon: "pi pi-megaphone", route: { name: "complaints" } },
  { label: "Berita", icon: "pi pi-images", route: { name: "news" } },
  { label: "Lainnya", icon: "pi pi-bars", action: "more" },
];


export const mobileMoreLinks = [
  { label: "Profil Desa", icon: "pi pi-building", route: { name: "profile" } },
  { label: "Agenda Desa", icon: "pi pi-calendar", route: { name: "events" } },
  { label: "Gallery Desa", icon: "pi pi-image", route: { name: "gallery" } },
  { label: "Potensi Desa", icon: "pi pi-map", route: { name: "potential" } },
  { label: "Data", icon: "pi pi-map-marker", route: { name: "region" } },
  { label: "Unduh Dokumen", icon: "pi pi-download", route: { name: "my-documents" } },
];