<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  getPotentialBySlug,
  getRelatedPotentials,
  categoryLabel,
  categoryIcon,
} from '@/views/potential/potentialData.js'

// `slug` arrives as a prop because the route is defined with `props: true`
// (see src/router/index.js).
const props = defineProps({
  slug: { type: String, required: true },
})

const item = computed(() => getPotentialBySlug(props.slug))
const related = computed(() =>
  item.value ? getRelatedPotentials(item.value.category, item.value.slug) : []
)
</script>

<template>
  <div class="py-8">
    <!-- ===== NOT FOUND ===== -->
    <div v-if="!item" class="fade-in-up py-16 text-center">
      <p class="text-lg font-semibold text-heading">Potensi tidak ditemukan</p>
      <p class="mt-1 text-sm text-muted">
        Data yang kamu cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <RouterLink
        :to="{ name: 'potential' }"
        class="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
      >
        <i class="pi pi-arrow-left text-xs" />
        Kembali ke Potensi Desa
      </RouterLink>
    </div>

    <!-- ===== DETAIL ===== -->
    <template v-else>
      <!-- breadcrumb -->
      <RouterLink
        :to="{ name: 'potential' }"
        class="fade-in-up inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-primary-500"
      >
        <i class="pi pi-arrow-left text-xs" />
        Kembali ke Potensi Desa
      </RouterLink>

      <!-- hero image -->
      <div
        class="fade-in-up relative mt-4 flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-surface-hover to-border-default md:h-80"
        style="animation-delay: 60ms"
      >
        <i class="pi pi-image text-5xl text-muted/40" />
        <span
          class="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-heading shadow-sm backdrop-blur-sm"
        >
          <i :class="categoryIcon(item.category)" class="text-[11px] text-primary-500" />
          {{ categoryLabel(item.category) }}
        </span>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <!-- main content -->
        <div class="fade-in-up" style="animation-delay: 120ms">
          <h1 class="text-2xl md:text-3xl font-bold text-heading">{{ item.name }}</h1>
          <div class="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted">
            <i class="pi pi-map-marker text-primary-500" />
            {{ item.location }}
          </div>

          <p class="mt-6 text-sm md:text-[15px] leading-relaxed text-default">
            {{ item.longDesc }}
          </p>
        </div>

        <!-- info sidebar -->
        <aside
          class="fade-in-up h-fit rounded-2xl border border-border-default bg-surface p-6"
          style="animation-delay: 180ms"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">Informasi</p>

          <dl class="mt-4 space-y-4">
            <div v-for="(value, label) in item.extra" :key="label">
              <dt class="text-xs font-medium text-muted">{{ label }}</dt>
              <dd class="mt-0.5 text-sm font-semibold text-heading">{{ value }}</dd>
            </div>
          </dl>

          <div class="mt-6 border-t border-border-default pt-4">
            <p class="text-xs font-medium text-muted">Kontak</p>
            <p class="mt-0.5 text-sm font-semibold text-heading">{{ item.contact }}</p>
          </div>

          <button
            class="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
          >
            <i class="pi pi-phone text-xs" />
            Hubungi Kontak
          </button>
        </aside>
      </div>

      <!-- related potentials -->
      <div v-if="related.length" class="mt-14">
        <h2 class="fade-in-up text-lg font-bold text-heading">Potensi Lainnya</h2>

        <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="(r, i) in related"
            :key="r.slug"
            :to="{ name: 'potential-detail', params: { slug: r.slug } }"
            class="related-card group overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div
              class="flex h-32 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-hover to-border-default transition-transform duration-500 group-hover:scale-105"
            >
              <i class="pi pi-image text-2xl text-muted/50" />
            </div>
            <div class="p-4">
              <p class="text-sm font-bold text-heading">{{ r.name }}</p>
              <p class="mt-1 text-xs text-muted line-clamp-2">{{ r.shortDesc }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-up {
  animation: fadeInUp 0.5s ease both;
}
.related-card {
  animation: fadeInUp 0.5s ease both;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .related-card {
    animation: none !important;
  }
}
</style>