<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import api from '@/services/api'

const unwrap = (request) => request.then((response) => response.data.data)

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
const MONTH_LABELS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const enterClass = 'transition-all duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] starting:translate-y-3.5 starting:scale-[0.98] starting:opacity-0 motion-reduce:transition-none'
const cardDelays = ['delay-0', 'delay-[60ms]', 'delay-[120ms]', 'delay-[180ms]']

const loading = ref(true)
const failed = ref(false)
const apiCategories = ref([])
const events = ref([])
let galleryPollTimer = null

function stripHtml(html) {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent.trim()
}

function toEvent(g) {
  const date = (g.event_date ?? g.uploaded_at ?? '').slice(0, 10)
  const [, m, d] = date.split('-')
  return {
    id: g.gallery_id,
    day: d ?? '',
    month: MONTHS[Number(m) - 1] ?? '',
    monthKey: date.slice(0, 7),
    category: g.category,
    location: g.location,
    title: g.title,
    description: stripHtml(g.description),
    image: g.image,
  }
}

onMounted(async () => {
  try {
    const [cats, list] = await Promise.all([
      unwrap(api.get('/gallery-categories')),
      unwrap(api.get('/galleries')),
    ])
    apiCategories.value = cats
    events.value = list.map(toEvent)
  } catch (e) {
    failed.value = true
  } finally {
    loading.value = false
  }

  galleryPollTimer = setInterval(async () => {
    try {
      const [cats, list] = await Promise.all([
        unwrap(api.get('/gallery-categories')),
        unwrap(api.get('/galleries')),
      ])
      apiCategories.value = cats
      events.value = list.map(toEvent)
    } catch { /* silent */ }
  }, 5000)
})

onBeforeUnmount(() => {
  if (galleryPollTimer) clearInterval(galleryPollTimer)
})

const categories = computed(() => [
  { slug: 'all', label: 'Semua' },
  ...apiCategories.value.map((c) => ({ slug: c.slug, label: c.name })),
])

const timeOptions = computed(() => {
  const keys = [...new Set(events.value.map((e) => e.monthKey).filter(Boolean))].sort().reverse()
  return [
    { label: 'Semua Waktu', value: 'all' },
    ...keys.map((k) => {
      const [y, m] = k.split('-')
      return { label: `${MONTH_LABELS[Number(m) - 1]} ${y}`, value: k }
    }),
  ]
})

const categoryList = computed(() =>
  categories.value.map((c) => ({
    ...c,
    count: c.slug === 'all' ? events.value.length : events.value.filter((e) => e.category === c.slug).length,
  }))
)

const activeCategory = ref('all')
const activeTime = ref('all')
const pageSize = 4
const visibleCount = ref(pageSize)

const filteredEvents = computed(() =>
  events.value.filter((e) => {
    const matchesCategory = activeCategory.value === 'all' || e.category === activeCategory.value
    const matchesTime = activeTime.value === 'all' || e.monthKey === activeTime.value
    return matchesCategory && matchesTime
  })
)

const visibleEvents = computed(() => filteredEvents.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredEvents.value.length)

watch([activeCategory, activeTime], () => {
  visibleCount.value = pageSize
})

function loadMore() {
  visibleCount.value = Math.min(visibleCount.value + pageSize, filteredEvents.value.length)
}

function categoryLabel(slug) {
  return categories.value.find((c) => c.slug === slug)?.label ?? slug
}

const categoryStyles = {
  musyawarah: {
    sidebarActive: 'bg-sky-600 text-white shadow-sky-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
    location: 'text-sky-700',
    imageGrad: 'from-sky-100 via-cyan-100 to-sky-200',
    shimmer: 'via-sky-200/70',
    topBar: 'bg-gradient-to-r from-sky-400 to-cyan-500',
    dateBg: 'bg-sky-50',
    dateNum: 'text-sky-700',
    ring: 'hover:shadow-sky-600/10',
  },
  'kegiatan-sosial': {
    sidebarActive: 'bg-rose-600 text-white shadow-rose-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700',
    location: 'text-rose-700',
    imageGrad: 'from-rose-100 via-pink-100 to-rose-200',
    shimmer: 'via-rose-200/70',
    topBar: 'bg-gradient-to-r from-rose-400 to-pink-500',
    dateBg: 'bg-rose-50',
    dateNum: 'text-rose-700',
    ring: 'hover:shadow-rose-600/10',
  },
  budaya: {
    sidebarActive: 'bg-violet-600 text-white shadow-violet-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700',
    location: 'text-violet-700',
    imageGrad: 'from-violet-100 via-purple-100 to-violet-200',
    shimmer: 'via-violet-200/70',
    topBar: 'bg-gradient-to-r from-violet-400 to-purple-500',
    dateBg: 'bg-violet-50',
    dateNum: 'text-violet-700',
    ring: 'hover:shadow-violet-600/10',
  },
}
const defaultStyle = {
  sidebarActive: 'bg-gradient-to-r from-primary-600 via-violet-600 to-sky-600 text-white shadow-primary-600/25',
  sidebarCount: 'bg-white/15 text-white',
  dot: 'bg-primary-500',
  badge: 'bg-primary-50 text-primary-700',
  location: 'text-primary-700',
  imageGrad: 'from-surface-hover via-primary-100 to-border-default',
  shimmer: 'via-primary-200/60',
  topBar: 'bg-gradient-to-r from-primary-400 to-primary-600',
  dateBg: 'bg-primary-50',
  dateNum: 'text-heading',
  ring: 'hover:shadow-primary-600/10',
}

const fallbackStyles = [
  {
    sidebarActive: 'bg-amber-600 text-white shadow-amber-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700',
    location: 'text-amber-700',
    imageGrad: 'from-amber-100 via-orange-100 to-amber-200',
    shimmer: 'via-amber-200/70',
    topBar: 'bg-gradient-to-r from-amber-400 to-orange-500',
    dateBg: 'bg-amber-50',
    dateNum: 'text-amber-700',
    ring: 'hover:shadow-amber-600/10',
  },
  {
    sidebarActive: 'bg-emerald-600 text-white shadow-emerald-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
    location: 'text-emerald-700',
    imageGrad: 'from-emerald-100 via-green-100 to-emerald-200',
    shimmer: 'via-emerald-200/70',
    topBar: 'bg-gradient-to-r from-emerald-400 to-green-500',
    dateBg: 'bg-emerald-50',
    dateNum: 'text-emerald-700',
    ring: 'hover:shadow-emerald-600/10',
  },
  {
    sidebarActive: 'bg-orange-600 text-white shadow-orange-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700',
    location: 'text-orange-700',
    imageGrad: 'from-orange-100 via-amber-100 to-orange-200',
    shimmer: 'via-orange-200/70',
    topBar: 'bg-gradient-to-r from-orange-400 to-amber-500',
    dateBg: 'bg-orange-50',
    dateNum: 'text-orange-700',
    ring: 'hover:shadow-orange-600/10',
  },
  {
    sidebarActive: 'bg-teal-600 text-white shadow-teal-600/25',
    sidebarCount: 'bg-white/15 text-white',
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700',
    location: 'text-teal-700',
    imageGrad: 'from-teal-100 via-cyan-100 to-teal-200',
    shimmer: 'via-teal-200/70',
    topBar: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    dateBg: 'bg-teal-50',
    dateNum: 'text-teal-700',
    ring: 'hover:shadow-teal-600/10',
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
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-52 -z-10 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl animate-pulse motion-reduce:animate-none" />
    <div class="pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl animate-pulse motion-reduce:animate-none" />

    <div :class="enterClass">
      <div class="inline-flex items-center gap-2">
        <span class="h-2 w-2 animate-pulse rounded-full bg-sky-500 motion-reduce:animate-none" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">Jelajahi</span>
      </div>
      <h1 class="mt-2 text-2xl md:text-3xl font-bold text-heading">
        Galeri <span class="bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-transparent">Bimomartani</span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Kalurahan. Tetap
        terhubung dan berpartisipasi aktif dalam pembangunan kalurahan kita.
      </p>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside class="space-y-6 delay-[60ms]" :class="enterClass">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Kategori
          </p>
          <div class="space-y-1.5">
            <Button
              v-for="c in categoryList"
              :key="c.slug"
              unstyled
              class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
              :class="
                activeCategory === c.slug
                  ? [styleFor(c.slug).sidebarActive, 'shadow-md']
                  : 'text-default hover:bg-surface-hover hover:translate-x-0.5'
              "
              @click="activeCategory = c.slug"
            >
              <span>{{ c.label }}</span>
              <Tag
                unstyled
                :value="c.count"
                class="rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="
                  activeCategory === c.slug
                    ? styleFor(c.slug).sidebarCount
                    : 'bg-surface-hover text-muted'
                "
              />
            </Button>
          </div>
        </div>

        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Waktu
          </p>
          <Select
            v-model="activeTime"
            :options="timeOptions"
            option-label="label"
            option-value="value"
            class="w-full"
          />
        </div>
      </aside>

      <div>
        <div v-if="loading" class="py-14 text-center text-sm text-muted">
          <i class="pi pi-spin pi-spinner mb-3 block text-3xl text-muted/40" />
          Memuat galeri...
        </div>

        <div v-else-if="failed" class="py-14 text-center text-sm text-muted">
          <i class="pi pi-exclamation-circle mb-3 block text-3xl text-muted/40" />
          Gagal memuat galeri. Coba muat ulang halaman.
        </div>

        <div
          v-else-if="filteredEvents.length === 0"
          class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center"
          :class="enterClass"
        >
          <i class="pi pi-calendar-times text-3xl text-muted/40" />
          <p class="text-sm text-muted">Belum ada kegiatan untuk kategori/waktu yang dipilih.</p>
        </div>

        <TransitionGroup
          v-else
          tag="div"
          appear
          move-class="transition-transform! duration-[450ms]! ease-[cubic-bezier(0.34,1.56,0.64,1)]! motion-reduce:transition-none!"
          enter-from-class="opacity-0 translate-y-[22px] scale-[0.92] -rotate-1"
          enter-active-class="transition-all! duration-[550ms]! ease-[cubic-bezier(0.34,1.56,0.64,1)]! motion-reduce:transition-none!"
          leave-active-class="absolute transition-all! duration-[250ms]! motion-reduce:transition-none!"
          leave-to-class="opacity-0 scale-95"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <article
            v-for="(event, i) in visibleEvents"
            :key="event.id"
            class="group relative overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            :class="[styleFor(event.category).ring, cardDelays[i % pageSize]]"
          >
            <span class="absolute inset-x-0 top-0 z-10 h-1" :class="styleFor(event.category).topBar" />

            <div class="relative">
              <div
                class="relative flex h-44 w-full items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105"
                :class="!event.image && ['bg-gradient-to-br bg-[length:200%_200%]', styleFor(event.category).imageGrad]"
              >
                <img
                  v-if="event.image"
                  :src="event.image"
                  :alt="event.title"
                  class="h-full w-full object-cover object-[center_35%]"
                />
                <template v-else>
                  <i class="pi pi-image text-3xl opacity-40" :class="styleFor(event.category).location" />
                  <span class="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent to-transparent motion-reduce:animate-none" :class="styleFor(event.category).shimmer" />
                </template>
              </div>
              <div
                class="absolute -bottom-4 left-4 rounded-xl px-3 py-2 text-center shadow-md transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:scale-[1.04] motion-reduce:transition-none"
                :class="styleFor(event.category).dateBg"
              >
                <p class="text-lg font-extrabold leading-none" :class="styleFor(event.category).dateNum">{{ event.day }}</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {{ event.month }}
                </p>
              </div>
            </div>

            <div class="p-5 pt-7">
              <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" :class="styleFor(event.category).location">
                <i class="pi pi-map-marker text-[11px]" />
                <span>{{ event.location }}</span>
              </div>
              <h3 class="mt-2 text-lg font-bold leading-snug text-heading">
                {{ event.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                {{ event.description }}
              </p>
              <Tag
                unstyled
                :value="categoryLabel(event.category)"
                class="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="styleFor(event.category).badge"
              />
            </div>
          </article>
        </TransitionGroup>

        <div v-if="hasMore" class="mt-8 flex justify-center">
          <Button
            label="Muat Lebih Banyak"
            icon="pi pi-chevron-down"
            icon-pos="right"
            outlined
            class="transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] motion-reduce:transition-none"
            @click="loadMore"
          />
        </div>
      </div>
    </div>
  </div>
</template>