import api from "./api";

export const statusMeta = {
  planned: { label: "Perencanaan", severity: "secondary", icon: "pi pi-clock" },
  "in-progress": { label: "Sedang Berjalan", severity: "info", icon: "pi pi-sync" },
  completed: { label: "Selesai", severity: "success", icon: "pi pi-check-circle" },
};

export const developmentStatusOptions = [
  { label: "Semua", value: "all" },
  { label: statusMeta.planned.label, value: "planned" },
  { label: statusMeta["in-progress"].label, value: "in-progress" },
  { label: statusMeta.completed.label, value: "completed" },
];

const categoryIcons = {
  infrastruktur: "pi pi-building",
  kesehatan: "pi pi-heart",
  pendidikan: "pi pi-book",
  lingkungan: "pi pi-globe",
  sosial: "pi pi-users",
};

export function categoryIcon(category) {
  return categoryIcons[String(category || "").toLowerCase()] || "pi pi-tag";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(dateString) {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mapStatus(status) {
  const value = String(status || "").toLowerCase().replace(/[\s_]+/g, "-");
  if (["completed", "done", "selesai"].includes(value)) return "completed";
  if (["in-progress", "ongoing", "sedang-berjalan", "berjalan"].includes(value)) return "in-progress";
  return "planned";
}

const PHOTO_PERCENTS = [0, 50, 100];

function buildPhotoSlots(photos = []) {
  return PHOTO_PERCENTS.map((percent) => {
    const found = photos.find((photo) => Number(photo.percent ?? photo.progress_percent) === percent);
    return { percent, image: found?.image || found?.url || found?.photo || "" };
  });
}

function mapMilestone(milestone) {
  return {
    title: milestone.title,
    date: milestone.date,
    done: Boolean(milestone.done ?? milestone.is_done),
  };
}

function mapDevelopmentItem(item) {
  const startDate = item.start_date || "";
  return {
    id: item.development_id ?? item.id,
    slug: item.slug,
    title: item.title,
    category: item.category?.category_name || item.category || "Umum",
    status: mapStatus(item.status),
    year: item.year || (startDate ? Number(startDate.slice(0, 4)) : null),
    image: item.thumbnail || item.image || "",
    shortDesc: item.short_description || (item.description || "").slice(0, 160),
    longDesc: item.description || "",
    location: item.location || "-",
    volume: item.volume || "-",
    latitude: Number(item.latitude) || null,
    longitude: Number(item.longitude) || null,
    documentationImage: item.documentation_image || "",
    photos: buildPhotoSlots(item.photos),
    budget: item.budget ?? 0,
    fundingSource: item.funding_source || "-",
    contractor: item.contractor || "-",
    startDate,
    endDate: item.end_date || "",
    progress: Math.min(100, Math.max(0, Number(item.progress) || 0)),
    milestones: (item.milestones || []).map(mapMilestone),
  };
}

/* ============ DATA DUMMY ============*/
const USE_DUMMY_DATA = true;

const dummyDevelopments = [
  {
    slug: "rehabilitasi-jalan-padukuhan-sorasan",
    volume: "850 meter",
    latitude: -7.7075,
    longitude: 110.462,
    title: "Rehabilitasi Jalan Lingkungan Padukuhan Sorasan",
    category: "Infrastruktur",
    status: "in-progress",
    year: 2026,
    location: "Padukuhan Sorasan, RT 04/RW 25",
    shortDesc: "Pengaspalan ulang dan perbaikan drainase jalan lingkungan sepanjang kurang lebih 850 meter.",
    longDesc:
      "Kegiatan meliputi pengaspalan ulang badan jalan, pembuatan saluran drainase di sisi jalan, dan pemasangan rambu sederhana. Tujuannya memperlancar akses warga dan hasil pertanian serta mengurangi genangan saat musim hujan.",
    budget: 250000000,
    fundingSource: "Dana Desa",
    contractor: "TPK Kalurahan",
    startDate: "2026-03-01",
    endDate: "2026-11-30",
    progress: 65,
    milestones: [
      { title: "Musyawarah dan penetapan lokasi", date: "2026-01-15", done: true },
      { title: "Pembangunan saluran drainase", date: "2026-06-20", done: true },
      { title: "Pengaspalan badan jalan", date: "2026-10-30", done: false },
      { title: "Serah terima pekerjaan", date: "2026-11-30", done: false },
    ],
  },
  {
    slug: "pembangunan-posyandu-nengahan",
    volume: "1 unit (± 72 m²)",
    latitude: -7.716,
    longitude: 110.45,
    title: "Pembangunan Gedung Posyandu Padukuhan Nengahan",
    category: "Kesehatan",
    status: "completed",
    year: 2025,
    location: "Padukuhan Nengahan, RT 02/RW 10",
    shortDesc: "Gedung posyandu permanen untuk layanan ibu, balita, dan lansia di Padukuhan Nengahan.",
    longDesc:
      "Gedung posyandu dibangun permanen dengan ruang pemeriksaan, ruang tunggu, dan toilet sehingga kegiatan posyandu tidak lagi menumpang di rumah warga.",
    budget: 180000000,
    fundingSource: "APBKal",
    contractor: "TPK Kalurahan",
    startDate: "2025-02-01",
    endDate: "2025-08-31",
    progress: 100,
    milestones: [
      { title: "Penetapan lokasi dan desain", date: "2025-01-20", done: true },
      { title: "Pembangunan struktur dan atap", date: "2025-05-15", done: true },
      { title: "Serah terima dan peresmian", date: "2025-08-31", done: true },
    ],
  },
  {
    slug: "renovasi-ruang-paud-terpadu",
    volume: "3 ruang kelas",
    latitude: -7.7132,
    longitude: 110.4551,
    title: "Renovasi Ruang Belajar PAUD Terpadu",
    category: "Pendidikan",
    status: "planned",
    year: 2027,
    location: "Kompleks Balai Kalurahan Bimomartani",
    shortDesc: "Perbaikan ruang kelas, area bermain, dan sanitasi PAUD agar lebih aman bagi anak.",
    longDesc:
      "Direncanakan penggantian atap, pengecatan ulang ruang kelas, pembuatan area bermain luar ruang yang aman, serta perbaikan sanitasi ramah anak. Saat ini masih tahap perencanaan.",
    budget: 120000000,
    fundingSource: "Dana Desa",
    contractor: "Belum ditetapkan",
    startDate: "2027-02-01",
    endDate: "2027-06-30",
    progress: 0,
    milestones: [
      { title: "Musyawarah perencanaan", date: "2026-12-10", done: false },
      { title: "Penyusunan RAB dan desain", date: "2027-01-15", done: false },
      { title: "Pelaksanaan renovasi", date: "2027-02-01", done: false },
    ],
  },
  {
    slug: "pembangunan-bank-sampah",
    volume: "1 unit bangunan",
    latitude: -7.7118,
    longitude: 110.4535,
    title: "Pembangunan Bank Sampah dan Pengolahan Kompos",
    category: "Lingkungan",
    status: "in-progress",
    year: 2026,
    location: "Padukuhan Krajan, RT 01/RW 03",
    shortDesc: "Fasilitas pemilahan sampah rumah tangga dan pengolahan kompos yang dikelola warga.",
    longDesc:
      "Bank sampah menjadi pusat pemilahan sampah anorganik dan pengolahan sampah organik menjadi kompos. Dikelola kelompok warga sehingga juga membuka penghasilan tambahan.",
    budget: 95000000,
    fundingSource: "APBKal",
    contractor: "Kelompok Pengelola Sampah Mandiri",
    startDate: "2026-05-01",
    endDate: "2026-12-15",
    progress: 40,
    milestones: [
      { title: "Sosialisasi kepada warga", date: "2026-04-15", done: true },
      { title: "Pembangunan bangunan utama", date: "2026-08-30", done: true },
      { title: "Pengadaan alat pengolah kompos", date: "2026-11-01", done: false },
      { title: "Peresmian dan operasional", date: "2026-12-15", done: false },
    ],
  },
  {
    slug: "pembangunan-talud-irigasi",
    volume: "320 meter",
    latitude: -7.7195,
    longitude: 110.4585,
    title: "Pembangunan Talud Saluran Irigasi Persawahan",
    category: "Infrastruktur",
    status: "completed",
    year: 2025,
    location: "Area persawahan, Padukuhan Gandu",
    shortDesc: "Penguatan tebing saluran irigasi untuk menjaga pasokan air ke lahan pertanian warga.",
    longDesc:
      "Talud dibangun di sepanjang saluran irigasi yang rawan longsor agar aliran air ke lahan pertanian lancar dan biaya perawatan tiap musim tanam berkurang.",
    budget: 160000000,
    fundingSource: "Dana Desa",
    contractor: "TPK Kalurahan",
    startDate: "2025-03-01",
    endDate: "2025-07-31",
    progress: 100,
    milestones: [
      { title: "Survei dan penetapan titik", date: "2025-02-10", done: true },
      { title: "Pemasangan pasangan batu", date: "2025-06-30", done: true },
      { title: "Serah terima pekerjaan", date: "2025-07-31", done: true },
    ],
  },
  {
    slug: "pengadaan-ambulans-kalurahan",
    volume: "1 unit",
    latitude: -7.713,
    longitude: 110.4553,
    title: "Pengadaan Ambulans Kalurahan",
    category: "Kesehatan",
    status: "planned",
    year: 2027,
    location: "Kantor Kalurahan Bimomartani",
    shortDesc: "Kendaraan ambulans untuk mendukung layanan darurat dan rujukan warga.",
    longDesc:
      "Ambulans kalurahan direncanakan melayani antar-jemput pasien rujukan dan kondisi darurat bagi seluruh warga. Pengelolaan operasional akan diatur dalam peraturan kalurahan.",
    budget: 450000000,
    fundingSource: "APBKal",
    contractor: "Belum ditetapkan",
    startDate: "2027-04-01",
    endDate: "2027-09-30",
    progress: 0,
    milestones: [
      { title: "Pembahasan di musyawarah kalurahan", date: "2027-01-20", done: false },
      { title: "Proses pengadaan", date: "2027-04-01", done: false },
      { title: "Serah terima kendaraan", date: "2027-09-30", done: false },
    ],
  },
  {
    slug: "pemasangan-lampu-jalan-tenaga-surya",
    volume: "40 titik",
    latitude: -7.7105,
    longitude: 110.458,
    title: "Pemasangan Lampu Jalan Tenaga Surya",
    category: "Infrastruktur",
    status: "completed",
    year: 2024,
    location: "Jalan utama Padukuhan Sorasan - Nengahan",
    shortDesc: "Pemasangan 40 titik lampu jalan tenaga surya di ruas jalan yang minim penerangan.",
    longDesc:
      "Lampu jalan tenaga surya dipasang di ruas jalan yang sebelumnya gelap untuk meningkatkan keamanan warga yang beraktivitas pada malam hari, tanpa menambah beban listrik kalurahan.",
    budget: 200000000,
    fundingSource: "Dana Desa",
    contractor: "Penyedia Barang/Jasa",
    startDate: "2024-06-01",
    endDate: "2024-09-15",
    progress: 100,
    milestones: [
      { title: "Penetapan titik lampu", date: "2024-05-10", done: true },
      { title: "Pemasangan tiang dan panel", date: "2024-08-01", done: true },
      { title: "Serah terima pekerjaan", date: "2024-09-15", done: true },
    ],
  },
  {
    slug: "perpustakaan-kalurahan",
    volume: "1 unit (± 60 m²)",
    latitude: -7.7134,
    longitude: 110.4556,
    title: "Pembangunan Perpustakaan dan Taman Baca Kalurahan",
    category: "Pendidikan",
    status: "in-progress",
    year: 2026,
    location: "Samping Balai Kalurahan Bimomartani",
    shortDesc: "Ruang baca nyaman untuk anak dan warga lengkap dengan koleksi buku dan akses internet.",
    longDesc:
      "Perpustakaan dilengkapi rak buku, ruang baca anak, dan jaringan internet gratis untuk mendukung kegiatan belajar dan literasi warga.",
    budget: 140000000,
    fundingSource: "APBKal",
    contractor: "TPK Kalurahan",
    startDate: "2026-06-01",
    endDate: "2027-01-31",
    progress: 25,
    milestones: [
      { title: "Penyusunan desain bangunan", date: "2026-05-20", done: true },
      { title: "Pembangunan fisik", date: "2026-11-30", done: false },
      { title: "Pengadaan buku dan perabot", date: "2027-01-15", done: false },
    ],
  },
  {
    slug: "penghijauan-bantaran-sungai",
    volume: "500 pohon",
    latitude: -7.721,
    longitude: 110.46,
    title: "Penghijauan dan Penataan Bantaran Sungai",
    category: "Lingkungan",
    status: "planned",
    year: 2027,
    location: "Bantaran sungai, Padukuhan Gandu",
    shortDesc: "Penanaman pohon dan penataan jalur pejalan kaki di sepanjang bantaran sungai.",
    longDesc:
      "Kegiatan ini bertujuan mencegah erosi tebing sungai sekaligus menyediakan ruang hijau dan jalur santai bagi warga. Pelaksanaan melibatkan kelompok peduli lingkungan setempat.",
    budget: 75000000,
    fundingSource: "Dana Desa",
    contractor: "Belum ditetapkan",
    startDate: "2027-03-01",
    endDate: "2027-08-31",
    progress: 0,
    milestones: [
      { title: "Survei lokasi bersama warga", date: "2027-01-25", done: false },
      { title: "Penanaman pohon", date: "2027-03-15", done: false },
      { title: "Penataan jalur pejalan kaki", date: "2027-08-31", done: false },
    ],
  },
];

let cache = null;

export async function fetchAllDevelopments() {
  if (USE_DUMMY_DATA) {
    cache = dummyDevelopments.map((item) => ({
      ...item,
      image: "",
      documentationImage: "",
      photos: buildPhotoSlots(),
    }));
    return cache;
  }
  const res = await api.get("/developments");
  cache = res.data.data.map(mapDevelopmentItem);
  return cache;
}

export async function getDevelopmentBySlug(slug) {
  if (!cache) await fetchAllDevelopments();
  return cache.find((item) => item.slug === slug) || null;
}

export async function getRelatedDevelopments(current, limit = 3) {
  if (!current) return [];
  if (!cache) await fetchAllDevelopments();
  return cache
    .filter((item) => item.slug !== current.slug && item.category === current.category)
    .slice(0, limit);
}