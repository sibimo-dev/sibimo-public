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

/* Per-category color identity */
const categoryStyles = {
  umkm: {
    badge: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-600',
    imageGrad: 'from-amber-100 via-orange-100 to-amber-200',
    shimmer: 'via-amber-200/70',
    topBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
    tabActive: 'border-amber-500 bg-amber-500 text-white shadow-amber-500/30',
    tabIdleHover: 'hover:border-amber-300 hover:bg-amber-50',
    btnHover: 'group-hover:border-amber-500 group-hover:bg-amber-500',
    blob: 'bg-amber-400/25',
    ring: 'hover:shadow-amber-500/15',
  },
  pertanian: {
    badge: 'bg-emerald-100 text-emerald-700',
    iconColor: 'text-emerald-600',
    imageGrad: 'from-emerald-100 via-green-100 to-emerald-200',
    shimmer: 'via-emerald-200/70',
    topBar: 'bg-gradient-to-r from-emerald-400 to-green-500',
    tabActive: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30',
    tabIdleHover: 'hover:border-emerald-300 hover:bg-emerald-50',
    btnHover: 'group-hover:border-emerald-500 group-hover:bg-emerald-500',
    blob: 'bg-emerald-400/25',
    ring: 'hover:shadow-emerald-500/15',
  },
  pariwisata: {
    badge: 'bg-sky-100 text-sky-700',
    iconColor: 'text-sky-600',
    imageGrad: 'from-sky-100 via-cyan-100 to-sky-200',
    shimmer: 'via-sky-200/70',
    topBar: 'bg-gradient-to-r from-sky-400 to-cyan-500',
    tabActive: 'border-sky-500 bg-sky-500 text-white shadow-sky-500/30',
    tabIdleHover: 'hover:border-sky-300 hover:bg-sky-50',
    btnHover: 'group-hover:border-sky-500 group-hover:bg-sky-500',
    blob: 'bg-sky-400/25',
    ring: 'hover:shadow-sky-500/15',
  },
  bumdes: {
    badge: 'bg-violet-100 text-violet-700',
    iconColor: 'text-violet-600',
    imageGrad: 'from-violet-100 via-purple-100 to-violet-200',
    shimmer: 'via-violet-200/70',
    topBar: 'bg-gradient-to-r from-violet-400 to-purple-500',
    tabActive: 'border-violet-500 bg-violet-500 text-white shadow-violet-500/30',
    tabIdleHover: 'hover:border-violet-300 hover:bg-violet-50',
    btnHover: 'group-hover:border-violet-500 group-hover:bg-violet-500',
    blob: 'bg-violet-400/25',
    ring: 'hover:shadow-violet-500/15',
  },
}
const defaultStyle = {
  badge: 'bg-primary-100 text-primary-700',
  iconColor: 'text-primary-500',
  imageGrad: 'from-surface-hover via-primary-100 to-border-default',
  shimmer: 'via-primary-200/60',
  topBar: 'bg-gradient-to-r from-primary-400 to-primary-600',
  tabActive: 'border-primary-500 bg-primary-500 text-white shadow-primary-500/30',
  tabIdleHover: 'hover:border-primary-200 hover:bg-primary-50',
  btnHover: 'group-hover:border-primary-500 group-hover:bg-primary-500',
  blob: 'bg-primary-400/25',
  ring: 'hover:shadow-primary-500/15',
}
function styleFor(slug) {
  return categoryStyles[slug] || defaultStyle
}

const allTabActive = 'border-transparent bg-gradient-to-r from-primary-500 via-violet-500 to-sky-500 text-white shadow-primary-500/30'
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-40 -z-10 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl animate-blob-float" />
    <div class="pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl animate-blob-float-slow" />

    <!-- ===== HEADER ===== -->
    <div class="fade-in-up">
      <div class="inline-flex items-center gap-2">
        <span class="header-kicker-dot h-2 w-2 rounded-full bg-primary-500" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Jelajahi</span>
      </div>
      <h1 class="mt-2 text-2xl font-bold text-heading md:text-3xl">
        Potensi <span class="heading-accent">Bimomartani</span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Eksplorasi kekayaan dan aset unggulan kalurahan kami.
      </p>
    </div>

    <!-- ===== FILTER TABS ===== -->
    <div class="fade-in-up mt-6 flex flex-wrap gap-2" style="animation-delay: 60ms">
      <button
        v-for="c in potentialCategories"
        :key="c.slug"
        @click="activeCategory = c.slug"
        class="filter-tab flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95"
        :class="
          activeCategory === c.slug
            ? c.slug === 'all'
              ? [allTabActive, 'shadow-md scale-105']
              : [styleFor(c.slug).tabActive, 'shadow-md scale-105']
            : ['border-border-default bg-surface text-default', styleFor(c.slug).tabIdleHover, 'hover:scale-105']
        "
      >
        <i v-if="c.icon" :class="c.icon" class="text-xs" />
        <span>{{ c.label }}</span>
      </button>
    </div>

    <!-- ===== CARD GRID ===== -->
    <div v-if="filteredPotentials.length === 0" class="fade-in-up empty-state mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center">
      <i class="pi pi-inbox text-3xl text-muted/40" />
      <p class="text-sm text-muted">Belum ada data potensi untuk kategori ini.</p>
    </div>

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
        class="card-item group relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        :class="styleFor(item.category).ring"
        :style="{ transitionDelay: `${i * 60}ms` }"
      >
        <!-- colored top accent bar, one per category -->
        <span class="absolute inset-x-0 top-0 z-10 h-1" :class="styleFor(item.category).topBar" />

        <!-- image + category badge -->
        <div class="relative">
          <div
            class="shimmer-wrap relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br transition-transform duration-500 group-hover:scale-105"
            :class="styleFor(item.category).imageGrad"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="h-full w-full object-cover"
            />
            <template v-else>
              <i class="pi pi-image text-3xl opacity-40" :class="styleFor(item.category).iconColor" />
              <span class="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent to-transparent" :class="styleFor(item.category).shimmer" />
            </template>
          </div>
          <span
            class="absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm"
            :class="styleFor(item.category).badge"
          >
            <i :class="categoryIcon(item.category)" class="text-[10px]" />
            {{ categoryLabel(item.category) }}
          </span>
        </div>

        <!-- content -->
        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-lg font-bold leading-snug text-heading transition-colors duration-200">
            {{ item.name }}
          </h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
            {{ item.shortDesc }}
          </p>

          <RouterLink
            :to="{ name: 'potential-detail', params: { slug: item.slug } }"
            class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border-default py-2.5 text-sm font-semibold text-default transition-all duration-200 group-hover:text-white"
            :class="styleFor(item.category).btnHover"
          >
            Lihat Detail
            <i class="pi pi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
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
    transform: translateY(14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.fade-in-up {
  animation: fadeInUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Small pulsing dot next to the "Jelajahi" kicker label */
.header-kicker-dot {
  animation: kickerPulse 2.2s ease-in-out infinite;
}
@keyframes kickerPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.6; }
}

/* Gradient-highlighted "Desa" word in the heading */
.heading-accent {
  background: linear-gradient(90deg, var(--color-primary-600, #2563eb), #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Ambient background blobs */
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-16px, 18px) scale(1.08); }
}
.animate-blob-float {
  animation: blobFloat 10s ease-in-out infinite;
}
@keyframes blobFloatSlow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(14px, -12px) scale(1.05); }
}
.animate-blob-float-slow {
  animation: blobFloatSlow 13s ease-in-out infinite;
}

/* Filter tabs */
.filter-tab {
  transform-origin: center;
}

/* Shimmer sweep across each placeholder image */
.shimmer-wrap {
  background-size: 200% 200%;
}
.shimmer-sweep {
  transform: translateX(-120%) skewX(-12deg);
  animation: shimmerSweep 3.2s ease-in-out infinite;
}
@keyframes shimmerSweep {
  0% { transform: translateX(-120%) skewX(-12deg); }
  55%, 100% { transform: translateX(220%) skewX(-12deg); }
}

.empty-state {
  animation: fadeInUp 0.5s ease both;
}

/* Card enter/leave/move */
.card-enter-from {
  opacity: 0;
  transform: translateY(22px) scale(0.92) rotate(-1deg);
}
.card-enter-active {
  transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
  position: absolute;
}
.card-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.card-move {
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up,
  .card-enter-active,
  .card-leave-active,
  .card-move,
  .header-kicker-dot,
  .animate-blob-float,
  .animate-blob-float-slow,
  .shimmer-sweep {
    animation: none !important;
    transition: none !important;
  }
}
</style>