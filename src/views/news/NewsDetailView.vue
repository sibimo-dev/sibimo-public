<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { getNewsBySlug, getRelatedNews, getCategoryClasses } from "@/services/news.js";

const props = defineProps({
  slug: { type: String, required: true },
});

const article = computed(() => getNewsBySlug(props.slug));
const relatedNews = computed(() => getRelatedNews(article.value, 3));

const shareLinks = computed(() => {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = article.value?.title || "";
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " - " + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  };
});

function handleImgError(event) {
  event.target.style.display = "none";
}
</script>

<template>
  <div class="py-6 lg:py-8">
    <!-- ============ NOT FOUND ============ -->
    <div
      v-if="!article"
      class="rounded-2xl border border-dashed border-border-default bg-surface p-12 text-center max-w-xl mx-auto"
    >
      <i class="pi pi-exclamation-circle text-3xl text-primary-200" />
      <p class="text-[15px] font-bold text-heading mt-3">Berita tidak ditemukan</p>
      <p class="text-[13px] text-muted mt-1">
        Berita yang kamu cari mungkin sudah dihapus atau tautannya salah.
      </p>
      <RouterLink
        :to="{ name: 'news' }"
        class="inline-flex items-center gap-2 mt-5 rounded-xl bg-primary-800 text-white text-[13px] font-bold px-5 py-2.5 hover:bg-primary-700 transition-colors"
      >
        <i class="pi pi-arrow-left text-[11px]" />
        Kembali ke Berita Desa
      </RouterLink>
    </div>

    <template v-else>
      <!-- ============ BREADCRUMB ============ -->
      <nav class="flex items-center flex-wrap gap-1.5 text-[12.5px] text-muted mb-5">
        <RouterLink :to="{ name: 'home' }" class="hover:text-primary-700 transition-colors">
          Beranda
        </RouterLink>
        <i class="pi pi-angle-right text-[9px]" />
        <RouterLink :to="{ name: 'news' }" class="hover:text-primary-700 transition-colors">
          Berita Desa
        </RouterLink>
        <i class="pi pi-angle-right text-[9px]" />
        <span class="text-default font-medium truncate max-w-[220px] sm:max-w-none">
          {{ article.title }}
        </span>
      </nav>

      <div class="grid lg:grid-cols-3 gap-8 items-start">
        <!-- ============ KONTEN UTAMA ============ -->
        <article class="lg:col-span-2 min-w-0">
          <span
            :class="getCategoryClasses(article.category)"
            class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
          >
            {{ article.category }}
          </span>

          <h1 class="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-heading leading-tight mt-3">
            {{ article.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-muted mt-3">
            <span class="flex items-center gap-1.5">
              <i class="pi pi-calendar text-[11px]" />
              {{ article.date }}
            </span>
            <span class="flex items-center gap-1.5">
              <i class="pi pi-user text-[11px]" />
              {{ article.author }}
            </span>
          </div>

          <div class="relative aspect-video rounded-2xl bg-primary-50 overflow-hidden mt-5 flex items-center justify-center">
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover"
              @error="handleImgError"
            />
            <i v-else class="pi pi-image text-4xl text-primary-200" />
          </div>

          <div class="mt-6 flex flex-col gap-4">
            <p
              v-for="(para, i) in article.content"
              :key="i"
              class="text-[14.5px] sm:text-[15px] leading-relaxed text-default"
            >
              {{ para }}
            </p>
          </div>

          <!-- ============ SHARE ============ -->
          <div class="flex items-center gap-3 mt-8 pt-6 border-t border-border-default">
            <span class="text-[12.5px] font-bold text-heading">Bagikan:</span>
            <a
              :href="shareLinks.whatsapp"
              target="_blank"
              rel="noopener"
              class="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-muted hover:text-emerald-600 hover:border-emerald-300 transition-colors"
            >
              <i class="pi pi-whatsapp text-[14px]" />
            </a>
            <a
              :href="shareLinks.facebook"
              target="_blank"
              rel="noopener"
              class="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-muted hover:text-primary-700 hover:border-primary-300 transition-colors"
            >
              <i class="pi pi-facebook text-[14px]" />
            </a>
            <a
              :href="shareLinks.twitter"
              target="_blank"
              rel="noopener"
              class="w-9 h-9 rounded-full border border-border-default flex items-center justify-center text-muted hover:text-sky-600 hover:border-sky-300 transition-colors"
            >
              <i class="pi pi-twitter text-[14px]" />
            </a>
          </div>

          <RouterLink
            :to="{ name: 'news' }"
            class="inline-flex items-center gap-2 mt-6 text-[13px] font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <i class="pi pi-arrow-left text-[11px]" />
            Kembali ke Berita Desa
          </RouterLink>
        </article>

        <!-- ============ SIDEBAR: BERITA TERKAIT (dirapikan) ============ -->
        <aside
          class="rounded-2xl border border-border-default bg-surface p-5 lg:sticky lg:top-[calc(var(--navbar-h)+24px)]"
        >
          <h2 class="text-[15px] font-extrabold text-heading flex items-center gap-2 mb-3">
            <i class="pi pi-book text-primary-700" />
            Berita Terkait
          </h2>
          <div class="flex flex-col gap-3">
            <RouterLink
              v-for="item in relatedNews"
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
        </aside>
      </div>
    </template>
  </div>
</template>