<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { potentialCategories, potentials, categoryLabel, categoryIcon } from '@/views/potential/potentialData.js'

const activeCategory = ref('all')

const filteredPotentials = computed(() =>
  activeCategory.value === 'all'
    ? potentials
    : potentials.filter((p) => p.category === activeCategory.value)
)
</script>

<template>
  <div class="py-8">
    <!-- ===== HEADER ===== -->
    <div class="fade-in-up">
      <h1 class="text-2xl md:text-3xl font-bold text-heading">Potensi Desa</h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Eksplorasi kekayaan dan aset unggulan desa kami.
      </p>
    </div>

    <!-- ===== FILTER TABS ===== -->
    <div class="fade-in-up mt-6 flex flex-wrap gap-2" style="animation-delay: 60ms">
      <button
        v-for="c in potentialCategories"
        :key="c.slug"
        @click="activeCategory = c.slug"
        class="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
        :class="
          activeCategory === c.slug
            ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
            : 'border-border-default bg-surface text-default hover:border-primary-200 hover:bg-surface-hover'
        "
      >
        <i v-if="c.icon" :class="c.icon" class="text-xs" />
        <span>{{ c.label }}</span>
      </button>
    </div>

    <!-- ===== CARD GRID ===== -->
    <p v-if="filteredPotentials.length === 0" class="fade-in-up mt-10 text-sm text-muted">
      Belum ada data potensi untuk kategori ini.
    </p>

    <TransitionGroup
      v-else
      tag="div"
      name="card"
      appear
      class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="(item, i) in filteredPotentials"
        :key="item.slug"
        class="card-item group flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10"
        :style="{ transitionDelay: `${i * 60}ms` }"
      >
        <!-- image + category badge -->
        <div class="relative">
          <div
            class="flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-surface-hover to-border-default transition-transform duration-500 group-hover:scale-105"
          >
            <i class="pi pi-image text-3xl text-muted/50" />
          </div>
          <span
            class="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-heading shadow-sm backdrop-blur-sm"
          >
            <i :class="categoryIcon(item.category)" class="text-[10px] text-primary-500" />
            {{ categoryLabel(item.category) }}
          </span>
        </div>

        <!-- content -->
        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-lg font-bold leading-snug text-heading">
            {{ item.name }}
          </h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
            {{ item.shortDesc }}
          </p>

          <RouterLink
            :to="{ name: 'potential-detail', params: { slug: item.slug } }"
            class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border-default py-2.5 text-sm font-semibold text-default transition-colors duration-200 group-hover:border-primary-500 group-hover:bg-primary-500 group-hover:text-white"
          >
            Lihat Detail
            <i class="pi pi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
          </RouterLink>
        </div>
      </article>
    </TransitionGroup>
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

.card-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
.card-enter-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.card-leave-active {
  transition: opacity 0.25s ease;
  position: absolute;
}
.card-leave-to {
  opacity: 0;
}
.card-move {
  transition: transform 0.4s ease;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .card-enter-active,
  .card-leave-active,
  .card-move {
    animation: none !important;
    transition: none !important;
  }
}
</style>