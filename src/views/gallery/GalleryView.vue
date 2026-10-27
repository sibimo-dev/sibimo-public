<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import Select from 'primevue/select'
import Button from 'primevue/button'
import api from '@/services/api'

const unwrap = (request) => request.then((response) => response.data.data)

const MONTHS = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
const MONTH_LABELS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const loading = ref(true)
const failed = ref(false)
const apiCategories = ref([])
const events = ref([])

function stripHtml(html) {
  if (!html) return ''
  return new DOMParser().parseFromString(html, 'text/html').body.textContent.trim()
}

// event_date dibaca sebagai string (bukan new Date) supaya tidak geser karena timezone
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
})

const categories = computed(() => [
  { slug: 'all', label: 'Semua' },
  ...apiCategories.value.map((c) => ({ slug: c.slug, label: c.name })),
])

// Opsi waktu dibuat otomatis dari bulan yang benar-benar ada di data
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
    icon: 'pi pi-users',
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
    icon: 'pi pi-heart',
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
    icon: 'pi pi-star',
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
  icon: 'pi pi-th-large',
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
function styleFor(slug) {
  return categoryStyles[slug] || defaultStyle
}
</script>

<template>
  <div class="relative overflow-hidden py-8">
    <div class="pointer-events-none absolute -left-24 -top-16 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-20 top-52 -z-10 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl animate-blob-float" />
    <div class="pointer-events-none absolute left-1/3 bottom-0 -z-10 h-56 w-56 rounded-full bg-violet-400/10 blur-3xl animate-blob-float-slow" />

    <!-- ===== HEADER ===== -->
    <div class="fade-in-up">
      <div class="inline-flex items-center gap-2">
        <span class="header-kicker-dot h-2 w-2 rounded-full bg-sky-500" />
        <span class="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">Jelajahi</span>
      </div>
      <h1 class="mt-2 text-2xl md:text-3xl font-bold text-heading">
        Galeri <span class="heading-accent">Bimomartani</span>
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
        Jadwal kegiatan, musyawarah, dan acara penting komunitas Kalurahan. Tetap
        terhubung dan berpartisipasi aktif dalam pembangunan kalurahan kita.
      </p>
    </div>

    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <!-- ===== SIDEBAR: FILTERS ===== -->
      <aside class="fade-in-up space-y-6" style="animation-delay: 60ms">
        <div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Kategori
          </p>
          <div class="space-y-1.5">
            <button
              v-for="c in categoryList"
              :key="c.slug"
              @click="activeCategory = c.slug"
              class="sidebar-tab flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
              :class="
                activeCategory === c.slug
                  ? [styleFor(c.slug).sidebarActive, 'shadow-md']
                  : 'text-default hover:bg-surface-hover hover:translate-x-0.5'
              "
            >
              <span class="flex items-center gap-2">
                <i
                  :class="[styleFor(c.slug).icon, activeCategory === c.slug ? 'text-white' : styleFor(c.slug).location]"
                  class="text-xs"
                />
                {{ c.label }}
              </span>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="
                  activeCategory === c.slug
                    ? styleFor(c.slug).sidebarCount
                    : 'bg-surface-hover text-muted'
                "
              >
                {{ c.count }}
              </span>
            </button>
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

      <!-- ===== CARD GRID ===== -->
      <div>
        <div v-if="loading" class="py-14 text-center text-sm text-muted">
          <i class="pi pi-spin pi-spinner mb-3 block text-3xl text-muted/40" />
          Memuat galeri...
        </div>

        <div v-else-if="failed" class="py-14 text-center text-sm text-muted">
          <i class="pi pi-exclamation-circle mb-3 block text-3xl text-muted/40" />
          Gagal memuat galeri. Coba muat ulang halaman.
        </div>

        <div v-else-if="filteredEvents.length === 0" class="fade-in-up empty-state flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-default py-14 text-center">
          <i class="pi pi-calendar-times text-3xl text-muted/40" />
          <p class="text-sm text-muted">Belum ada kegiatan untuk kategori/waktu yang dipilih.</p>
        </div>

        <TransitionGroup
          v-else
          tag="div"
          name="card"
          appear
          class="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <article
            v-for="(event, i) in visibleEvents"
            :key="event.id"
            class="card-item group relative overflow-hidden rounded-2xl border border-border-default bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            :class="styleFor(event.category).ring"
            :style="{ transitionDelay: `${(i % pageSize) * 60}ms` }"
          >
            <!-- colored top accent bar, one per category -->
            <span class="absolute inset-x-0 top-0 z-10 h-1" :class="styleFor(event.category).topBar" />

            <!-- image + date badge -->
            <div class="relative">
              <div
                class="relative flex h-44 w-full items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105"
                :class="!event.image && ['shimmer-wrap bg-gradient-to-br', styleFor(event.category).imageGrad]"
              >
                <img
                  v-if="event.image"
                  :src="event.image"
                  :alt="event.title"
                  class="h-full w-full object-cover"
                  style="object-position: center 35%;"
                />
                <template v-else>
                  <i class="pi pi-image text-3xl opacity-40" :class="styleFor(event.category).location" />
                  <span class="shimmer-sweep absolute inset-0 bg-gradient-to-r from-transparent to-transparent" :class="styleFor(event.category).shimmer" />
                </template>
              </div>
              <div
                class="date-badge absolute left-4 -bottom-4 rounded-xl px-3 py-2 text-center shadow-md"
                :class="styleFor(event.category).dateBg"
              >
                <p class="text-lg font-extrabold leading-none" :class="styleFor(event.category).dateNum">{{ event.day }}</p>
                <p class="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {{ event.month }}
                </p>
              </div>
            </div>

            <!-- content -->
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
              <span
                class="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="styleFor(event.category).badge"
              >
                <i :class="styleFor(event.category).icon" class="text-[10px]" />
                {{ categoryLabel(event.category) }}
              </span>
            </div>
          </article>
        </TransitionGroup>

        <!-- ===== LOAD MORE ===== -->
        <div v-if="hasMore" class="mt-8 flex justify-center">
          <Button
            label="Muat Lebih Banyak"
            icon="pi pi-chevron-down"
            icon-pos="right"
            outlined
            class="load-more-btn"
            @click="loadMore"
          />
        </div>
      </div>
    </div>
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

.header-kicker-dot {
  animation: kickerPulse 2.2s ease-in-out infinite;
}
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

.sidebar-tab {
  transform-origin: center;
}

.date-badge {
  transition: transform 0.25s ease;
}
.card-item:hover .date-badge {
  transform: translateY(-2px) scale(1.04);
}

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

.load-more-btn {
  transition: transform 0.2s ease;
}
.load-more-btn:hover {
  transform: translateY(-2px);
}
.load-more-btn:active {
  transform: translateY(0) scale(0.97);
}

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
  .shimmer-sweep,
  .date-badge,
  .load-more-btn {
    animation: none !important;
    transition: none !important;
  }
}
</style>