<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import {
  potentialCategories,
  loadPotentialCategories,
  fetchPotentials,
  categoryLabel,
} from '@/services/potential.service'

const activeCategory = ref('all')
const potentials = ref([])
const loading = ref(true)

const failed = ref(false)
const selectedSlug = ref(null)
const enterClass = 'transition-all duration-500 ease-out starting:translate-y-4 starting:scale-[0.98] starting:opacity-0 motion-reduce:transition-none'

onMounted(async () => {
  try {
    const [list] = await Promise.all([fetchPotentials(), loadPotentialCategories()])
    potentials.value = list
  } catch (err) {
    failed.value = true
    console.error('Gagal memuat potensi:', err)
  } finally {
    loading.value = false
  }
})

const visibleCategories = computed(() =>
  potentialCategories.filter(
    (c) => c.slug === 'all' || potentials.value.some((p) => p.category === c.slug),
  ),
)

watch(
  () => visibleCategories.value.length,
  () => nextTick(updateScrollState),
)

const filteredPotentials = computed(() =>
  activeCategory.value === 'all'
    ? potentials.value
    : potentials.value.filter((p) => p.category === activeCategory.value)
)

const categoryStyles = {
  umkm: {
    badge: 'bg-amber-500 text-white',
    iconColor: 'text-amber-600',
    imageGrad: 'from-amber-100 via-orange-100 to-amber-200',
    shimmer: 'via-amber-200/70',
    topBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
    tabActive: 'border-amber-500 bg-amber-500 text-white shadow-amber-500/30',
    tabIdleHover: 'hover:border-amber-300 hover:bg-amber-50',
    dot: 'bg-amber-500',
    btnHover: 'group-hover:border-amber-500 group-hover:bg-amber-500',
    blob: 'bg-amber-400/25',
    ring: 'hover:shadow-amber-500/15',
  },
  pertanian: {
    badge: 'bg-emerald-500 text-white',
    iconColor: 'text-emerald-600',
    imageGrad: 'from-emerald-100 via-green-100 to-emerald-200',
    shimmer: 'via-emerald-200/70',
    topBar: 'bg-gradient-to-r from-emerald-400 to-green-500',
    tabActive: 'border-emerald-500 bg-emerald-500 text-white shadow-emerald-500/30',
    tabIdleHover: 'hover:border-emerald-300 hover:bg-emerald-50',
    dot: 'bg-emerald-500',
    btnHover: 'group-hover:border-emerald-500 group-hover:bg-emerald-500',
    blob: 'bg-emerald-400/25',
    ring: 'hover:shadow-emerald-500/15',
  },
  pariwisata: {
    badge: 'bg-sky-500 text-white',
    iconColor: 'text-sky-600',
    imageGrad: 'from-sky-100 via-cyan-100 to-sky-200',
    shimmer: 'via-sky-200/70',
    topBar: 'bg-gradient-to-r from-sky-400 to-cyan-500',
    tabActive: 'border-sky-500 bg-sky-500 text-white shadow-sky-500/30',
    tabIdleHover: 'hover:border-sky-300 hover:bg-sky-50',
    dot: 'bg-sky-500',
    btnHover: 'group-hover:border-sky-500 group-hover:bg-sky-500',
    blob: 'bg-sky-400/25',
    ring: 'hover:shadow-sky-500/15',
  },
  bumdes: {
    badge: 'bg-violet-500 text-white',
    iconColor: 'text-violet-600',
    imageGrad: 'from-violet-100 via-purple-100 to-violet-200',
    shimmer: 'via-violet-200/70',
    topBar: 'bg-gradient-to-r from-violet-400 to-purple-500',
    tabActive: 'border-violet-500 bg-violet-500 text-white shadow-violet-500/30',
    tabIdleHover: 'hover:border-violet-300 hover:bg-violet-50',
    dot: 'bg-violet-500',
    btnHover: 'group-hover:border-violet-500 group-hover:bg-violet-500',
    blob: 'bg-violet-400/25',
    ring: 'hover:shadow-violet-500/15',
  },
}
const defaultStyle = {
  badge: 'bg-primary-500 text-white',
  iconColor: 'text-primary-500',
  imageGrad: 'from-surface-hover via-primary-100 to-border-default',
  shimmer: 'via-primary-200/60',
  topBar: 'bg-gradient-to-r from-primary-400 to-primary-600',
  tabActive: 'border-primary-500 bg-primary-500 text-white shadow-primary-500/30',
  tabIdleHover: 'hover:border-primary-200 hover:bg-primary-50',
  dot: 'bg-primary-500',
  btnHover: 'group-hover:border-primary-500 group-hover:bg-primary-500',
  blob: 'bg-primary-400/25',
  ring: 'hover:shadow-primary-500/15',
}
const fallbackStyles = [
  {
    badge: 'bg-rose-500 text-white',
    iconColor: 'text-rose-600',
    imageGrad: 'from-rose-100 via-pink-100 to-rose-200',
    shimmer: 'via-rose-200/70',
    topBar: 'bg-gradient-to-r from-rose-400 to-pink-500',
    tabActive: 'border-rose-500 bg-rose-500 text-white shadow-rose-500/30',
    tabIdleHover: 'hover:border-rose-300 hover:bg-rose-50',
    dot: 'bg-rose-500',
    btnHover: 'group-hover:border-rose-500 group-hover:bg-rose-500',
    blob: 'bg-rose-400/25',
    ring: 'hover:shadow-rose-500/15',
  },
  {
    badge: 'bg-teal-500 text-white',
    iconColor: 'text-teal-600',
    imageGrad: 'from-teal-100 via-cyan-100 to-teal-200',
    shimmer: 'via-teal-200/70',
    topBar: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    tabActive: 'border-teal-500 bg-teal-500 text-white shadow-teal-500/30',
    tabIdleHover: 'hover:border-teal-300 hover:bg-teal-50',
    dot: 'bg-teal-500',
    btnHover: 'group-hover:border-teal-500 group-hover:bg-teal-500',
    blob: 'bg-teal-400/25',
    ring: 'hover:shadow-teal-500/15',
  },
  {
    badge: 'bg-orange-500 text-white',
    iconColor: 'text-orange-600',
    imageGrad: 'from-orange-100 via-amber-100 to-orange-200',
    shimmer: 'via-orange-200/70',
    topBar: 'bg-gradient-to-r from-orange-400 to-amber-500',
    tabActive: 'border-orange-500 bg-orange-500 text-white shadow-orange-500/30',
    tabIdleHover: 'hover:border-orange-300 hover:bg-orange-50',
    dot: 'bg-orange-500',
    btnHover: 'group-hover:border-orange-500 group-hover:bg-orange-500',
    blob: 'bg-orange-400/25',
    ring: 'hover:shadow-orange-500/15',
  },
  {
    badge: 'bg-indigo-500 text-white',
    iconColor: 'text-indigo-600',
    imageGrad: 'from-indigo-100 via-blue-100 to-indigo-200',
    shimmer: 'via-indigo-200/70',
    topBar: 'bg-gradient-to-r from-indigo-400 to-blue-500',
    tabActive: 'border-indigo-500 bg-indigo-500 text-white shadow-indigo-500/30',
    tabIdleHover: 'hover:border-indigo-300 hover:bg-indigo-50',
    dot: 'bg-indigo-500',
    btnHover: 'group-hover:border-indigo-500 group-hover:bg-indigo-500',
    blob: 'bg-indigo-400/25',
    ring: 'hover:shadow-indigo-500/15',
  },
]

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function styleFor(slug) {
  if (!slug || slug === 'all') return defaultStyle
  return categoryStyles[slug] || fallbackStyles[hashString(slug) % fallbackStyles.length]
}

const allTabActive = 'border-slate-800 bg-slate-800 text-white shadow-slate-800/30'
const allTabIdleHover = 'hover:border-slate-300 hover:bg-slate-50'

const tabsRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
let tabsResizeObserver = null

const leftArrowClass = ref('bg-slate-800')
const rightArrowClass = ref('bg-slate-800')

function arrowClassFor(category) {
  return category.slug === 'all' ? 'bg-slate-800' : styleFor(category.slug).dot
}

function findChipIndexAt(x) {
  const chips = Array.from(tabsRef.value.children)
  let nearestIndex = 0
  let nearestDistance = Infinity
  chips.forEach((chip, index) => {
    const rect = chip.getBoundingClientRect()
    const distance = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0
    if (distance < nearestDistance) {
      nearestIndex = index
      nearestDistance = distance
    }
  })
  return nearestIndex
}

function updateScrollState() {
  const el = tabsRef.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 4
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
  const rect = el.getBoundingClientRect()
  const leftCategory = visibleCategories.value[findChipIndexAt(rect.left + 24)]
  const rightCategory = visibleCategories.value[findChipIndexAt(rect.right - 24)]
  if (leftCategory) leftArrowClass.value = arrowClassFor(leftCategory)
  if (rightCategory) rightArrowClass.value = arrowClassFor(rightCategory)
}

function scrollTabs(direction) {
  const el = tabsRef.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' })
}

function selectCategory(value, event) {
  activeCategory.value = value
  event?.currentTarget?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

const tabsMaskClass = computed(() => {
  if (canScrollLeft.value && canScrollRight.value) {
    return '[mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)]'
  }
  if (canScrollRight.value) return '[mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)]'
  if (canScrollLeft.value) return '[mask-image:linear-gradient(to_left,black_calc(100%-3rem),transparent)]'
  return ''
})

onMounted(() => {
  updateScrollState()
  tabsResizeObserver = new ResizeObserver(updateScrollState)
  if (tabsRef.value) tabsResizeObserver.observe(tabsRef.value)
})

onBeforeUnmount(() => {
  tabsResizeObserver?.disconnect()
})
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-40 -z-10 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl animate-pulse motion-reduce:animate-none" />
    <div class="pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl animate-pulse motion-reduce:animate-none" />

    <div :class="enterClass">
      <div class="inline-flex items-center gap-2">
        <span class="h-2 w-2 animate-pulse rounded-full bg-primary-500 motion-reduce:animate-none" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-primary-500">Jelajahi</span>
      </div>
      <h1 class="mt-2 text-2xl font-bold text-heading md:text-3xl">
        Potensi <span class="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">Bimomartani</span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Eksplorasi kekayaan dan aset unggulan kalurahan kami.
      </p>
    </div>

    <div class="relative mt-6 w-full max-w-2xl delay-75" :class="enterClass">
      <div v-if="canScrollLeft" class="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
        <Button
          unstyled
          aria-label="Geser ke kiri"
          class="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 active:scale-95"
          :class="leftArrowClass"
          @click="scrollTabs(-1)"
        >
          <i class="pi pi-chevron-left text-xs" />
        </Button>
      </div>

      <div
        ref="tabsRef"
        role="tablist"
        class="flex snap-x snap-proximity gap-2 overflow-x-auto scroll-smooth px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        :class="tabsMaskClass"
        @scroll.passive="updateScrollState"
      >
        <Button
          v-for="c in visibleCategories"
          :key="c.slug"
          unstyled
          role="tab"
          :aria-selected="activeCategory === c.slug"
          class="flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 sm:text-sm"
          :class="activeCategory === c.slug
            ? [c.slug === 'all' ? allTabActive : styleFor(c.slug).tabActive, 'shadow-md']
            : ['border-border-default bg-surface text-default', c.slug === 'all' ? allTabIdleHover : styleFor(c.slug).tabIdleHover]"
          @click="selectCategory(c.slug, $event)"
        >
          <span
            v-if="c.slug !== 'all'"
            class="h-1.5 w-1.5 rounded-full"
            :class="activeCategory === c.slug ? 'bg-white' : styleFor(c.slug).dot"
          />
          <span>{{ c.slug === 'all' ? 'Semua Kategori' : c.label }}</span>
        </Button>
      </div>

      <div v-if="canScrollRight" class="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
        <Button
          unstyled
          aria-label="Geser ke kanan"
          class="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition-colors duration-200 active:scale-95"
          :class="rightArrowClass"
          @click="scrollTabs(1)"
        >
          <i class="pi pi-chevron-right text-xs" />
        </Button>
      </div>
    </div>

    <div v-if="loading" class="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center" :class="enterClass">
      <i class="pi pi-spin pi-spinner text-3xl text-primary-500" />
      <p class="text-sm text-muted">Memuat data potensi...</p>
    </div>

    <div v-else-if="failed" class="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center" :class="enterClass">
      <i class="pi pi-exclamation-circle text-3xl text-muted/40" />
      <p class="text-sm text-muted">Gagal memuat data potensi. Coba muat ulang halaman.</p>
    </div>

    <div v-else-if="filteredPotentials.length === 0" class="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center" :class="enterClass">
      <i class="pi pi-inbox text-3xl text-muted/40" />
      <p class="text-sm text-muted">Belum ada data potensi untuk kategori ini.</p>
    </div>

    <TransitionGroup
      v-else
      tag="div"
      appear
      enter-from-class="opacity-0 translate-y-5 scale-90"
      leave-active-class="absolute"
      leave-to-class="opacity-0 scale-95"
      class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="item in filteredPotentials"
        :key="item.slug"
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        :class="styleFor(item.category).ring"
        @click="selectedSlug = item.slug"
      >
        <span
          class="absolute left-0 top-0 z-10 h-1 transition-all duration-500 ease-out"
          :class="[styleFor(item.category).topBar, selectedSlug === item.slug ? 'w-full' : 'w-1/2']"
        />

        <div class="relative">
          <div
            class="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br transition-transform duration-500 group-hover:scale-105"
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
              <span class="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent to-transparent motion-reduce:animate-none" :class="styleFor(item.category).shimmer" />
            </template>
          </div>
          <Tag
            unstyled
            :value="categoryLabel(item.category)"
            class="absolute left-3 top-3 z-20 flex items-center rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md"
            :class="styleFor(item.category).badge"
          />
        </div>

        <div class="flex flex-1 flex-col p-5">
          <h3 class="text-lg font-bold leading-snug text-heading transition-colors duration-200">
            {{ item.name }}
          </h3>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
            {{ item.shortDesc }}
          </p>

          <Button
            :as="RouterLink"
            unstyled
            :to="{ name: 'potential-detail', params: { slug: item.slug } }"
            class="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border-default py-2.5 text-sm font-semibold text-default transition-all duration-200 group-hover:text-white"
            :class="styleFor(item.category).btnHover"
          >
            Lihat Detail
            <i class="pi pi-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      </article>
    </TransitionGroup>
  </div>
</template>