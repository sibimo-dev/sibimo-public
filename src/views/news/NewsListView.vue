<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import NewsCard from "@/components/shared/NewsCard.vue";
import {
  getAllNews,
  newsCategories,
  getCategoryClasses,
} from "@/services/news.js";

const allNews = getAllNews();

const pinnedNews = computed(() => allNews.find((item) => item.isPinned) || null);

const latestNews = computed(() =>
  [...allNews]
    .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO))
    .slice(0, 3)
);

const categoryOptions = ["Semua Kategori", ...newsCategories];
const activeCategory = ref("Semua Kategori");
const searchQuery = ref("");

const sortOptions = [
  { label: "Terbaru", value: "newest", icon: "pi pi-sort-amount-down" },
  { label: "Terlama", value: "oldest", icon: "pi pi-sort-amount-up" },
];
const sortOrder = ref("newest");

const pageSize = 6;
const currentPage = ref(1);

const filteredSorted = computed(() => {
  let items = [...allNews];

  if (activeCategory.value !== "Semua Kategori") {
    items = items.filter((item) => item.category === activeCategory.value);
  }

  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q)
    );
  }

  items.sort((a, b) =>
    sortOrder.value === "newest"
      ? new Date(b.dateISO) - new Date(a.dateISO)
      : new Date(a.dateISO) - new Date(b.dateISO)
  );

  return items;
});

const featured = computed(() => {
  const isAllCategory = activeCategory.value === "Semua Kategori";
  if (!isAllCategory) return null;
  return pinnedNews.value || filteredSorted.value[0] || null;
});

const rest = computed(() =>
  featured.value
    ? filteredSorted.value.filter((item) => item.slug !== featured.value.slug)
    : filteredSorted.value
);
const totalPages = computed(() => Math.max(1, Math.ceil(rest.value.length / pageSize)));
const pagedRest = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return rest.value.slice(start, start + pageSize);
});

watch([activeCategory, searchQuery, sortOrder], () => {
  currentPage.value = 1;
});

function handleImgError(event) {
  event.target.style.display = "none";
}

/* ============ WARNA PER KATEGORI (ala Gallery) ============
   Warna ditentukan otomatis dari nama kategori supaya konsisten
   di seluruh halaman, tanpa perlu daftar kategori hardcode. */
const colorPalette = [
  {
    dot: "bg-sky-500",
    topBar: "bg-gradient-to-r from-sky-400 to-cyan-500",
    imageGrad: "from-sky-100 via-cyan-100 to-sky-200",
    shimmer: "via-sky-200/70",
    solidActive: "bg-sky-600 text-white border-sky-600 shadow-sky-600/25",
    ring: "hover:border-sky-300",
  },
  {
    dot: "bg-rose-500",
    topBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    imageGrad: "from-rose-100 via-pink-100 to-rose-200",
    shimmer: "via-rose-200/70",
    solidActive: "bg-rose-600 text-white border-rose-600 shadow-rose-600/25",
    ring: "hover:border-rose-300",
  },
  {
    dot: "bg-amber-500",
    topBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    imageGrad: "from-amber-100 via-orange-100 to-amber-200",
    shimmer: "via-amber-200/70",
    solidActive: "bg-amber-600 text-white border-amber-600 shadow-amber-600/25",
    ring: "hover:border-amber-300",
  },
  {
    dot: "bg-violet-500",
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    imageGrad: "from-violet-100 via-purple-100 to-violet-200",
    shimmer: "via-violet-200/70",
    solidActive: "bg-violet-600 text-white border-violet-600 shadow-violet-600/25",
    ring: "hover:border-violet-300",
  },
  {
    dot: "bg-emerald-500",
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    imageGrad: "from-emerald-100 via-teal-100 to-emerald-200",
    shimmer: "via-emerald-200/70",
    solidActive: "bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/25",
    ring: "hover:border-emerald-300",
  },
];

function hashCategory(cat) {
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash = (hash * 31 + cat.charCodeAt(i)) >>> 0;
  return hash;
}

function styleFor(category) {
  if (!category) return colorPalette[0];
  return colorPalette[hashCategory(category) % colorPalette.length];
}
</script>

<template>
  <div class="relative overflow-hidden py-6 lg:py-8 flex flex-col gap-8">
    <!-- ============ AMBIENT BLOBS ============ -->
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-64 -z-10 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl animate-blob-float" />
    <div class="pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl animate-blob-float-slow" />

    <!-- ============ HEADER + SEARCH ============ -->
    <div class="fade-in-up flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-2">
          <span class="header-kicker-dot h-2 w-2 rounded-full bg-sky-500" />
          <span class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">Info Desa</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-heading mt-1">
          Berita <span class="heading-accent">Desa</span>
        </h1>
        <p class="text-[13.5px] sm:text-[14.5px] text-muted mt-1">
          Informasi dan kabar terbaru dari desa kita.
        </p>
      </div>

      <div class="relative w-full lg:w-[300px] shrink-0">
        <i
          class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-[13px]"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berita..."
          class="w-full rounded-xl border border-border-default bg-surface pl-10 pr-4 py-2.5 text-[13.5px] focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-colors"
        />
      </div>
    </div>

    <!-- ============ FILTER: KATEGORI + URUTAN ============ -->
    <div class="fade-in-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style="animation-delay: 60ms">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categoryOptions"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          :class="
            activeCategory === cat
              ? cat === 'Semua Kategori'
                ? 'bg-primary-900 text-white border-primary-900'
                : [styleFor(cat).solidActive, 'shadow-md']
              : ['bg-surface text-default border-border-default', styleFor(cat).ring]
          "
          class="rounded-full border px-4 py-2 text-[12.5px] font-bold transition-all duration-200 active:scale-[0.97] flex items-center gap-1.5"
        >
          <span
            v-if="cat !== 'Semua Kategori'"
            class="h-1.5 w-1.5 rounded-full"
            :class="activeCategory === cat ? 'bg-white/80' : styleFor(cat).dot"
          />
          {{ cat }}
        </button>
      </div>

      <div class="flex items-center gap-1 rounded-full border border-border-default bg-surface p-1 w-fit shrink-0">
        <button
          v-for="opt in sortOptions"
          :key="opt.value"
          type="button"
          @click="sortOrder = opt.value"
          :class="sortOrder === opt.value ? 'bg-primary-800 text-white' : 'text-muted hover:text-default'"
          class="rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors flex items-center gap-1.5"
        >
          <i :class="opt.icon" class="text-[11px]" />
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- ============ EMPTY STATE ============ -->
    <div
      v-if="filteredSorted.length === 0"
      class="empty-state rounded-2xl border border-dashed border-border-default bg-surface p-10 text-center"
    >
      <i class="pi pi-inbox text-3xl text-primary-200" />
      <p class="text-[14px] font-bold text-heading mt-3">Belum ada berita ditemukan</p>
      <p class="text-[12.5px] text-muted mt-1">
        Coba ubah kata kunci pencarian atau kategori yang dipilih.
      </p>
    </div>

    <template v-else>
      <!-- ============ FEATURED + BERITA TERBARU ============ -->
      <div v-if="featured" class="fade-in-up grid lg:grid-cols-3 gap-6 lg:gap-8 items-start" style="animation-delay: 100ms">
        <RouterLink
          :to="{ name: 'news-detail', params: { slug: featured.slug } }"
          class="featured-card lg:col-span-2 group relative overflow-hidden rounded-2xl border border-border-default bg-surface hover:shadow-xl transition-all duration-300 block"
        >
          <span class="absolute inset-x-0 top-0 z-10 h-1" :class="styleFor(featured.category).topBar" />

          <div
            class="shimmer-wrap relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden flex items-center justify-center bg-gradient-to-br"
            :class="featured.image ? 'bg-primary-50' : styleFor(featured.category).imageGrad"
          >
            <img
              v-if="featured.image"
              :src="featured.image"
              :alt="featured.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              @error="handleImgError"
            />
            <template v-else>
              <i class="pi pi-image text-4xl opacity-40" />
              <span class="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent to-transparent" :class="styleFor(featured.category).shimmer" />
            </template>
            <span
              :class="getCategoryClasses(featured.category)"
              class="absolute left-4 top-4 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide"
            >
              {{ featured.category }}
            </span>
            <span
              v-if="pinnedNews && featured.slug === pinnedNews.slug"
              class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-heading/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
            >
              <i class="pi pi-bookmark-fill text-[10px]" />
              Disematkan
            </span>
          </div>
          <div class="p-5 sm:p-6">
            <h2 class="text-lg sm:text-xl lg:text-[22px] font-extrabold text-heading leading-snug">
              {{ featured.title }}
            </h2>
            <p class="text-[13px] sm:text-[13.5px] text-muted mt-2 leading-relaxed line-clamp-2">
              {{ featured.excerpt }}
            </p>
            <div class="flex items-center gap-3 text-[12px] text-muted mt-4">
              <span class="flex items-center gap-1.5">
                <i class="pi pi-calendar text-[11px]" />
                {{ featured.date }}
              </span>
              <span class="w-1 h-1 rounded-full bg-border-default" />
              <span class="flex items-center gap-1.5">
                <i class="pi pi-user text-[11px]" />
                {{ featured.author }}
              </span>
            </div>
          </div>
        </RouterLink>

        <!-- ============ BERITA TERBARU ============ -->
        <div class="rounded-2xl border border-border-default bg-surface p-5">
          <h2 class="text-[15px] font-extrabold text-heading flex items-center gap-2 mb-3">
            <i class="pi pi-clock text-secondary-500" />
            Berita Terbaru
          </h2>
          <div class="flex flex-col gap-3">
            <RouterLink
              v-for="item in latestNews"
              :key="item.slug"
              :to="{ name: 'news-detail', params: { slug: item.slug } }"
              class="group flex items-center gap-3.5 rounded-xl border border-border-default p-2.5 transition-colors"
              :class="styleFor(item.category).ring"
            >
              <div
                class="shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br"
                :class="item.image ? 'bg-primary-50' : styleFor(item.category).imageGrad"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleImgError"
                />
                <i v-else class="pi pi-image text-lg opacity-40" />
              </div>
              <div class="min-w-0 flex flex-col gap-1.5">
                <p
                  class="text-[13px] font-extrabold text-heading leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors"
                >
                  {{ item.title }}
                </p>
                <span
                  class="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-[10.5px] font-bold text-primary-700"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="styleFor(item.category).dot" />
                  {{ item.date }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- ============ BERITA LAINNYA + PAGINATION ============ -->
      <div class="fade-in-up" style="animation-delay: 140ms">
        <h2 v-if="featured" class="text-xl sm:text-2xl font-extrabold text-heading mb-4">Berita Lainnya</h2>

        <TransitionGroup
          v-if="pagedRest.length"
          tag="div"
          name="card"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <NewsCard v-for="item in pagedRest" :key="item.slug" :item="item" />
        </TransitionGroup>
        <p v-else class="text-[13px] text-muted">Tidak ada berita lain untuk filter ini.</p>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-1.5 mt-8">
          <button
            type="button"
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
          >
            <i class="pi pi-angle-left text-[13px]" />
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            @click="currentPage = p"
            :class="
              currentPage === p
                ? 'bg-primary-800 text-white border-primary-800'
                : 'border-border-default text-default hover:bg-surface-hover'
            "
            class="w-9 h-9 rounded-lg border text-[12.5px] font-bold transition-colors"
          >
            {{ p }}
          </button>
          <button
            type="button"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="w-9 h-9 rounded-lg border border-border-default flex items-center justify-center text-muted disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors"
          >
            <i class="pi pi-angle-right text-[13px]" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(14px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.fade-in-up { animation: fadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }

.header-kicker-dot { animation: kickerPulse 2.2s ease-in-out infinite; }
@keyframes kickerPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

.heading-accent {
  background: linear-gradient(90deg, #0284c7, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-16px, 18px) scale(1.08); }
}
.animate-blob-float { animation: blobFloat 10s ease-in-out infinite; }
@keyframes blobFloatSlow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(14px, -12px) scale(1.05); }
}
.animate-blob-float-slow { animation: blobFloatSlow 13s ease-in-out infinite; }

.shimmer-wrap { background-size: 200% 200%; }
.shimmer-sweep {
  transform: translateX(-120%) skewX(-12deg);
  animation: shimmerSweep 3.2s ease-in-out infinite;
}
@keyframes shimmerSweep {
  0% { transform: translateX(-120%) skewX(-12deg); }
  55%, 100% { transform: translateX(220%) skewX(-12deg); }
}

.empty-state { animation: fadeInUp 0.5s ease both; }

.card-enter-from { opacity: 0; transform: translateY(22px) scale(0.92) rotate(-1deg); }
.card-enter-active { transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1); }
.card-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; position: absolute; }
.card-leave-to { opacity: 0; transform: scale(0.95); }
.card-move { transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }

@media (prefers-reduced-motion: reduce) {
  .fade-in-up, .card-enter-active, .card-leave-active, .card-move,
  .header-kicker-dot, .animate-blob-float, .animate-blob-float-slow,
  .shimmer-sweep, .empty-state {
    animation: none !important;
    transition: none !important;
  }
}
</style>