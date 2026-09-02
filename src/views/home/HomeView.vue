<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Tag from "primevue/tag";
import HeroCarousel from "@/components/shared/HeroCarousel.vue";

const router = useRouter();

/* ============ HERO SEARCH ============ */
const searchQuery = ref("");

function handleSearch() {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return;

  if (/berita|informasi|kabar|artikel/.test(q)) {
    router.push({ name: "news" });
  } else if (/aduan|lapor|keluhan|pengaduan/.test(q)) {
    router.push({ name: "complaints" });
  } else if (/wilayah|peta|dusun|rt|rw/.test(q)) {
    router.push({ name: "region" });
  } else if (/bumdes|usaha desa/.test(q)) {
    router.push({ name: "bumdes" });
  } else if (/potensi|umkm|wisata|pariwisata|pertanian/.test(q)) {
    router.push({ name: "potential" });
  } else if (/agenda|kegiatan|jadwal/.test(q)) {
    router.push({ name: "events" });
  } else if (/galeri|foto|dokumentasi/.test(q)) {
    router.push({ name: "gallery" });
  } else {
    router.push({ name: "services", query: { q: searchQuery.value.trim() } });
  }
}

function handleImgError(event) {
  event.target.style.display = "none";
}

/* ============ COLOR SYSTEM ============
   Palet warna bergilir yang sama semangatnya dengan halaman Gallery
   (sky / rose / amber / violet / emerald / indigo), dipakai di seluruh
   section Home supaya nuansa warnanya konsisten satu sama lain. */
const colorPalette = [
  {
    name: "sky",
    gradient: "from-sky-600 to-cyan-600",
    iconBg: "bg-sky-50",
    iconText: "text-sky-700",
    ring: "ring-sky-200",
    badge: "bg-sky-50 text-sky-700",
    topBar: "bg-gradient-to-r from-sky-400 to-cyan-500",
    dot: "bg-sky-500",
    border: "border-sky-200 hover:border-sky-300",
    glow: "bg-sky-400/20",
  },
  {
    name: "rose",
    gradient: "from-rose-600 to-pink-600",
    iconBg: "bg-rose-50",
    iconText: "text-rose-700",
    ring: "ring-rose-200",
    badge: "bg-rose-50 text-rose-700",
    topBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    dot: "bg-rose-500",
    border: "border-rose-200 hover:border-rose-300",
    glow: "bg-rose-400/20",
  },
  {
    name: "amber",
    gradient: "from-amber-600 to-orange-600",
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    ring: "ring-amber-200",
    badge: "bg-amber-50 text-amber-700",
    topBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    dot: "bg-amber-500",
    border: "border-amber-200 hover:border-amber-300",
    glow: "bg-amber-400/20",
  },
  {
    name: "violet",
    gradient: "from-violet-600 to-purple-600",
    iconBg: "bg-violet-50",
    iconText: "text-violet-700",
    ring: "ring-violet-200",
    badge: "bg-violet-50 text-violet-700",
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    dot: "bg-violet-500",
    border: "border-violet-200 hover:border-violet-300",
    glow: "bg-violet-400/20",
  },
  {
    name: "emerald",
    gradient: "from-emerald-600 to-teal-600",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-700",
    ring: "ring-emerald-200",
    badge: "bg-emerald-50 text-emerald-700",
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    dot: "bg-emerald-500",
    border: "border-emerald-200 hover:border-emerald-300",
    glow: "bg-emerald-400/20",
  },
  {
    name: "indigo",
    gradient: "from-indigo-600 to-blue-600",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-700",
    ring: "ring-indigo-200",
    badge: "bg-indigo-50 text-indigo-700",
    topBar: "bg-gradient-to-r from-indigo-400 to-blue-500",
    dot: "bg-indigo-500",
    border: "border-indigo-200 hover:border-indigo-300",
    glow: "bg-indigo-400/20",
  },
];

function colorAt(i) {
  return colorPalette[i % colorPalette.length];
}

/* Kategori berita -> warna tetap (bukan bergilir), biar makna warnanya
   konsisten tiap kali kategori yang sama muncul */
const newsCategoryColor = {
  Kesehatan: colorPalette[0], // sky
  Sosial: colorPalette[1], // rose
  Pembangunan: colorPalette[2], // amber
  Budaya: colorPalette[3], // violet
  Pemerintahan: colorPalette[5], // indigo
};
function colorForNewsCategory(category) {
  return newsCategoryColor[category] || colorPalette[0];
}

/* Severity aduan -> warna, selaras dengan Tag severity bawaan PrimeVue */
const complaintSeverityColor = {
  success: colorPalette[4], // emerald
  warn: colorPalette[2], // amber
  info: colorPalette[0], // sky
  danger: colorPalette[1], // rose
};
function colorForSeverity(severity) {
  return complaintSeverityColor[severity] || colorPalette[0];
}

const quickAccess = [
  {
    icon: "pi-file",
    title: "Layanan Surat",
    desc: "Pengajuan berbagai jenis surat ke kalurahan.",
    route: { name: "services" },
  },
  {
    icon: "pi-megaphone",
    title: "Pengaduan",
    desc: "Sampaikan aspirasi atau laporan kejadian di lingkungan.",
    route: { name: "complaints" },
  },
  {
    icon: "pi-map",
    title: "Data Wilayah",
    desc: "Peta dan data administratif dusun, RT, dan RW.",
  },
  {
    icon: "pi-building-columns",
    title: "BUMDes",
    desc: "Badan usaha milik desa untuk kesejahteraan warga.",
  },
];

const newsDummy = [
  {
    slug: "pembinaan-kader-gizi",
    category: "Kesehatan",
    date: "7 Agu 2026",
    title: "Pembinaan Kader Gizi",
    excerpt:
      "Jumat, 7 Agustus 2026 pukul 08.30 WIB, Pemerintah Kalurahan Bimomartani menyelenggarakan kegiatan Pembinaan Kader Gizi di Pendopo Kalurahan Bimomartani. Kegiatan diikuti oleh 30 kader gizi yang berasal dari 12 padukuhan di wilayah Kalurahan Bimomartani",
    image: "/images/news/berita1.jpeg",
  },
  {
    slug: "pemberian-pmt-bumil-kek-balita-gizi-buruk",
    category: "Kesehatan",
    date: "3 Agu 2026",
    title: "Pemberian PMT Bumil KEK dan Balita Gizi Buruk",
    excerpt:
      "Bimomartani, 3 Agustus 2026 – Pemerintah Kalurahan Bimomartani melaksanakan kegiatan Pemberian Makanan Tambahan (PMT) bagi ibu hamil dengan Kekurangan Energi Kronis (KEK) dan balita gizi buruk pada Senin, 3 Agustus 2026, pukul 10.00 WIB, bertempat di Pendopo Kalurahan Bimomartani. ",
    image: "/images/news/berita2.jpeg",
  },
];

/* Memotong excerpt di batas kata terdekat + "…" eksplisit, supaya
   preview berita tidak terpotong janggal di tengah kalimat seperti
   saat mengandalkan line-clamp CSS saja. */
function truncateExcerpt(text, maxLength = 100) {
  if (!text) return "";
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim() + "…";
}

// Dijaga hanya 3 item agar tinggi card Agenda tidak melebihi card Berita di sebelahnya
const agendaDummy = [
  { day: "15", month: "OKT", title: "Penyaluran BLT Tahap III", time: "08:00 - Selesai" },
  { day: "20", month: "OKT", title: "Kerja Bakti Rutin Lingkungan", time: "07:00 - 10:00" },
  { day: "24", month: "OKT", title: "Sosialisasi GENRE", time: "08:00 - 10:00" },
  { day: "30", month: "OKT", title: "Pelatihan UMKM", time: "09:00 - 12:00" },
  { day: "05", month: "NOV", title: "Musyawarah Desa", time: "13:00 - 15:00" },
];

const complaintsDummy = [
  {
    initials: "AB",
    title: "Jalan Rusak di RT 04",
    reporter: "Andi B.",
    date: "12 Okt 2026",
    status: "Sudah Ditangani",
    severity: "success",
  },
  {
    initials: "SW",
    title: "Sampah Menumpuk di Selokan",
    reporter: "Siti W.",
    date: "11 Okt 2026",
    status: "Sedang Ditinjau",
    severity: "warn",
  },
  {
    initials: "BD",
    title: "Lampu Jalan Mati di Perempatan",
    reporter: "Budi D.",
    date: "10 Okt 2026",
    status: "Diproses",
    severity: "info",
  },
];

const potentialDummy = [
  {
    icon: "pi-shopping-bag",
    title: "UMKM",
    desc: "Pusat kerajinan dan makanan khas lokal",
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    icon: "pi-sun",
    title: "Pertanian",
    desc: "Hasil bumi unggulan padi dan palawija",
    ring: "ring-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    icon: "pi-map",
    title: "Pariwisata",
    desc: "Destinasi wisata alam dan budaya khas desa",
    ring: "ring-sky-200",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  {
    icon: "pi-building-columns",
    title: "BUMDES",
    desc: "Badan usaha milik desa untuk kesejahteraan warga",
    ring: "ring-indigo-200",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
];

const galleryDummy = [
    { image: "/images/gallery/pmt-padukuhan-1.jpeg", caption: "Pemberian PMT dan Bantuan Alat Kesehatan" },
  { image: "/images/gallery/pembinaan-kader-1.jpeg", caption: "Pembinaan Kader Gizi" },
  { image: "/images/gallery/musrenbangkal-1.jpeg", caption: "Musyawarah Perencanaan Pembangunan Kalurahan" },
  { image: "/images/gallery/pembinaan-kader-2.jpeg", caption: "Pembinaan Kader Gizi" },
  { image: "/images/gallery/musrenbangkal-2.jpeg", caption: "Musyawarah Perencanaan Pembangunan Kalurahan" },
  { image: "/images/gallery/pmt-padukuhan-2.jpeg", caption: "Pemberian PMT dan Bantuan Alat Kesehatan" },
];

/* ============ STRUKTUR ORGANISASI ============ */
const lurah = {
  nama: "Tutik Wahyuningsih, S.Sos., M.AP",
  jabatan: "Lurah Kalurahan Bimomartani",
  desc: "Memimpin penyelenggaraan pemerintahan, pembangunan, dan kemasyarakatan di Kalurahan Bimomartani.",
};

const pamongList = [
  { nama: "Yudi Priyo Utomo, SE", jabatan: "Carik", desc: "Membantu Lurah dalam bidang tata usaha dan pelayanan administrasi kalurahan." },
  { nama: "Rifai Nurmansyah, S.Pd., M.Pd", jabatan: "Jagabaya", desc: "Bertanggung jawab atas urusan ketentraman dan ketertiban wilayah kalurahan." },
  { nama: "Yordan Ardi Tamara, S.Kom", jabatan: "Ulu-Ulu", desc: "Mengelola urusan pengairan dan pertanian di wilayah kalurahan." },
  { nama: "Sutriyana, S.Ag", jabatan: "Kamituwa", desc: "Mengoordinasikan wilayah kadukuhan dan urusan kemasyarakatan." },
  { nama: "Nanda Mutiara Dewi, S.Psi", jabatan: "Kaur Danarta", desc: "Mengelola urusan keuangan dan anggaran kalurahan." },
  { nama: "Rasyifa Anom Sudaryono, Amd.Kes", jabatan: "Kaur Tata Laksana", desc: "Mengelola tata laksana pemerintahan dan administrasi umum." },
  { nama: "Hanang Tri Nugroho, S.Kom", jabatan: "Kaur Pangripta", desc: "Menyusun perencanaan dan pelaporan pembangunan kalurahan." },
  { nama: "Jaka Widada", jabatan: "Dukuh I Krebet", desc: "Memimpin wilayah Padukuhan Krebet dan pelayanan warga setempat." },
  { nama: "Angga Wahyu Indra Irawan, S.Pd", jabatan: "Dukuh II Rogobangsan", desc: "Memimpin wilayah Padukuhan Rogobangsan dan pelayanan warga setempat." },
  { nama: "Umi Solikah", jabatan: "Dukuh III Kalibulus", desc: "Memimpin wilayah Padukuhan Kalibulus dan pelayanan warga setempat." },
  { nama: "Kaharudin", jabatan: "Dukuh IV Macanan", desc: "Memimpin wilayah Padukuhan Macanan dan pelayanan warga setempat." },
  { nama: "Mucharom", jabatan: "Dukuh V Cokrogaten", desc: "Memimpin wilayah Padukuhan Cokrogaten dan pelayanan warga setempat." },
  { nama: "TH Dwi Wahyu P, Amd", jabatan: "Dukuh VI Purwobinangun", desc: "Memimpin wilayah Padukuhan Purwobinangun dan pelayanan warga setempat." },
  { nama: "Sukirman", jabatan: "Dukuh VII Pondok Suruh", desc: "Memimpin wilayah Padukuhan Pondok Suruh dan pelayanan warga setempat." },
  { nama: "Sunaryo", jabatan: "Dukuh VIII Balong", desc: "Memimpin wilayah Padukuhan Balong dan pelayanan warga setempat." },
  { nama: "Suharyono", jabatan: "Dukuh IX Kragilan", desc: "Memimpin wilayah Padukuhan Kragilan dan pelayanan warga setempat." },
  { nama: "Basuki Wibowo", jabatan: "Dukuh X Banjarharjo", desc: "Memimpin wilayah Padukuhan Banjarharjo dan pelayanan warga setempat." },
  { nama: "Drs. Jazim Thoyibi", jabatan: "Dukuh XI Sorasan", desc: "Memimpin wilayah Padukuhan Sorasan dan pelayanan warga setempat." },
  { nama: "Purnomo", jabatan: "Dukuh XII Koroulon Kidul", desc: "Memimpin wilayah Padukuhan Koroulon Kidul dan pelayanan warga setempat." },
  { nama: "Ratna Kurnia Dewi", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
  { nama: "Khoirunnisa Hidaya", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
  { nama: "Mega Dwi Jayanti", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
  { nama: "Sigit Raharjo", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
  { nama: "Linggar Yudha Pranata", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
  { nama: "Riyanto", jabatan: "Staf Pamong Kalurahan", desc: "Membantu pelaksanaan tugas administrasi dan pelayanan di kalurahan." },
];

function getInitials(nama) {
  return nama
    .replace(/,.*$/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ============ FOTO PAMONG OTOMATIS DARI ASSETS ============
   Semua foto sudah ada di src/assets/struktur-organisasi/, jadi tidak
   perlu diketik satu-satu di pamongList. Path diambil otomatis lewat
   import.meta.glob, lalu dicocokkan ke `nama` masing-masing pamong. */
const pamongImages = import.meta.glob("@/assets/struktur-organisasi/*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // buang aksen
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // buang spasi, koma, titik, dst
}

const normalizedImageMap = {};
for (const path in pamongImages) {
  const filename = path.split("/").pop().replace(/\.(jpg|jpeg|png)$/i, "");
  normalizedImageMap[normalize(filename)] = pamongImages[path];
}

// nama resmi (dinormalisasi) -> nama file asli, khusus untuk file yang
// ejaannya berbeda dari nama resmi di pamongList
const fotoOverride = {
  [normalize("Rifai Nurmansyah")]: "Rifai Nurmansah",
  [normalize("Basuki Wibowo")]: "Basuki Wibawa",
  [normalize("Khoirunnisa Hidaya")]: "Khoirunisa Nurhidaya",
  [normalize("Sunaryo")]: "Sunarya",
  [normalize("Linggar Yudha Pranata")]: "Linggar Yudha",
};

function pamongFotoSrc(item) {
  const cleanName = item.nama
    .replace(/^(Drs\.?\s*)/i, "") // buang gelar di depan, mis. "Drs."
    .replace(/,.*$/, "") // buang gelar setelah koma
    .trim();

  const key = normalize(cleanName);
  const overrideFilename = fotoOverride[key];
  const lookupKey = overrideFilename ? normalize(overrideFilename) : key;

  return normalizedImageMap[lookupKey] || null;
}

const orgTrackRef = ref(null);
let orgAutoplayTimer = null;
let orgAutoplayPaused = false;
const ORG_AUTOPLAY_DELAY = 3200;

function getOrgStep() {
  const track = orgTrackRef.value;
  const firstCard = track?.children?.[0];
  if (!track || !firstCard) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap || "0");
  return firstCard.getBoundingClientRect().width + gap;
}

function advanceOrgSlide() {
  const track = orgTrackRef.value;
  if (!track || orgAutoplayPaused) return;

  const step = getOrgStep();
  const maxScroll = track.scrollWidth - track.clientWidth;

  if (track.scrollLeft >= maxScroll - 4) {
    track.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    track.scrollBy({ left: step, behavior: "smooth" });
  }
}

function scrollOrgManual(direction) {
  const track = orgTrackRef.value;
  if (!track) return;
  track.scrollBy({ left: direction * getOrgStep(), behavior: "smooth" });
}

function pauseOrgAutoplay() {
  orgAutoplayPaused = true;
}

function resumeOrgAutoplay() {
  orgAutoplayPaused = false;
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    orgAutoplayTimer = setInterval(advanceOrgSlide, ORG_AUTOPLAY_DELAY);
  }
});

onBeforeUnmount(() => {
  if (orgAutoplayTimer) clearInterval(orgAutoplayTimer);
});
</script>

<template>
  <div class="py-6 lg:py-8 flex flex-col gap-10 lg:gap-10">

    <!-- ============ HERO ============ -->
    <section
      class="relative isolate overflow-hidden rounded-3xl px-6 pt-14 pb-10 sm:px-10 sm:pt-16 sm:pb-14 lg:px-16 lg:pt-24 lg:pb-20 min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-center items-center text-white text-center"
    >
      <HeroCarousel />

      <div class="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
      <div class="pointer-events-none absolute -right-10 bottom-[-4rem] w-56 h-56 rounded-full bg-secondary-400/20 blur-2xl" />

      <div class="relative max-w-[680px] mx-auto flex flex-col items-center">
        <span class="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-secondary-300 mb-4">
          <span class="w-1.5 h-1.5 rounded-full bg-secondary-300" />
          Selamat Datang Di
        </span>

        <h1 class="font-heading font-extrabold uppercase whitespace-nowrap text-[20px] xs:text-[24px] sm:text-[38px] lg:text-[50px] leading-[1.15] tracking-tight text-white m-0">
          <span
            class="inline-block align-bottom overflow-hidden whitespace-nowrap border-r-4 border-sky-300 animate-hero-typing motion-reduce:animate-none motion-reduce:border-r-0"
            style="animation-duration: 8.5s, 0.75s"
          >Kalurahan Bimomartani</span>
        </h1>
        <p class="mt-2 text-[15px] sm:text-base font-semibold text-secondary-200 uppercase tracking-wide">
          Sistem Informasi Kalurahan Bimomartani
        </p>

        <p class="mt-4 text-[15.5px] sm:text-[17px] leading-relaxed text-secondary-200">
          Mewujudkan tata kelola kalurahan yang transparan, inovatif, dan responsif melalui layanan
          digital yang mudah diakses oleh seluruh warga.
        </p>

        <form
  @submit.prevent="handleSearch"
  class="mt-6 sm:mt-7 flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 p-1 w-full max-w-[560px] focus-within:border-white/50 focus-within:bg-white/15 transition-colors"
>
  <i class="pi pi-search text-white/70 text-base pl-3.5 shrink-0" />
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Cari layanan, berita..."
    class="flex-1 min-w-0 bg-transparent text-[14px] text-white placeholder:text-white/60 focus:outline-none py-1.5"
  />
  <button
    type="submit"
    class="shrink-0 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-[13px] font-bold px-4 sm:px-5 py-2"
  >
    Cari
  </button>
</form>
      </div>
    </section>

    <!-- ============ QUICK ACCESS ============
         Sebelumnya semua kartu memakai gradient primary-800/900 yang sama
         persis, jadi datar. Sekarang tiap kartu punya warna sendiri
         (sky/rose/amber/violet) mengikuti pola colorPalette. -->
    <section v-reveal class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
  <component
    :is="card.route ? RouterLink : 'div'"
    v-for="(card, i) in quickAccess"
    :key="card.title"
    :to="card.route"
    class="group relative overflow-hidden flex flex-col items-center text-center rounded-2xl border bg-surface p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    :class="colorAt(i).border"
  >
    <div
      class="pointer-events-none absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-70 group-hover:scale-125 transition-transform duration-500"
      :class="colorAt(i).iconBg"
    />
    <div
      class="relative w-11 h-11 rounded-xl text-white flex items-center justify-center mb-3.5 shadow-sm group-hover:scale-110 transition-all duration-300 bg-gradient-to-br"
      :class="colorAt(i).gradient"
    >
      <i :class="card.icon" class="pi text-[18px]" />
    </div>
    <h3 class="relative font-heading font-extrabold text-[14.5px] sm:text-[15px] text-heading m-0">{{ card.title }}</h3>
    <p class="relative text-[12px] sm:text-[12.5px] text-muted mt-1 leading-snug">{{ card.desc }}</p>
  </component>
</section>

    <!-- ============ BERITA + AGENDA ============ -->
    <section v-reveal class="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      <!-- Berita Desa -->
      <div class="lg:col-span-2 flex flex-col">
        <div class="flex items-end justify-between mb-1">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-secondary-600">
              Informasi Terkini
            </span>
            <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Berita Kalurahan</h2>
          </div>
          <RouterLink
            :to="{ name: 'news' }"
            class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
          >
            Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
          </RouterLink>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mt-4 flex-1">
          <RouterLink
            v-for="item in newsDummy"
            :key="item.slug"
            :to="{ name: 'news-detail', params: { slug: item.slug } }"
            class="relative flex flex-col h-full rounded-2xl border bg-surface overflow-hidden hover:shadow-md transition-all"
            :class="colorForNewsCategory(item.category).border"
          >
            <span class="absolute inset-x-0 top-0 z-10 h-1" :class="colorForNewsCategory(item.category).topBar" />

            <div class="relative aspect-[16/10] bg-primary-50 flex items-center justify-center overflow-hidden">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover"
                loading="lazy"
                @error="handleImgError"
              />
              <i v-else class="pi pi-image text-2xl text-primary-200" />
            </div>
            <div class="p-4 flex flex-col flex-1">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold self-start"
                :class="colorForNewsCategory(item.category).badge"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="colorForNewsCategory(item.category).dot" />
                {{ item.category }}
              </span>
              <h3 class="font-heading font-extrabold text-[14px] text-heading mt-2.5 leading-snug line-clamp-2">
                {{ item.title }}
              </h3>
              <p class="text-[12px] text-muted mt-1.5 leading-relaxed flex-1">
                {{ truncateExcerpt(item.excerpt) }}
              </p>
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-border-default">
                <div class="flex items-center gap-1.5 text-[11.5px] text-muted">
                  <i class="pi pi-calendar text-[10px]" />
                  {{ item.date }}
                </div>
                <i class="pi pi-arrow-right text-[11px] text-muted" />
              </div>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Agenda Desa Terkini: badge tanggal tiap item warnanya bergilir -->
      <div class="flex flex-col">
        <div class="mb-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-secondary-600">
            Jadwal Kegiatan
          </span>
          <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Agenda Kalurahan</h2>
        </div>

        <div class="mt-4 flex-1 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-800 p-4">
          <div
            v-for="(item, i) in agendaDummy"
            :key="item.title"
            class="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3 hover:bg-white/10 transition-colors flex-1"
          >
            <div
              class="shrink-0 w-11 rounded-lg text-white text-center py-1.5 leading-tight bg-gradient-to-br"
              :class="colorAt(i).gradient"
            >
              <div class="text-[9.5px] font-bold uppercase tracking-wide text-white/80">
                {{ item.month }}
              </div>
              <div class="text-[15px] font-extrabold">{{ item.day }}</div>
            </div>
            <div class="min-w-0">
              <p class="text-[13px] font-bold text-white leading-snug">{{ item.title }}</p>
              <p class="text-[11.5px] text-white/75 mt-1 flex items-center gap-1">
                <i class="pi pi-clock text-[10px]" />
                {{ item.time }}
              </p>
            </div>
          </div>

          <RouterLink
            :to="{ name: 'events' }"
            class="flex items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] font-bold text-primary-700 hover:text-primary-800 py-2.5 shadow-sm hover:shadow transition-shadow"
          >
            Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ============ ADUAN MASYARAKAT ============
         Tambahkan border kiri berwarna + avatar berwarna sesuai severity,
         supaya status aduan langsung kebaca lewat warna, bukan cuma Tag. -->
    <section v-reveal>
      <div class="flex items-end justify-between mb-4">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Aduan Masyarakat</h2>
      </div>

      <div class="rounded-2xl border border-border-default bg-surface divide-y divide-border-default overflow-hidden">
        <div
          v-for="item in complaintsDummy"
          :key="item.title"
          class="flex items-center gap-3.5 p-4 sm:p-5 border-l-4"
          :class="colorForSeverity(item.severity).border.split(' ')[0]"
        >
          <div
            class="shrink-0 w-10 h-10 rounded-full font-bold text-[12.5px] flex items-center justify-center"
            :class="[colorForSeverity(item.severity).iconBg, colorForSeverity(item.severity).iconText]"
          >
            {{ item.initials }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[13.5px] sm:text-[14px] font-bold text-heading truncate">{{ item.title }}</p>
            <p class="text-[12px] text-muted mt-0.5">Dilaporkan oleh {{ item.reporter }}</p>
          </div>
          <div class="hidden sm:block text-[12px] text-muted shrink-0">{{ item.date }}</div>
          <Tag :value="item.status" :severity="item.severity" class="!text-[10.5px] !font-bold shrink-0" />
        </div>
      </div>
    </section>

    <!-- ============ POTENSI DESA ============ -->
    <section v-reveal>
      <div class="flex items-end justify-between mb-4">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Potensi Kalurahan</h2>
        <RouterLink
          :to="{ name: 'potential' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <RouterLink
          v-for="item in potentialDummy"
          :key="item.title"
          :to="{ name: 'potential' }"
          class="group relative overflow-hidden rounded-2xl border border-border-default bg-surface p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div
            :class="[item.bg, item.ring]"
            class="pointer-events-none absolute -right-6 -top-6 w-20 h-20 rounded-full ring-8 opacity-70 group-hover:scale-125 transition-transform duration-500"
          />
          <div
            :class="[item.bg, item.text]"
            class="relative w-11 h-11 rounded-2xl flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300"
          >
            <i :class="item.icon" class="pi text-[18px]" />
          </div>
          <h3 class="relative font-heading font-extrabold text-[14.5px] sm:text-[15px] text-heading m-0">{{ item.title }}</h3>
          <p class="relative text-[12px] sm:text-[12.5px] text-muted mt-1 leading-snug">{{ item.desc }}</p>
        </RouterLink>
      </div>
    </section>

   <!-- ============ STRUKTUR ORGANISASI ============ -->
<section v-reveal class="flex flex-col gap-6">
  <div class="flex items-end justify-between mb-1">
    <div>
      <span class="text-[11px] font-bold uppercase tracking-wider text-secondary-600">
        Kepemimpinan &amp; Organisasi
      </span>
      <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">
        Pamong Kalurahan Bimomartani
      </h2>
    </div>
    <RouterLink
      :to="{ name: 'profile' }"
      class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
    >
      Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
    </RouterLink>
  </div>

      <!-- Kartu Lurah: gradient dasar tetap primary, blob dibuat dua warna
           (bukan putih polos) agar tetap selaras dengan palet section lain -->
      <div
        class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 to-primary-800 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 lg:gap-10"
      >
        <div class="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-sky-400/15 blur-2xl" />
        <div class="pointer-events-none absolute -left-10 bottom-[-3rem] w-48 h-48 rounded-full bg-violet-400/15 blur-2xl" />

        <div
          class="relative shrink-0 w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="pamongFotoSrc(lurah)"
            :src="pamongFotoSrc(lurah)"
            :alt="lurah.nama"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex flex-col items-center justify-center gap-2">
            <i class="pi pi-user text-4xl sm:text-5xl text-white/50" />
            <span class="text-2xl sm:text-3xl font-heading font-extrabold text-white/80">
              {{ getInitials(lurah.nama) }}
            </span>
          </div>
        </div>

        <div class="relative text-center sm:text-left">
          <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-secondary-300 mb-1.5">
            {{ lurah.jabatan }}
          </span>
          <h3 class="font-heading font-extrabold text-xl sm:text-2xl lg:text-[28px] text-white m-0">
            {{ lurah.nama }}
          </h3>
          <p class="mt-3 text-[13.5px] sm:text-[15px] text-white/75 leading-relaxed max-w-[520px]">
            {{ lurah.desc }}
          </p>
        </div>
      </div>

      <!-- Carousel pamong & staf: tiap kartu punya top bar warna bergilir -->
      <div class="relative">
        <button
          type="button"
          aria-label="Sebelumnya"
          @click="scrollOrgManual(-1)"
          class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface border border-border-default shadow-sm items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <i class="pi pi-chevron-left text-[13px]" />
        </button>

        <div
          ref="orgTrackRef"
          class="flex gap-3.5 overflow-x-auto scroll-smooth snap-x snap-proximity pb-1.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          @mouseenter="pauseOrgAutoplay"
          @mouseleave="resumeOrgAutoplay"
          @touchstart="pauseOrgAutoplay"
          @touchend="resumeOrgAutoplay"
          @focusin="pauseOrgAutoplay"
          @focusout="resumeOrgAutoplay"
        >
          <div
            v-for="(item, i) in pamongList"
            :key="item.nama"
            class="relative snap-start shrink-0 w-[220px] sm:w-[248px] rounded-2xl border bg-surface p-4 flex flex-col hover:shadow-md transition-all overflow-hidden"
            :class="colorAt(i).border"
          >
            <span class="absolute inset-x-0 top-0 h-1" :class="colorAt(i).topBar" />

            <div
              class="w-full aspect-[4/3] rounded-xl flex items-center justify-center overflow-hidden mb-3.5"
              :class="[colorAt(i).iconBg, colorAt(i).iconText]"
            >
              <img
                v-if="pamongFotoSrc(item)"
                :src="pamongFotoSrc(item)"
                :alt="item.nama"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center justify-center gap-1.5">
                <i class="pi pi-user text-3xl" />
                <span class="text-lg font-heading font-extrabold">
                  {{ getInitials(item.nama) }}
                </span>
              </div>
            </div>

            <p class="text-[13.5px] font-bold text-heading leading-snug line-clamp-2">
              {{ item.nama }}
            </p>
            <p class="text-[11px] font-bold mt-1 uppercase tracking-wide leading-snug" :class="colorAt(i).iconText">
              {{ item.jabatan }}
            </p>
            <p class="text-[11.5px] text-muted mt-1.5 leading-relaxed line-clamp-3">
              {{ item.desc }}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Berikutnya"
          @click="scrollOrgManual(1)"
          class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface border border-border-default shadow-sm items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <i class="pi pi-chevron-right text-[13px]" />
        </button>
      </div>
    </section>

    <!-- ============ GALERI ============ -->
    <section v-reveal>
      <div class="flex items-end justify-between mb-6">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Galeri Bimomartani</h2>
        <RouterLink
          :to="{ name: 'gallery' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 auto-rows-[90px] sm:auto-rows-[110px] lg:auto-rows-[240px]">
        <RouterLink
          v-for="(item, i) in galleryDummy"
          :key="i"
          :to="{ name: 'gallery' }"
          :class="i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'"
          class="group relative rounded-xl sm:rounded-2xl bg-primary-50 border border-border-default flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.caption || 'Galeri Bimomartani'"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            @error="handleImgError"
          />
          <i v-else class="pi pi-image text-2xl text-primary-200" />

          <!-- overlay caption berwarna bergilir, muncul saat hover -->
          <div
            class="absolute inset-0 flex flex-col justify-end p-2.5 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span
              class="self-start rounded-full px-2 py-0.5 text-[9.5px] font-bold text-white mb-1"
              :class="colorAt(i).gradient.replace('to-', 'to-').concat(' bg-gradient-to-r')"
            >
              {{ item.caption }}
            </span>
          </div>

          <div class="absolute inset-0 flex items-end justify-end p-2.5">
            <i class="pi pi-search-plus text-white text-[13px] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>