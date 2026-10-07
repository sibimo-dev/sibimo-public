<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  fetchHomeData,
  readHomeCache,
  writeHomeCache,
} from "@/services/home.service";
import { RouterLink, useRouter } from "vue-router";
import Tag from "primevue/tag";
import AnimateOnScroll from "primevue/animateonscroll";
import heroImage from "@/assets/hero/hero1.jpeg";
import SubmissionCheckForm from "@/components/shared/SubmissionCheckForm.vue";

/* Direktif PrimeVue AnimateOnScroll (modifier .once = animasi hanya jalan sekali) */
const vAnimateonscroll = AnimateOnScroll;

const presets = Object.fromEntries(
  ["up", "down", "left", "right", "zoom", "pop"].map((kind) => [
    kind,
    { enterClass: `anim-${kind}`, threshold: 0.1 },
  ]),
);

function appear(kind = "up") {
  return presets[kind] || presets.up;
}

const router = useRouter();
const newsList = ref([]);
const agendaList = ref([]);
const potentialList = ref([]);
const galleryList = ref([]);
const complaintsList = ref([]);
const lurah = ref(null);
const pamongList = ref([]);
const homeLoading = ref(true);

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
    router.push({ name: "profile", hash: "#wilayah" });
  } else if (/potensi|bumdes|usaha desa|umkm|wisata|pariwisata|pertanian/.test(q)) {
    router.push({ name: "potential" });
  } else if (/agenda|kegiatan|jadwal/.test(q)) {
    router.push({ name: "events" });
  } else if (/produk hukum|hukum|perkal|peraturan|sk kades|keputusan/.test(q)) {
    router.push({ name: "legal-products" });
  } else if (/pembangunan|proyek|infrastruktur/.test(q)) {
    router.push({ name: "development" });
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
  Kesehatan: colorPalette[0],
  Sosial: colorPalette[1],
  Pembangunan: colorPalette[2],
  Budaya: colorPalette[3],
  Pemerintahan: colorPalette[5],
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

/* Ikon menu cepat (SVG filled, digabung di sini) */
const quickMenuIcons = {
  surat: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
  aduan: '<path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"/>',
  profil: '<path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1L2 6v2h19V6l-9.5-5z"/>',
  potensi: '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>',
  statistik: '<path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>',
  hukum: '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>',
  pembangunan: '<path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>',
  galeri: '<path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z"/>',
};

const quickAccess = [
  { icon: "surat", title: "Layanan Mandiri", route: { name: "services" } },
  { icon: "aduan", title: "Pengaduan", route: { name: "complaints" } },
  { icon: "profil", title: "Profil Kalurahan", route: { name: "profile" } },
  { icon: "potensi", title: "Potensi Kalurahan", route: { name: "potential" } },
  { icon: "statistik", title: "Statistik", route: { name: "data" } },
  { icon: "hukum", title: "Produk Hukum", route: { name: "legal-products" } },
  { icon: "pembangunan", title: "Pembangunan", route: { name: "development" } },
  { icon: "galeri", title: "Galeri", route: { name: "gallery" } },
];

/* Langkah singkat untuk kartu Cek Pengajuan */
const documentSteps = [
  { icon: "pi-id-card", title: "Masukkan NIK", desc: "16 digit NIK sesuai yang dipakai saat mengajukan surat." },
  { icon: "pi-ticket", title: "Isi ID Pengajuan", desc: "Kode ada di bukti pengajuan, contoh: REQ-20260930-001." },
  { icon: "pi-download", title: "Lihat status & unduh", desc: "Cek status surat, lalu pratinjau atau unduh PDF yang sudah disetujui." },
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

/* ============ DATA HOME DARI API ============ */

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

function pamongFotoSrc(item) {
  return item?.photo || null;
}

function applyHomeData(data) {
  if (Object.prototype.hasOwnProperty.call(data, "news")) newsList.value = data.news ?? [];
  if (Object.prototype.hasOwnProperty.call(data, "agendas")) agendaList.value = data.agendas ?? [];
  if (Object.prototype.hasOwnProperty.call(data, "potentials")) potentialList.value = data.potentials ?? [];
  if (Object.prototype.hasOwnProperty.call(data, "galleries")) galleryList.value = data.galleries ?? [];
  if (Object.prototype.hasOwnProperty.call(data, "complaints")) complaintsList.value = data.complaints ?? [];
  if (data.organization) {
    lurah.value = data.organization.lurah ?? null;
    pamongList.value = data.organization.pamong ?? [];
  }
}

async function loadHome() {
  const cached = readHomeCache();
  if (cached) applyHomeData(cached);

  try {
    const fresh = await fetchHomeData();
    applyHomeData(fresh.data);

    if (Object.keys(fresh.data).length) {
      writeHomeCache({ ...(cached || {}), ...fresh.data });
    }
  } catch (error) {
    console.error("Gagal memuat data Home:", error);
  } finally {
    homeLoading.value = false;
  }
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

/* Galeri beranda: geser manual (swipe / tombol), tanpa autoplay */
const galleryTrackRef = ref(null);

function scrollGallery(direction) {
  const track = galleryTrackRef.value;
  const firstCard = track?.children?.[0];
  if (!track || !firstCard) return;
  const gap = parseFloat(getComputedStyle(track).columnGap || "0");
  track.scrollBy({ left: direction * (firstCard.getBoundingClientRect().width + gap), behavior: "smooth" });
}

onMounted(() => {
  void loadHome();
});

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
  <div>
    <!-- ============ HERO (full-width, 1 foto statis) ============ -->
    <section
      class="relative isolate overflow-hidden flex flex-col items-center justify-center text-center text-white px-6 pt-16 pb-36 sm:pt-20 sm:pb-40 lg:pt-28 lg:pb-48 min-h-[460px] sm:min-h-[520px] lg:min-h-[600px]"
    >
      <!-- Foto dibuat sedikit blur supaya tulisan papan di foto tidak
           bertabrakan dengan teks hero -->
      <img
        :src="heroImage"
        alt="Kalurahan Bimomartani"
        class="absolute inset-0 -z-30 h-full w-full object-cover scale-105 blur-[3px]"
      />
      <!-- Overlay gelap merata -->
      <div class="absolute inset-0 -z-20 bg-gradient-to-b from-primary-900/80 via-primary-900/70 to-primary-900/90" />
      <!-- Vignette gelap di tengah, tepat di belakang blok teks -->
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(6,16,32,0.65)_0%,rgba(6,16,32,0.35)_45%,transparent_75%)]" />

      <div class="relative max-w-[720px] mx-auto flex flex-col items-center">
        <!-- Badge "Selamat Datang Di": layout pill mengikuti lebar tulisan -->
        <span
          class="hero-in hero-in-down inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11.5px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-secondary-300 backdrop-blur-md shadow-lg shadow-black/20 mb-5"
          style="--i: 0"
        >
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-300 opacity-70 motion-reduce:animate-none" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-secondary-300" />
          </span>
          Selamat Datang Di
        </span>

        <h1 class="font-heading font-extrabold uppercase whitespace-nowrap text-[20px] xs:text-[24px] sm:text-[38px] lg:text-[50px] leading-[1.15] tracking-tight text-white m-0 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
          <span
            class="inline-block align-bottom overflow-hidden whitespace-nowrap border-r-4 border-sky-300 animate-hero-typing motion-reduce:animate-none motion-reduce:border-r-0"
            style="animation-duration: 8.5s, 0.75s"
          >Kalurahan Bimomartani</span>
        </h1>
        <p
          class="hero-in mt-3 text-[15px] sm:text-base font-bold text-secondary-200 uppercase tracking-wide [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]"
          style="--i: 1"
        >
          Sistem Informasi Kalurahan Bimomartani
        </p>

        <p
          class="hero-in mt-4 text-[15.5px] sm:text-[17px] font-medium leading-relaxed text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]"
          style="--i: 2"
        >
          Mewujudkan tata kelola kalurahan yang transparan, inovatif, dan responsif melalui layanan
          digital yang mudah diakses oleh seluruh warga.
        </p>

        <form
          @submit.prevent="handleSearch"
          class="hero-in mt-6 sm:mt-7 flex items-center gap-2 rounded-full bg-black/25 backdrop-blur-md border border-white/30 p-1 w-full max-w-[560px] shadow-lg shadow-black/20 focus-within:border-white/60 focus-within:bg-black/30 transition-colors"
          style="--i: 3"
        >
          <i class="pi pi-search text-white/80 text-base pl-3.5 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari layanan, berita..."
            class="flex-1 min-w-0 bg-transparent text-[14px] text-white placeholder:text-white/70 focus:outline-none py-1.5"
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

    <!-- ============ MENU CEPAT: 1 kartu, separuh menimpa hero ============ -->
    <div class="relative z-10 -mt-24 sm:-mt-16 max-w-[1350px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
      <nav
        aria-label="Menu cepat"
        class="relative isolate grid grid-cols-4 gap-y-5 overflow-hidden rounded-2xl border border-border-default bg-surface px-3 py-5 shadow-xl sm:px-6 sm:py-6 lg:grid-cols-8"
      >
        <!-- Hiasan kartu: blob biru lembut di sudut, wash gradasi tipis,
             dan pola titik halus di sisi kanan atas -->
        <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-primary-50/80" aria-hidden="true" />
        <div class="pointer-events-none absolute -right-10 -top-12 -z-10 h-40 w-40 rounded-full bg-primary-100/80 blur-2xl" aria-hidden="true" />
        <div class="pointer-events-none absolute -bottom-14 -left-10 -z-10 h-40 w-40 rounded-full bg-sky-200/50 blur-2xl" aria-hidden="true" />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/3 opacity-70 sm:block [background-image:radial-gradient(rgba(30,58,95,0.12)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_left,black,transparent)]"
          aria-hidden="true"
        />
        <component
          :is="card.route ? RouterLink : 'div'"
          v-for="(card, i) in quickAccess"
          :key="card.title"
          :to="card.route"
          class="group flex flex-col items-center gap-3 text-center"
          v-animateonscroll.once="appear('pop')" :style="{ '--i': i }"
        >
          <span
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-900 to-primary-800 text-white shadow-md shadow-primary-900/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-[62px] sm:w-[62px]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" v-html="quickMenuIcons[card.icon]" />
          </span>
          <span class="text-[11.5px] font-medium leading-tight text-default sm:text-[13px]">{{ card.title }}</span>
        </component>
      </nav>
    </div>

    <!-- ============ ISI HALAMAN ============ -->
    <div class="max-w-[1350px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-8 lg:py-10 flex flex-col gap-10">

    <!-- ============ CEK PENGAJUAN ============ -->
    <section class="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <!-- Penjelasan fungsi Cek Pengajuan (kanan di desktop) -->
      <div v-animateonscroll.once="appear('right')" style="--i: 1" class="relative lg:order-2">
        <div class="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary-100/70 blur-2xl"></div>
        <div class="pointer-events-none absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-primary-50 blur-2xl"></div>
        <i class="pi pi-file-pdf pointer-events-none absolute -top-4 right-2 text-[88px] text-primary-100 rotate-12 hidden sm:block"></i>

        <div class="relative">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-100 px-3 py-1 text-[11.5px] font-bold text-primary-800">
            <i class="pi pi-download text-[11px]" />
            Layanan Digital
          </span>
          <h2 class="font-heading font-extrabold text-2xl sm:text-3xl text-heading mt-3 mb-2">Cek Pengajuan Surat</h2>
          <p class="text-[14px] sm:text-[15px] text-muted leading-relaxed max-w-md">
            Pantau status pengajuan suratmu, apakah sudah diverifikasi, siap diunduh, atau ditolak, lalu lihat dan unduh PDF-nya tanpa perlu datang ke kantor kalurahan.
          </p>

          <ol class="mt-6 flex flex-col gap-4 m-0 p-0 list-none">
            <li v-for="(step, i) in documentSteps" :key="step.title" class="flex items-start gap-3.5">
              <div class="shrink-0 w-10 h-10 rounded-xl bg-primary-800 text-white flex items-center justify-center shadow-sm">
                <i :class="step.icon" class="pi text-[15px]" />
              </div>
              <div class="min-w-0">
                <h3 class="font-heading font-bold text-[14px] text-heading m-0">
                  <span class="text-primary-600 mr-1">{{ i + 1 }}.</span>{{ step.title }}
                </h3>
                <p class="text-[12.5px] text-muted mt-0.5 leading-snug">{{ step.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <!-- Form cek pengajuan (kiri di desktop) -->
      <div v-animateonscroll.once="appear('left')" style="--i: 0" class="w-full lg:order-1">
        <SubmissionCheckForm class="w-full lg:[&>div]:mx-0 lg:[&>div]:mr-auto" />
      </div>
    </section>

    <!-- ============ BERITA + AGENDA ============ -->
    <section class="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
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

        <div v-if="newsList.length" class="grid sm:grid-cols-2 gap-4 mt-4 flex-1">
          <RouterLink
            v-for="(item, idx) in newsList"
            :key="item.slug"
            :to="{ name: 'news-detail', params: { slug: item.slug } }"
            class="relative flex flex-col h-full rounded-2xl border bg-surface overflow-hidden hover:shadow-md transition-all"
            :class="colorForNewsCategory(item.category).border"
            v-animateonscroll.once="appear('zoom')" :style="{ '--i': idx }"
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
        <div v-else class="mt-4 flex-1 rounded-2xl border border-border-default bg-surface p-6 text-center text-muted">
          <i class="pi pi-inbox text-2xl text-primary-200" />
          <p class="mt-2 text-[13px]">{{ homeLoading ? "Memuat berita..." : "Belum ada berita." }}</p>
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
            v-for="(item, i) in agendaList"
            :key="item.key"
            class="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3 hover:bg-white/10 transition-colors flex-1"
            v-animateonscroll.once="appear('right')" :style="{ '--i': i + 1 }"
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
          <div v-if="!agendaList.length" class="rounded-xl border border-white/15 bg-white/5 p-5 text-center text-[13px] text-white/75">
            {{ homeLoading ? "Memuat agenda..." : "Belum ada agenda mendatang." }}
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

    <!-- ============ ADUAN MASYARAKAT ============ -->
    <section v-animateonscroll.once="appear('up')">

      <div class="flex items-end justify-between mb-4">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Aduan Masyarakat</h2>
        <RouterLink
          :to="{ name: 'complaints' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div class="rounded-2xl border border-border-default bg-surface divide-y divide-border-default overflow-hidden">
        <div
          v-for="item in complaintsList"
          :key="item.complaint_id ?? item.title"
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

        <div v-if="!complaintsList.length" class="p-6 text-center text-[13px] text-muted">
          Belum ada aduan yang dapat ditampilkan.
        </div>
      </div>
    </section>

    <!-- ============ POTENSI DESA ============ -->
    <section>
      <div class="flex items-end justify-between mb-4">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Potensi Kalurahan</h2>
        <RouterLink
          :to="{ name: 'potential' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div v-if="potentialList.length" class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <RouterLink
          v-for="(item, idx) in potentialList"
          :key="item.title"
          :to="{ name: 'potential' }"
          class="group relative overflow-hidden rounded-2xl border border-border-default bg-surface p-4 sm:p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          v-animateonscroll.once="appear('zoom')" :style="{ '--i': idx }"
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
      <div v-else class="rounded-2xl border border-border-default bg-surface p-6 text-center text-[13px] text-muted">
        {{ homeLoading ? "Memuat data potensi..." : "Belum ada data potensi." }}
      </div>
    </section>

   <!-- ============ STRUKTUR ORGANISASI ============ -->
<section class="flex flex-col gap-6">
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
        v-animateonscroll.once="appear('zoom')" style="--i: 0"
      >
        <div class="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-sky-400/15 blur-2xl" />
        <div class="pointer-events-none absolute -left-10 bottom-[-3rem] w-48 h-48 rounded-full bg-violet-400/15 blur-2xl" />

        
        <div
          class="relative shrink-0 w-50 aspect-[5/6] sm:w-72 lg:w-80 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="pamongFotoSrc(lurah)"
            :src="pamongFotoSrc(lurah)"
            :alt="lurah?.nama || 'Lurah'"
            class="w-full h-full object-cover object-[center_75%]"
          />
          <div v-else class="flex flex-col items-center justify-center gap-2">
            <i class="pi pi-user text-4xl sm:text-5xl text-white/50" />
            <span class="text-2xl sm:text-3xl font-heading font-extrabold text-white/80">
              {{ getInitials(lurah?.nama || "Lurah") }}
            </span>
          </div>
        </div>

        <div class="relative text-center sm:text-left">
          <span class="inline-block text-[11px] font-bold uppercase tracking-wider text-secondary-300 mb-1.5">
            {{ lurah?.jabatan || "Data Lurah belum tersedia" }}
          </span>
          <h3 class="font-heading font-extrabold text-xl sm:text-2xl lg:text-[28px] text-white m-0">
            {{ lurah?.nama || "Data Lurah belum tersedia" }}
          </h3>
          <p class="mt-3 text-[13.5px] sm:text-[15px] text-white/75 leading-relaxed max-w-[520px]">
            {{ lurah?.desc || "Data struktur organisasi belum tersedia." }}
          </p>

          <!-- Info tambahan: lokasi & jabatan sebagai pill, tempat yang
               sama bisa dipakai nanti untuk kontak / tautan sosial media
               Lurah bila datanya sudah tersedia. -->
          <div class="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Tag
              icon="pi pi-map-marker"
              value="Kalurahan Bimomartani"
              class="!rounded-full !border-none !bg-white/10 !text-[11px] !font-semibold !text-white"
            />
            <Tag
              icon="pi pi-verified"
              value="Lurah"
              class="!rounded-full !border-none !bg-white/10 !text-[11px] !font-semibold !text-white"
            />
          </div>
        </div>
      </div>

      <!-- Carousel pamong & staf: tiap kartu punya top bar warna bergilir -->
      <div class="relative" v-animateonscroll.once="appear('up')" style="--i: 1">
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
            class="relative snap-start shrink-0 w-50 sm:w-54 rounded-2xl border bg-surface p-4 flex flex-col hover:shadow-md transition-all overflow-hidden"
            :class="colorAt(i).border"
          >
            <span class="absolute inset-x-0 top-0 h-1" :class="colorAt(i).topBar" />

            <!-- Foto pamong: ukuran & rasio disamakan dengan kartu Dukuh
                 di halaman Profil (aspect-square) — object-cover supaya
                 penuh tanpa ruang kosong. -->
            <div
              class="w-full aspect-square rounded-xl flex items-center justify-center overflow-hidden mb-3.5"
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
          <div v-if="!pamongList.length" class="rounded-2xl border border-border-default bg-surface p-6 text-center text-[13px] text-muted">
            Data pamong belum tersedia.
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
    <section v-animateonscroll.once="appear('up')">
      <div class="flex items-end justify-between mb-6">
        <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-heading m-0">Galeri Bimomartani</h2>
        <RouterLink
          :to="{ name: 'gallery' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div v-if="galleryList.length" class="relative">
        <button
          type="button"
          aria-label="Foto sebelumnya"
          @click="scrollGallery(-1)"
          class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface border border-border-default shadow-sm items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <i class="pi pi-chevron-left text-[13px]" />
        </button>

        <div
          ref="galleryTrackRef"
          class="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <RouterLink
            v-for="(item, i) in galleryList"
            :key="item.image || i"
            :to="{ name: 'gallery' }"
            class="group relative snap-start shrink-0 w-[82%] sm:w-[46%] lg:w-[32%] aspect-[4/3] rounded-xl sm:rounded-2xl bg-primary-50 border border-border-default flex items-center justify-center overflow-hidden"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.caption || 'Galeri Bimomartani'"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              draggable="false"
              @error="handleImgError"
            />
            <i v-else class="pi pi-image text-2xl text-primary-200" />

            <!-- caption selalu tampil (di layar sentuh tidak ada hover) -->
            <div
              v-if="item.caption"
              class="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 pt-10 bg-gradient-to-t from-black/65 via-black/25 to-transparent"
            >
              <span
                class="self-start max-w-full rounded-full px-2.5 py-0.5 text-[10.5px] font-bold text-white truncate bg-gradient-to-r"
                :class="colorAt(i).gradient"
              >
                {{ item.caption }}
              </span>
            </div>
          </RouterLink>
        </div>

        <button
          type="button"
          aria-label="Foto berikutnya"
          @click="scrollGallery(1)"
          class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-surface border border-border-default shadow-sm items-center justify-center text-primary-700 hover:bg-primary-50 transition-colors"
        >
          <i class="pi pi-chevron-right text-[13px]" />
        </button>
      </div>
      <div v-else class="rounded-2xl border border-border-default bg-primary-50 p-8 text-center text-[13px] text-muted">
        <i class="pi pi-images text-2xl text-primary-200" />
        <p class="mt-2">{{ homeLoading ? "Memuat galeri..." : "Belum ada foto galeri." }}</p>
      </div>
    </section>
    </div>
  </div>
</template>

<style>
/* ============ ANIMASI SCROLL (dipakai v-animateonscroll PrimeVue) ============
   Satu keyframe, arah gerak ditentukan lewat variabel (--x, --y, --s).
   700ms + easing lembut: tidak terlalu cepat, tidak terlalu lambat.
   "backwards" menahan elemen tetap tersembunyi selama menunggu jeda dan
   tidak mengunci transform setelah selesai (hover kartu tetap jalan).
   Jeda antar elemen = urutan (--i) x 90ms. */
@keyframes home-in {
  from {
    opacity: 0;
    transform: translate3d(var(--x, 0), var(--y, 0), 0) scale(var(--s, 1));
  }
}

.anim-up,
.anim-down,
.anim-left,
.anim-right,
.anim-zoom,
.anim-pop {
  animation: home-in 700ms cubic-bezier(0.22, 0.61, 0.36, 1) backwards;
  animation-delay: calc(min(var(--i, 0), 6) * 90ms);
}

/* Hero: selalu terlihat, animasi jalan sekali saat halaman dibuka
   (tidak bergantung pada scroll, jadi tidak mungkin tersembunyi) */
.hero-in {
  --y: 24px;
  animation: home-in 800ms cubic-bezier(0.22, 0.61, 0.36, 1) backwards;
  animation-delay: calc(var(--i, 0) * 120ms);
}
.hero-in-down { --y: -20px; }

.anim-up { --y: 32px; }
.anim-down { --y: -24px; }
.anim-left { --x: -40px; }
.anim-right { --x: 40px; }
.anim-zoom { --s: 0.92; --y: 16px; }
.anim-pop {
  --s: 0.5;
  animation-duration: 600ms;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-reduced-motion: reduce) {
  .anim-up,
  .anim-down,
  .anim-left,
  .anim-right,
  .anim-zoom,
  .anim-pop,
  .hero-in {
    animation: none !important;
  }
}
</style>