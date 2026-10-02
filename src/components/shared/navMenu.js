export const navMenuItems = [
  { label: "Beranda", route: { name: "home" } },
  {
    label: "Profil",
    route: { name: "profile" },
  },
  {
    label: "Layanan Mandiri",
    route: { name: "services" },
  },
  {
    label: "Informasi",
    items: [
      { label: "Berita Kalurahan", route: { name: "news" } },
      { label: "Agenda Kalurahan", route: { name: "events" } },
      { label: "Galeri Kalurahan", route: { name: "gallery" } },
    ],
  },
  { label: "Aduan", route: { name: "complaints" } },
  { label: "Potensi ", route: { name: "potential" } },
  { label: "Data", route: { name: "data" } },
];

// Hamburger mobile: Potensi dihapus (sudah ada di bottom nav)
export const navMenuItemsMobile = [
  { label: "Profil Kalurahan", route: { name: "profile" } },
  { label: "Agenda", route: { name: "events" } },
  { label: "Galeri", route: { name: "gallery" } },
  { label: "Data Kalurahan", route: { name: "data" } },
];

// Tidak dipakai bottom nav lagi, dibiarkan kalau dipakai di tempat lain
export const navCta = { label: "Unduh ", icon: "pi-download", route: { name: "my-documents" } };

// Bottom nav: Potensi menggantikan Unduh
export const mobileBottomNav = [
  { label: "Beranda", icon: "pi pi-home", route: { name: "home" } },
  { label: "Surat", icon: "pi pi-file", route: { name: "services" } },
  { label: "Aduan", icon: "pi pi-megaphone", route: { name: "complaints" } },
  { label: "Berita", icon: "pi pi-images", route: { name: "news" } },
  { label: "Potensi", icon: "pi pi-star", route: { name: "potential" } },
  { label: "Lainnya", icon: "pi pi-bars", action: "more" },
];

export const mobileMoreLinks = [
  { label: "Profil Kalurahan", icon: "pi pi-building", route: { name: "profile" } },
  { label: "Agenda Kalurahan", icon: "pi pi-calendar", route: { name: "events" } },
  { label: "Gallery Kalurahan", icon: "pi pi-image", route: { name: "gallery" } },
  { label: "Data Kalurahan", icon: "pi pi-map-marker", route: { name: "region" } },
  { label: "Unduh Dokumen", icon: "pi pi-download", route: { name: "my-documents" } },
];