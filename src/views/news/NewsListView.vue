<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import NewsCard from "@/components/shared/NewsCard.vue";
import {
  getAllNews,
  getPopularNews,
  newsCategories,
  getCategoryClasses,
} from "@/services/news.js";



const allNews = getAllNews();
const popularNews = getPopularNews(3);

const categoryOptions = ["Semua Kategori", ...newsCategories];
const activeCategory = ref("Semua Kategori");
const searchQuery = ref("");

// Filter "terbaru/terkini" yang diminta — urutkan berdasarkan tanggal.
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

// Item pertama hasil filter dipakai sebagai kartu unggulan, sisanya masuk
// ke grid "Berita Lainnya" yang dipaginasi.
const featured = computed(() => filteredSorted.value[0] || null);
const rest = computed(() => filteredSorted.value.slice(1));
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
</script>

<template>
  <div class="py-6 lg:py-8 flex flex-col gap-8">
    <!-- ============ HEADER + SEARCH ============ -->
    <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-heading">Berita Desa</h1>
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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categoryOptions"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          :class="
            activeCategory === cat
              ? 'bg-primary-900 text-white border-primary-900'
              : 'bg-surface text-default border-border-default hover:border-primary-300'
          "
          class="rounded-full border px-4 py-2 text-[12.5px] font-bold transition-colors"
        >
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
      class="rounded-2xl border border-dashed border-border-default bg-surface p-10 text-center"
    >
      <i class="pi pi-inbox text-3xl text-primary-200" />
      <p class="text-[14px] font-bold text-heading mt-3">Belum ada berita ditemukan</p>
      <p class="text-[12.5px] text-muted mt-1">
        Coba ubah kata kunci pencarian atau kategori yang dipilih.
      </p>
    </div>

    <template v-else>
      <!-- ============ FEATURED + BERITA POPULER ============ -->
      <div class="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <RouterLink
          v-if="featured"
          :to="{ name: 'news-detail', params: { slug: featured.slug } }"
          class="lg:col-span-2 group rounded-2xl border border-border-default bg-surface overflow-hidden hover:shadow-lg transition-all block"
        >
          <div class="relative aspect-[16/9] sm:aspect-[16/8] bg-primary-50 overflow-hidden flex items-center justify-center">
            <img
              v-if="featured.image"
              :src="featured.image"
              :alt="featured.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              @error="handleImgError"
            />
            <i v-else class="pi pi-image text-4xl text-primary-200" />
            <span
              :class="getCategoryClasses(featured.category)"
              class="absolute left-4 top-4 rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wide"
            >
              {{ featured.category }}
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

        <!-- ============ BERITA POPULER (dirapikan) ============ -->
        <div class="rounded-2xl border border-border-default bg-surface p-5">
          <h2 class="text-[15px] font-extrabold text-heading flex items-center gap-2 mb-3">
            <i class="pi pi-star-fill text-secondary-500" />
            Berita Populer
          </h2>
          <div class="flex flex-col gap-3">
            <RouterLink
              v-for="item in popularNews"
              :key="item.slug"
              :to="{ name: 'news-detail', params: { slug: item.slug } }"
              class="group flex items-center gap-3.5 rounded-xl border border-border-default p-2.5 hover:border-primary-300 hover:bg-primary-50/40 transition-colors"
            >
              <div class="shrink-0 w-16 h-16 rounded-xl bg-primary-50 overflow-hidden flex items-center justify-center">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                  @error="handleImgError"
                />
                <i v-else class="pi pi-image text-lg text-primary-200" />
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
                  <i class="pi pi-calendar text-[9.5px]" />
                  {{ item.date }}
                </span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- ============ BERITA LAINNYA + PAGINATION ============ -->
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-heading mb-4">Berita Lainnya</h2>

        <div v-if="pagedRest.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <NewsCard v-for="item in pagedRest" :key="item.slug" :item="item" />
        </div>
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