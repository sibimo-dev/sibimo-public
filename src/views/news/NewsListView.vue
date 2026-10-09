<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { RouterLink } from "vue-router";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import SelectButton from "primevue/selectbutton";
import Paginator from "primevue/paginator";
import Tag from "primevue/tag";

import { fetchAllNews, newsCategories } from "@/services/news.js";

const allNews = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    allNews.value = await fetchAllNews();
  } catch (err) {
    console.error("Gagal memuat berita:", err);
  } finally {
    loading.value = false;
  }
});

const pinnedNews = computed(() => allNews.value.find((item) => item.isPinned) || null);
const latestNews = computed(() =>
  [...allNews.value].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO)).slice(0, 3)
);

const ALL_CATEGORY_LABEL = "Semua Kategori";
const categoryOptions = [ALL_CATEGORY_LABEL, ...newsCategories];
const activeCategory = ref(ALL_CATEGORY_LABEL);
const searchQuery = ref("");

const sortOptions = [
  { label: "Terbaru", value: "newest", icon: "pi pi-sort-amount-down" },
  { label: "Terlama", value: "oldest", icon: "pi pi-sort-amount-up" },
];
const sortOrder = ref("newest");

const pageSize = 6;
const currentPage = ref(1);

const filteredSorted = computed(() => {
  let items = [...allNews.value];

  if (activeCategory.value !== ALL_CATEGORY_LABEL) {
    items = items.filter((item) => item.category === activeCategory.value);
  }

  const query = searchQuery.value.trim().toLowerCase();
  if (query) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query)
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
  const isAllCategory = activeCategory.value === ALL_CATEGORY_LABEL;
  if (!isAllCategory) return null;
  return pinnedNews.value || filteredSorted.value[0] || null;
});

const restNews = computed(() =>
  featured.value
    ? filteredSorted.value.filter((item) => item.slug !== featured.value.slug)
    : filteredSorted.value
);

const pagedRest = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return restNews.value.slice(start, start + pageSize);
});

function onPageChange(event) {
  currentPage.value = event.page + 1;
}

watch([activeCategory, searchQuery, sortOrder], () => {
  currentPage.value = 1;
});

function handleImageError(event) {
  event.target.style.display = "none";
}

/* ============ Warna per kategori (digabung langsung di sini) ============
   Warna ditentukan otomatis dari nama kategori (hash) supaya konsisten
   di seluruh halaman, tanpa perlu daftar kategori hardcode dan tanpa
   file terpisah. */
const CATEGORY_PALETTE = [
  {
    dot: "bg-sky-500",
    topBar: "bg-gradient-to-r from-sky-400 to-cyan-500",
    imageGradient: "from-sky-100 via-cyan-100 to-sky-200",
    activeBadge: "bg-gradient-to-r from-sky-500 to-cyan-500 text-white border-transparent shadow-lg shadow-sky-500/30",
    softBadge: "bg-sky-50 text-sky-700 border border-sky-200",
    hoverRing: "hover:border-sky-300",
  },
  {
    dot: "bg-rose-500",
    topBar: "bg-gradient-to-r from-rose-400 to-pink-500",
    imageGradient: "from-rose-100 via-pink-100 to-rose-200",
    activeBadge: "bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/30",
    softBadge: "bg-rose-50 text-rose-700 border border-rose-200",
    hoverRing: "hover:border-rose-300",
  },
  {
    dot: "bg-amber-500",
    topBar: "bg-gradient-to-r from-amber-400 to-orange-500",
    imageGradient: "from-amber-100 via-orange-100 to-amber-200",
    activeBadge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg shadow-amber-500/30",
    softBadge: "bg-amber-50 text-amber-700 border border-amber-200",
    hoverRing: "hover:border-amber-300",
  },
  {
    dot: "bg-violet-500",
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    imageGradient: "from-violet-100 via-purple-100 to-violet-200",
    activeBadge: "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-transparent shadow-lg shadow-violet-500/30",
    softBadge: "bg-violet-50 text-violet-700 border border-violet-200",
    hoverRing: "hover:border-violet-300",
  },
  {
    dot: "bg-emerald-500",
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    imageGradient: "from-emerald-100 via-teal-100 to-emerald-200",
    activeBadge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/30",
    softBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    hoverRing: "hover:border-emerald-300",
  },
];

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getCategoryStyle(category) {
  if (!category) return CATEGORY_PALETTE[0];
  return CATEGORY_PALETTE[hashString(category) % CATEGORY_PALETTE.length];
}
</script>

<template>
  <div v-if="loading" class="py-20 text-center text-muted">Memuat berita...</div>
  <div class="relative flex flex-col gap-8 overflow-hidden py-6 lg:py-8">
    <!-- Ambient glow, gantinya blob custom keyframes -->
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 animate-pulse rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-64 -z-10 h-64 w-64 animate-pulse rounded-full bg-rose-400/10 blur-3xl [animation-delay:0.4s]" />
    <div class="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-56 w-56 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:0.8s]" />

    <!-- Header + pencarian -->
    <Transition
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div class="flex items-center gap-2">
  
            <span class="h-2 w-2 rounded-full bg-sky-500" />
  
            <span class="text-[11px] font-extrabold uppercase tracking-[0.2em] text-sky-500">
  
              Info Desa
  
            </span>

          </div>
          <h1 class="mt-2 text-2xl font-extrabold text-heading sm:text-3xl">
            Berita
            <span class="bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
              Kalurahan
            </span>
          </h1>
          <p class="mt-1 text-[13.5px] text-muted sm:text-[14.5px]">
            Informasi dan kabar terbaru dari desa kita.
          </p>
        </div>

        <IconField class="w-full shrink-0 lg:w-[300px]">
          <InputIcon class="pi pi-search text-muted" />
          <InputText
            v-model="searchQuery"
            placeholder="Cari berita..."
            class="w-full rounded-xl border-border-default py-2.5 text-[13.5px] focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </IconField>
      </div>
    </Transition>

    <!-- Filter kategori + urutan -->
    <Transition
      appear
      enter-active-class="transition-all delay-100 duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categoryOptions"
            :key="category"
            type="button"
            class="flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-bold transition-all duration-200 active:scale-95"
            :class="
              activeCategory === category
                ? category === ALL_CATEGORY_LABEL
                  ? 'border-transparent bg-gradient-to-r from-primary-800 to-primary-900 text-white shadow-md'
                  : [getCategoryStyle(category).activeBadge, 'scale-105']
                : ['border-border-default bg-surface text-default', getCategoryStyle(category).hoverRing]
            "
            @click="activeCategory = category"
          >
            <span
              v-if="category !== ALL_CATEGORY_LABEL"
              class="h-1.5 w-1.5 rounded-full"
              :class="activeCategory === category ? 'bg-white/80' : getCategoryStyle(category).dot"
            />
            {{ category }}
          </button>
        </div>

        <SelectButton
          v-model="sortOrder"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          class="w-fit shrink-0"
        >
          <template #option="slotProps">
            <span class="flex items-center gap-1.5 text-[12px] font-bold">
              <i :class="slotProps.option.icon" class="text-[11px]" />
              {{ slotProps.option.label }}
            </span>
          </template>
        </SelectButton>
      </div>
    </Transition>

    <!-- Empty state -->
    <Transition
      appear
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
    >
      <div
        v-if="filteredSorted.length === 0"
        class="rounded-2xl border border-dashed border-border-default bg-gradient-to-br from-primary-50 via-surface to-violet-50 p-10 text-center"
      >
        <i class="pi pi-inbox text-3xl text-primary-300" />
        <p class="mt-3 text-[14px] font-bold text-heading">Belum ada berita ditemukan</p>
        <p class="mt-1 text-[12.5px] text-muted">
          Coba ubah kata kunci pencarian atau kategori yang dipilih.
        </p>
      </div>
    </Transition>

    <template v-if="filteredSorted.length > 0">
      <!-- Berita unggulan + Berita terbaru -->
      <Transition
        appear
        enter-active-class="transition-all delay-150 duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="featured" class="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
          <RouterLink
            :to="{ name: 'news-detail', params: { slug: featured.slug } }"
            class="group relative block overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl lg:col-span-2"
          >
            <span class="absolute inset-x-0 top-0 z-10 h-1.5" :class="getCategoryStyle(featured.category).topBar" />

            <div
              class="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br sm:aspect-[16/8]"
              :class="featured.image ? 'bg-primary-50' : getCategoryStyle(featured.category).imageGradient"
            >
              <img
                v-if="featured.image"
                :src="featured.image"
                :alt="featured.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                @error="handleImageError"
              />
              <i v-else class="pi pi-image text-4xl text-white/50" />

              <Tag
                :value="featured.category"
                unstyled
                class="absolute left-4 top-4 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide"
                :class="getCategoryStyle(featured.category).activeBadge"
              />
              <Tag
                v-if="pinnedNews && featured.slug === pinnedNews.slug"
                unstyled
                value="Disematkan"
                icon="pi pi-bookmark-fill"
                class="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-heading/80 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide text-white backdrop-blur-sm"
              />
            </div>

            <div class="p-5 sm:p-6">
              <h2 class="text-lg font-extrabold leading-snug text-heading transition-colors duration-300 group-hover:text-primary-700 sm:text-xl lg:text-[22px]">
                {{ featured.title }}
              </h2>
              <p class="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted sm:text-[13.5px]">
                {{ featured.excerpt }}
              </p>
              <div class="mt-4 flex items-center gap-3 text-[12px] text-muted">
                <span class="flex items-center gap-1.5">
                  <i class="pi pi-calendar text-[11px]" />
                  {{ featured.date }}
                </span>
                <span class="h-1 w-1 rounded-full bg-border-default" />
                <span class="flex items-center gap-1.5">
                  <i class="pi pi-user text-[11px]" />
                  {{ featured.author }}
                </span>
              </div>
            </div>
          </RouterLink>

          <!-- Berita terbaru -->
          <div class="rounded-2xl border border-border-default bg-gradient-to-br from-surface to-primary-50/40 p-5">
            <h2 class="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-heading">
              <i class="pi pi-clock text-secondary-500" />
              Berita Terbaru
            </h2>
            <div class="flex flex-col gap-3">
              <RouterLink
                v-for="item in latestNews"
                :key="item.slug"
                :to="{ name: 'news-detail', params: { slug: item.slug } }"
                class="group flex items-center gap-3.5 rounded-xl border border-border-default p-2.5 transition-all duration-300 hover:-translate-x-0.5 hover:shadow-md"
                :class="getCategoryStyle(item.category).hoverRing"
              >
                <div
                  class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br"
                  :class="item.image ? 'bg-primary-50' : getCategoryStyle(item.category).imageGradient"
                >
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    @error="handleImageError"
                  />
                  <i v-else class="pi pi-image text-lg text-white/60" />
                </div>
                <div class="flex min-w-0 flex-col gap-1.5">
                  <p class="line-clamp-2 text-[13px] font-extrabold leading-snug text-heading transition-colors group-hover:text-primary-700">
                    {{ item.title }}
                  </p>
                  <span
                    class="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold"
                    :class="getCategoryStyle(item.category).softBadge"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :class="getCategoryStyle(item.category).dot" />
                    {{ item.date }}
                  </span>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Berita lainnya + pagination (kartu di-inline langsung di sini) -->
      <div>
        <h2 v-if="featured" class="mb-4 text-xl font-extrabold text-heading sm:text-2xl">Berita Lainnya</h2>

        <TransitionGroup
          v-if="pagedRest.length"
          tag="div"
          class="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          move-class="transition-transform duration-500 ease-out"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-6 scale-95"
          leave-active-class="transition-all duration-300 ease-in absolute"
          leave-to-class="opacity-0 scale-95"
        >
          <RouterLink
            v-for="item in pagedRest"
            :key="item.slug"
            :to="{ name: 'news-detail', params: { slug: item.slug } }"
            class="group relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary-900/10"
          >
            <span
              class="absolute inset-x-0 top-0 z-10 h-1.5 origin-left scale-x-50 opacity-70 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100"
              :class="getCategoryStyle(item.category).topBar"
            />

            <div
              class="relative aspect-[16/10] overflow-hidden bg-gradient-to-br"
              :class="item.image ? 'bg-primary-50' : getCategoryStyle(item.category).imageGradient"
            >
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                @error="handleImageError"
              />
              <div v-else class="flex h-full w-full items-center justify-center">
                <i class="pi pi-image text-4xl text-white/50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>

              <Tag
                :value="item.category"
                unstyled
                class="absolute left-3 top-3 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5"
                :class="getCategoryStyle(item.category).activeBadge"
              />
            </div>

            <div class="flex flex-1 flex-col gap-2 p-4 sm:p-5">
              <h3 class="line-clamp-2 text-[14.5px] font-extrabold leading-snug text-heading transition-colors duration-300 group-hover:text-primary-700">
                {{ item.title }}
              </h3>
              <p class="line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-muted">
                {{ item.excerpt }}
              </p>

              <div class="flex items-center justify-between border-t border-border-default pt-3 text-[11.5px] text-muted">
                <span class="flex items-center gap-1.5">
                  <i class="pi pi-calendar text-[10.5px]" />
                  {{ item.date }}
                </span>
                <span
                  class="flex h-7 w-7 items-center justify-center rounded-full text-primary-700 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:scale-110"
                  :class="getCategoryStyle(item.category).softBadge"
                >
                  <i class="pi pi-arrow-right text-[11px]" />
                </span>
              </div>
            </div>
          </RouterLink>
        </TransitionGroup>
        <p v-else class="text-[13px] text-muted">Tidak ada berita lain untuk filter ini.</p>

        <Paginator
          v-if="restNews.length > pageSize"
          class="mt-8 justify-center rounded-xl border-0 bg-transparent"
          :first="(currentPage - 1) * pageSize"
          :rows="pageSize"
          :totalRecords="restNews.length"
          @page="onPageChange"
        />
      </div>
    </template>
  </div>
</template>