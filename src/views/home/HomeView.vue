<script setup>

import { ref } from "vue";
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

const quickAccess = [
  {
    icon: "pi-file",
    title: "Layanan Surat",
    desc: "Pengajuan berbagai jenis surat ke desa.",
    route: { name: "services" },
    accent: "bg-primary-800 group-hover:bg-primary-700",
  },
  {
    icon: "pi-megaphone",
    title: "Pengaduan",
    desc: "Sampaikan aspirasi atau laporan kejadian di lingkungan.",
    route: { name: "complaints" },
    accent: "bg-rose-600 group-hover:bg-rose-500",
  },
  {
    icon: "pi-map",
    title: "Data Wilayah",
    desc: "Peta dan data administratif dusun, RT, dan RW.",
    route: { name: "region" },
    accent: "bg-emerald-600 group-hover:bg-emerald-500",
  },
  {
    icon: "pi-building-columns",
    title: "BUMDes",
    desc: "Badan usaha milik desa untuk kesejahteraan warga.",
    route: { name: "bumdes" },
    accent: "bg-amber-600 group-hover:bg-amber-500",
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

// Dummy — ganti ke events.service.js begitu modul Agenda siap
const agendaDummy = [
  { day: "15", month: "OKT", title: "Penyaluran BLT Tahap III", time: "08:00 - Selesai" },
  { day: "20", month: "OKT", title: "Kerja Bakti Rutin Lingkungan", time: "07:00 - 10:00" },
  { day: "24", month: "OKT", title: "Sosialisasi GENRE", time: "08:00 - 10:00" },
  { day: "28", month: "OKT", title: "Posyandu Balita & Lansia", time: "08:30 - 11:00" },
  { day: "02", month: "NOV", title: "Musyawarah Desa Bulanan", time: "19:30 - Selesai" },
];

// Dummy — ganti ke complaint.service.js begitu modul Aduan siap
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

// Dummy — ganti ke potential.service.js begitu modul Potensi Desa siap.
// Tiap kategori dikasih warna ikon berbeda biar cardnya lebih variatif,
// bukan seragam biru semua seperti sebelumnya.
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
  { image: "/images/gallery/1.jpg", caption: "Kerja Bakti Dusun I" },
  { image: "/images/gallery/2.jpg", caption: "Posyandu Balita" },
  { image: "/images/gallery/3.jpg", caption: "Panen Raya Padi" },
  { image: "/images/gallery/4.jpg", caption: "Musyawarah Desa" },
  { image: "/images/gallery/5.jpg", caption: "Pelatihan UMKM" },
  { image: "/images/gallery/6.jpg", caption: "Peringatan HUT RI" },

  
];
</script>

<template>
  <div class="py-6 lg:py-8 flex flex-col gap-10 lg:gap-10">
    
    <section
      class="relative isolate overflow-hidden rounded-3xl px-6 pt-14 pb-10 sm:px-10 sm:pt-16 sm:pb-14 lg:px-14 lg:pt-20 lg:pb-16 min-h-[380px] sm:min-h-[440px] flex flex-col justify-center text-white"
    >
      <HeroCarousel />

      <div
        class="pointer-events-none absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10 blur-2xl"
      />
      <div
        class="pointer-events-none absolute -right-10 bottom-[-4rem] w-56 h-56 rounded-full bg-secondary-400/20 blur-2xl"
      />

      <div class="relative max-w-[620px]">
        <span
          class="inline-flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wider text-secondary-300 mb-4"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-secondary-300" />
          Portal Layanan Digital
        </span>

        <h1
          class="font-brand uppercase text-[26px] leading-[1.15] sm:text-4xl lg:text-[46px] tracking-tight"
          style="color: #fff"
        >
          Kalurahan Bimomartani
        </h1>
        <p class="mt-1.5 text-[13.5px] sm:text-[15px] font-semibold text-secondary-200 uppercase tracking-wide">
          Sistem Informasi Desa Bimomartani
        </p>

        <p class="mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-primary-100">
          Mewujudkan tata kelola desa yang transparan, inovatif, dan responsif melalui layanan
          digital yang mudah diakses oleh seluruh warga.
        </p>

        <!-- Search bar di dalam hero: kaca transparan + outline tipis -->
        <form
          @submit.prevent="handleSearch"
          class="mt-6 sm:mt-7 flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 p-1.5 sm:p-2 max-w-[480px] focus-within:border-white/50 focus-within:bg-white/15 transition-colors"
        >
          <i class="pi pi-search text-white/70 text-[15px] pl-2.5 shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari layanan surat, berita, atau informasi desa..."
            class="flex-1 min-w-0 bg-transparent text-[13.5px] sm:text-[14px] text-white placeholder:text-white/60 focus:outline-none py-2"
          />
          <button
            type="submit"
            class="shrink-0 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-[13px] font-bold px-4 sm:px-5 py-2.5"
          >
            Cari
          </button>
        </form>
      </div>
    </section>

    <!-- ============ QUICK ACCESS ============ -->
    <section v-reveal class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      <RouterLink
        v-for="card in quickAccess"
        :key="card.title"
        :to="card.route"
        class="group rounded-2xl border border-border-default bg-surface p-4 sm:p-5 hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div
          :class="card.accent"
          class="w-10 h-10 rounded-xl text-white flex items-center justify-center mb-3.5 group-hover:scale-110 transition-all duration-300"
        >
          <i :class="card.icon" class="pi text-[17px]" />
        </div>
        <h3 class="text-[14.5px] sm:text-[15px] font-bold text-heading">{{ card.title }}</h3>
        <p class="text-[12px] sm:text-[12.5px] text-muted mt-1 leading-snug">{{ card.desc }}</p>
      </RouterLink>
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
            <h2 class="text-xl sm:text-2xl font-extrabold text-heading">Berita Desa</h2>
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
            class="rounded-2xl border border-border-default bg-surface overflow-hidden hover:shadow-md hover:border-primary-300 transition-all"
          >
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
            <div class="p-4">
              <Tag :value="item.category" severity="info" class="!text-[10.5px] !font-bold !py-1" />
              <div class="flex items-center gap-1.5 text-[11.5px] text-muted mt-3">
                <i class="pi pi-calendar text-[10px]" />
                {{ item.date }}
              </div>
              <h3 class="text-[14px] font-bold text-heading mt-1.5 leading-snug line-clamp-2">
                {{ item.title }}
              </h3>
              <p class="text-[12px] text-muted mt-1.5 leading-relaxed line-clamp-2">
                {{ item.excerpt }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- Agenda Desa Terkini: background biru tua senada footer, teks putih -->
      <div class="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-800 p-5 flex flex-col">
        <h2 class="text-[15px] font-extrabold !text-white flex items-center gap-2 mb-20">
          <i class="pi pi-calendar text-secondary-300" />
          Agenda Desa Terkini
        </h2>

        <div class="flex flex-col gap-3 flex-1">
          <div
            v-for="item in agendaDummy"
            :key="item.title"
            class="flex items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-3 hover:bg-white/10 transition-colors"
          >
            <div
              class="shrink-0 w-11 rounded-lg bg-white/15 text-white text-center py-1.5 leading-tight"
            >
              <div class="text-[9.5px] font-bold uppercase tracking-wide text-secondary-300">
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
        </div>

        <RouterLink
          :to="{ name: 'events' }"
          class="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] font-bold !text-primary-800 py-2.5 hover:bg-primary-50 transition-colors"
        >
          Lihat Seluruh Agenda
        </RouterLink>
      </div>
    </section>

    <!-- ============ ADUAN MASYARAKAT ============ -->
    <section v-reveal>
      <div class="flex items-end justify-between mb-4">
        <h2 class="text-xl sm:text-2xl font-extrabold text-heading">Aduan Masyarakat</h2>
        <RouterLink
          :to="{ name: 'complaints' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div class="rounded-2xl border border-border-default bg-surface divide-y divide-border-default">
        <div
          v-for="item in complaintsDummy"
          :key="item.title"
          class="flex items-center gap-3.5 p-4 sm:p-5"
        >
          <div
            class="shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-800 font-bold text-[12.5px] flex items-center justify-center"
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
        <h2 class="text-xl sm:text-2xl font-extrabold text-heading">Potensi Desa</h2>
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
          <h3 class="relative text-[14.5px] sm:text-[15px] font-bold text-heading">{{ item.title }}</h3>
          <p class="relative text-[12px] sm:text-[12.5px] text-muted mt-1 leading-snug">{{ item.desc }}</p>
        </RouterLink>
      </div>
    </section>

    <!-- ============ GALERI ============ -->
    <!-- Layout bento (1 foto besar + sisanya kecil) sesuai wireframe.
         Tinggi baris dibatasi (auto-rows) biar tidak kebesaran. -->
    <section v-reveal>
      <div class="flex items-end justify-between mb-6">
        <h2 class="text-xl sm:text-2xl font-extrabold text-heading">Galeri Bimomartani</h2>
        <RouterLink
          :to="{ name: 'gallery' }"
          class="text-[13px] font-bold text-primary-700 hover:text-primary-800 shrink-0 flex items-center gap-1"
        >
          Lihat Semua <i class="pi pi-arrow-right text-[10px]" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5 auto-rows-[90px] sm:auto-rows-[110px] lg:auto-rows-[160px]">
        <RouterLink
          v-for="(item, i) in galleryDummy"
          :key="i"
          :to="{ name: 'gallery' }"
          :class="i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'"
          class="gallery-thumb relative rounded-xl sm:rounded-2xl bg-primary-50 border border-border-default flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.caption || 'Galeri Bimomartani'"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="handleImgError"
          />
          <i v-else class="gallery-thumb-placeholder pi pi-image text-2xl text-primary-200" />

          <div class="gallery-thumb-overlay absolute inset-0 flex items-end justify-end p-2.5">
            <i class="pi pi-search-plus text-white text-[13px]" />
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>